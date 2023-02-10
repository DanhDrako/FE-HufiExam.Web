import React, { Component } from 'react';
import RoleUser from '../../../../../common/utils/keys/RoleUserKey';
import { Button, Checkbox, message, Steps } from 'antd';
import { UploadOutlined, RetweetOutlined, SaveOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { ImageUploadKeys, NotificationKeys } from '../../../../../common/utils/keys';
import { Apis } from '../../../../../common/utils/Apis';
import FACTORY from '../../../../../common/FACTORY';
import UpdateQuestionAnswerComponent from './UpdateQuestionAnswerComponent';

// import loadable from '@loadable/component';
// const UpdateQuestionAnswerComponent = loadable(() => import('./UpdateQuestionAnswerComponent'));

const initialState = {
  userLoged: {},
  uploaded: false,
  pdf2Text: false,
  text2Json: false,
  saveOnDb: false,
  valueResultPreview: '',
  fileSelected: null,
  isLoading: false,
  fileNameUploaded: null,
  dataText: null,
  dataJson: null,
  tbQPrefix: '',
  tbAPrefix: '',
  totalQA: null,
  isShowQuestionAnswer: false,
  isQa: false,
}

class QuestionAnserComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      userLoged: FACTORY.fun_getUserLoginLocalStorage(),
    }
  }

  componentWillUnmount() {
    this.deleleFileAndRelease(false);
  }

  async fileUploadChange(event) {
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    // check size: < 4 MB
    const maxSize = process.env.REACT_APP_MAX_SIZE_UPLOAD_MARKET;
    const size = file.size / 1024 / 1024;
    if (size > maxSize) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'File Quá lớn !',
        message: 'Hiện tại chỉ cho phép tối đa hình < 4 MB',
      });
      return;
    }
    this.setState({
      fileSelected: file,
      valueResultPreview: `FileName: ${file.name}\nSize: ${size} MB\nType: ${file.type}`,
    });
  }

  tbOnChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value || '',
    })
  }

  cbSaveOnDBChange(e) {
    this.setState({ isAccessSaveOnDB: e.target.checked });
  }

  getUIStepForUser() {
    if (this.state.isLoading)
      return <></>
    if (!this.state.uploaded)
      return (
        <input onChange={(e) => this.fileUploadChange(e)} type='file' className='form-control' accept=".pdf" />
      );
    if (!this.state.pdf2Text)
      return (
        <></>
      );
    if (!this.state.text2Json || !this.state.isAccessSaveOnDB)
      return (
        <div className='row'>
          <div className='col-6'>
            <Input onChange={(e) => this.tbOnChange(e)} name='tbQPrefix' addonBefore='Question Prefix' placeholder='example: cau' />
          </div>
          <div className='col-6'>
            <Input onChange={(e) => this.tbOnChange(e)} name='tbAPrefix' addonBefore='Anwser Prefix' placeholder='example: a. b. c. d.' />
          </div>
        </div>
      );
  }

  async handleUploadFilePDF() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    if (!this.state.fileSelected) {
      message.error('Chưa chọn file upload');
      return;
    }
    this.setState({ isLoading: true });
    // handle upload
    const dataRes = await PublicModules.fun_uploadAnImageToServer(
      this.state.fileSelected, ImageUploadKeys.SERVER,
    );
    // error.
    if (!dataRes) {
      this.setState({ isLoading: false, })
      return;
    }
    // success & -> next step
    this.setState({
      uploaded: true,
      isLoading: false,
      valueResultPreview: `fileName: ${dataRes.fileName}\nurlView: ${dataRes.urlView}`,
      fileNameUploaded: dataRes.fileName,
    });
  }

  async handlePdf2Text() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    if (!this.state.fileSelected || !this.state.fileNameUploaded) {
      message.error('Chưa chọn file upload');
      return;
    }
    this.setState({ isLoading: true });
    const dataRes = await PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.PDF_TO_TEXT + this.state.fileNameUploaded,
      null,
      PublicModules.fun_getConfigBearerDefault({}),
    );
    // error.
    if (!dataRes.success) {
      message.error(PublicModules.fun_mapErrorToMessage(dataRes.message));
      this.setState({ isLoading: false, })
      return;
    }
    // success & -> next step
    this.setState({
      pdf2Text: true,
      isLoading: false,
      valueResultPreview: `text: ${dataRes.data.text}`,
      dataText: dataRes.data.text,
    });
  }

  async handleText2Json() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    if (!this.state.fileSelected || !this.state.fileNameUploaded || !this.state.dataText) {
      message.error('Chưa chọn file upload');
      return;
    }
    const Qtext = this.state.tbQPrefix.trim();
    const Atext = this.state.tbAPrefix.trim();
    if (Qtext.length === 0 || Atext.length === 0) {
      message.error('Nhập không hợp lệ');
      return;
    }
    this.setState({ isLoading: true });
    const dataRes = await PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.TEXT_TO_JSON + this.state.fileNameUploaded,
      {
        "qFind": Qtext,
        "aFinds": Atext.split(' '),
      },
      PublicModules.fun_getConfigBearerDefault({}),
    );
    // error.
    if (!dataRes.success) {
      message.error(PublicModules.fun_mapErrorToMessage(dataRes.message));
      this.setState({ isLoading: false, })
      return;
    }
    // success & -> next step
    this.setState({
      text2Json: true,
      isLoading: false,
      dataJson: dataRes.data,
      totalQA: dataRes.total,
    });
  }

  async handleSaveOnDB() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const postId = this.props.post.id;
    if (!postId) return;
    if (!this.state.fileSelected || !this.state.fileNameUploaded || !this.state.dataText || !this.state.dataJson) {
      message.error('Chưa chọn file upload');
      return;
    }
    const Qtext = this.state.tbQPrefix.trim();
    const Atext = this.state.tbAPrefix.trim();
    if (Qtext.length === 0 || Atext.length === 0) {
      message.error('Nhập không hợp lệ');
      return;
    }
    this.setState({ isLoading: true });
    const dataRes = await PublicModules.fun_post(
      `${Apis.API_HOST + Apis.API_TAILER.INSERT_QUESTION_ANSWER + postId}/${this.state.fileNameUploaded}`,
      {
        "qFind": Qtext,
        "aFinds": Atext.split(' '),
      },
      PublicModules.fun_getConfigBearerDefault({}),
    );
    // error.
    if (!dataRes.success) {
      message.error(PublicModules.fun_mapErrorToMessage(dataRes.message));
      this.setState({ isLoading: false, })
      return;
    }
    // success & -> next step
    this.setState({
      saveOnDb: true,
      isLoading: false,
    });
  }

  async btnNextClicked() {
    if (this.state.isLoading) return;
    if (!this.state.uploaded) {
      await this.handleUploadFilePDF();
      return;
    }
    if (!this.state.pdf2Text) {
      await this.handlePdf2Text();
      return;
    }
    if (!this.state.text2Json || !this.state.isAccessSaveOnDB) {
      await this.handleText2Json();
      return;
    }
    if (!this.state.saveOnDb) {
      await this.handleSaveOnDB();
      return;
    }
  }

  getStatus(value) {
    if (this.state.isLoading) return 'process';
    if (value) return 'finish';
    return 'wait';
  }

  getQAPreviewUI() {
    return (
      <div style={{ maxHeight: '200px', overflow: 'auto', margin: '10px 0px 0px 0px' }}>
        {this.state.dataJson.map((v, k) => {
          return (
            <div key={k}>
              <p className='fw-bold'>{v.Q}</p>
              {v.A.map((i, j) => {
                return (
                  <p key={k + '-' + j}>{FACTORY.fun_mapNumberToLetter(j) + i}</p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  async deleleFileAndRelease(isInitalState) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const fileName = this.state.fileNameUploaded;
    if (!fileName) return;
    const dataRes = await PublicModules.fun_delete(
      Apis.API_HOST + Apis.API_TAILER.FILE + fileName,
      PublicModules.fun_getConfigBearerDefault({}),
    );
    if (dataRes.success && dataRes.data)
      message.info('Delete file: ' + fileName + ' Successfully');
    if (isInitalState)
      this.setState({ ...initialState });
  }

  render() {
    if (this.state.saveOnDb || this.props.post.countQuestion !== 0)
      return (
        <>
          <Button
            onClick={() => this.setState({ isShowQuestionAnswer: !this.state.isShowQuestionAnswer })}
            type={this.state.isShowQuestionAnswer ? 'link' : 'primary'} className='m-2'>
            {this.state.isShowQuestionAnswer ? 'Hide Question Answer' : 'Update Question, Answer'}
          </Button>
          <span className='text-uppercase fw-bold m-2 text-danger'>total: {this.props.post.countQuestion}</span>
          <Checkbox onChange={(e) => this.setState({ isQa: e.target.checked })} className='float-end'>Đã trả lời</Checkbox>
          <br />
          <hr />

          {this.state.isShowQuestionAnswer ?
            <UpdateQuestionAnswerComponent
              postId={this.props.post.id}
              isQa={this.state.isQa}
            /> :
            ''
          }
        </>
      );
    if (!this.state.userLoged || this.state.userLoged.role !== RoleUser.ADMIN)
      return (
        <span className='text-uppercase fw-bold m-2 text-danger'>total questions: {this.props.post.countQuestion}</span>
      );
    return (
      <div>
        {FACTORY.fun_getGl_loading(this.state.isLoading)}
        <div className='m-3'>
          <div className='mb-2'>
            {this.getUIStepForUser()}
          </div>
          {!this.state.text2Json ?
            <></> :
            <div>
              <Checkbox onChange={(e) => this.cbSaveOnDBChange(e)} className='fw-bold text-danger'>I'm finish and save on Database</Checkbox>
            </div>
          }
        </div>
        <Steps>
          <Steps.Step status={this.getStatus(this.state.uploaded)} title={this.state.uploaded ? 'Finish' : 'Upload PDF'} icon={<UploadOutlined />} />
          <Steps.Step status={this.getStatus(this.state.text2Json)} title={this.state.text2Json ? 'Finish' : 'Text to Json'} icon={<RetweetOutlined />} />
          <Steps.Step status={this.getStatus(this.state.pdf2Text)} title={this.state.pdf2Text ? 'Finish' : 'PDF to Text'} icon={<RetweetOutlined />} />
          <Steps.Step status={this.getStatus(this.state.saveOnDb)} title={this.state.saveOnDb ? 'Finish' : 'Save on DB'} icon={<SaveOutlined />} />
        </Steps>
        <hr />
        <p className='_text-sec fw-bold'>Result Preview
          {this.state.totalQA ?
            <span className='_text-thr text-uppercase'>
              {` Total: ${this.state.totalQA} Question.`}
            </span> :
            <></>
          }
        </p>
        <Input.TextArea
          className='form-control'
          value={this.state.valueResultPreview} rows={5} readOnly placeholder='Result will show in here' />
        {this.state.text2Json ?
          this.getQAPreviewUI() :
          <></>
        }
        <div className='mt-3' style={{ textAlign: 'right' }}>
          <Button className='m-2' loading={this.state.isLoading} onClick={() => this.deleleFileAndRelease(true)} type='primary' danger>
            Cancel All
          </Button>
          <Button loading={this.state.isLoading} onClick={() => this.btnNextClicked()} type='primary'>
            Next
          </Button>
        </div>
      </div>
    );
  }
}

export default QuestionAnserComponent;