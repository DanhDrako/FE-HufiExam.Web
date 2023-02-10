import React, { Component } from 'react';
import loadable from '@loadable/component';
import { LoadingOutlined } from '@ant-design/icons';
import { Apis } from "../../common/utils/Apis";
import FACTORY from '../../common/FACTORY';
import RoleUser from '../../common/utils/keys/RoleUserKey';

const ck = loadable(() => import('@ckeditor/ckeditor5-react'));
const edit = loadable(() => import('ckeditor5-custom-build/build/ckeditor'));

let CKEditor = null;
let ClassicEditor = null;

const editorConfiguration = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'fontSize',
      'highlight',
      'strikethrough',
      '|',
      'outdent',
      'alignment',
      'indent',
      '|',
      'imageUpload',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'imageInsert',
      'code',
      'codeBlock',
      'htmlEmbed',
      'horizontalLine',
      '|',
      'pageBreak',
      'redo',
      'undo',
      '|'
    ],
    shouldNotGroupWhenFull: true
  },
  language: 'en',
  image: {
    toolbar: [
      'imageTextAlternative',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      'linkImage'
    ]
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells'
    ]
  },
  licenseKey: '',
};

class CkeditorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      url: Apis.API_HOST + Apis.API_TAILER.UPLOAD_IMAGE_SERVER + 'ckeditor',
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      ck.load().then((editor) => {
        CKEditor = editor.CKEditor;
        edit.load().then((editLoaded) => {
          ClassicEditor = editLoaded.default;
          this.setState({ isLoading: false });
        })
      });
    });
  }

  componentWillUnmount() {
    CKEditor = null;
    ClassicEditor = null;
  }

  handleOnChange(data) {
    if (!data) return;
    this.props.onChange(data);
  }

  getConfig() {
    const user = FACTORY.fun_getUserLoginLocalStorage();
    if (!user || user.role === RoleUser.MEM)
      return editorConfiguration;
    else return {
      ckfinder: {
        uploadUrl: this.state.url,
      },
      ...editorConfiguration,
    }
  }

  render() {
    return (
      <div className="App mt-3">
        {!this.state.isLoading && CKEditor != null && ClassicEditor != null ?
          <CKEditor
            config={this.getConfig()}
            editor={ClassicEditor}
            data={this.props.defaultValue}
            onReady={_editor => {
              // You can store the "editor" and use when it is needed.
              // console.log('Editor is ready to use!', editor);
            }}
            onChange={(_event, editor) => this.handleOnChange(editor.getData())}
            onBlur={(_event, _editor) => {
              // console.log('Blur.', editor);
            }}
            onFocus={(_event, _editor) => {
              // console.log('Focus.', editor);
            }}

          /> : <LoadingOutlined />}
      </div>
    );
  }
}

export default CkeditorComponent;