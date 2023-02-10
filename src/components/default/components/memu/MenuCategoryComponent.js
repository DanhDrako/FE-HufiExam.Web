import { SearchOutlined, TagsOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import FACTORY from '../../../../common/FACTORY';
import { ActionType } from '../../../../common/utils/actions-type';
import { Apis } from '../../../../common/utils/Apis';
import { MessageKeys, NotificationKeys } from '../../../../common/utils/keys';
import SelectCategoryComponent from '../../../admin-v2/right/components/components/SelectCategoryComponent';
import SelectTagsComponents from '../../../admin-v2/right/components/components/SelectTagNameComponent';

// import loadable from '@loadable/component';
// const SelectCategoryComponent = loadable(() => import('../../../admin-v2/right/components/components/SelectCategoryComponent'));
// const SelectTagsComponents = loadable(() => import('../../../admin-v2/right/components/components/SelectTagNameComponent'));

class MenuCategoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCate: null,
      listTags: null,
      isBlackMarket: false,
    }
    this.loadListCate();
    this.loadListTags();
    this.dispatch = this.props.dispatch;
  }

  async loadListCate() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    PublicModules.fun_get(
      Apis.API_HOST + Apis.API_TAILER.CATE,
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Tải thể loại bị lỗi',
          message: MessageKeys.CHECK_CONNECTION,
        });
        return;
      }

      // insert all select
      const list = [];
      list.push({
        id: 0,
        name: 'Tất cả thể loại',
      });
      list.push(...dataRes.data);
      let cateSelect = list[0];
      this.setState({
        listCate: list,
        defaultCateSelected: cateSelect,
      }, () => {
        this.dispatch({
          type: ActionType.POST_FILTER_UPDATE,
          value: { ...this.props.filterPost, cate: cateSelect }
        });
      });
    });
  }

  async loadListTags() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    PublicModules.fun_get(
      Apis.API_HOST + Apis.API_TAILER.TAG_NAME,
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Tải tags bị lỗi',
          message: MessageKeys.CHECK_CONNECTION,
        });
        return;
      }

      this.setState({
        listTags: dataRes.data,
      });
    });
  }

  selectCateChange(cateId) {
    const cate = this.state.listCate.find((v) => String(v.id) === String(cateId));
    this.setState({
      defaultCateSelected: cate,
    }, () => {
      this.dispatch({
        type: ActionType.POST_FILTER_UPDATE,
        value: { ...this.props.filterPost, cate: cate, page: 1, },
      });
    });
  }

  selectTagsChange(tags) {
    this.dispatch({
      type: ActionType.POST_FILTER_UPDATE,
      value: { ...this.props.filterPost, tags: tags, page: 1, },
    });
  }

  tbKeyWordChange(e) {
    const value = e.target.value;
    this.dispatch({
      type: ActionType.POST_FILTER_UPDATE,
      value: { ...this.props.filterPost, keyWord: value, page: 1, },
    });
  }

  render() {
    if (this.state.isBlackMarket)
      return (
        <Redirect to='/black-market' />
      );
    return (
      <div className='m-0 p-3 border border-10 shadow bg-white'>
        <Collapse>
          <Collapse.Panel header={<span className='fw-bold text-uppercase'>Tìm kiếm và lọc bài viết tại đây</span>}>
            <div className='row'>
              <div className='col-xxl-4 col-xl-4 col-md-4 col-sm-12'>
                <div className='p-2 border border-10 mb-2'>
                  <p className='mb-1 fw-bold'>
                    <SearchOutlined className='m-2 mt-0 mb-0' />
                          Nhập từ tìm kiếm
                  </p>
                  <span className="spinner-grow spinner-grow-sm m-2 mt-0 mb-0 text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </span>
                  <div className='mb-2' style={{ height: '40px' }}>
                    <figcaption className="blockquote-footer m-2">
                      Nhập từ khóa để tìm, đừng quên chọn thể loại nửa nhé.
                  </figcaption>
                  </div>
                  <input onChange={(e) => this.tbKeyWordChange(e)} type='text' className='form-control' />
                </div>
              </div>
              <div className='col-xxl-4 col-xl-4 col-md-4 col-sm-12'>
                <div className='p-2 border border-10 mb-2'>
                  <p className='mb-1 fw-bold'>
                    <UnorderedListOutlined className='m-2 mt-0 mb-0' />
                Chọn thể loại lọc
                </p>
                  <div className='mb-2' style={{ height: '40px' }}>
                    <figcaption className="blockquote-footer m-2">
                      Sẽ tìm kiếm theo thể loại tại đây.
                </figcaption>
                  </div>
                  <SelectCategoryComponent
                    disabled={this.props.isBlackMarket}
                    onChange={(e) => this.selectCateChange(e)}
                    defaultValue={this.state.defaultCateSelected}
                    listCate={this.state.listCate} className='form-control' />
                </div>
              </div>
              <div className='col-xxl-4 col-xl-4 col-md-4 col-sm-12'>
                <div className='p-2 border border-10'>
                  <p className='mb-1 fw-bold'>
                    <TagsOutlined className='m-2 mt-0 mb-0' />
                Chọn thẻ đã gắn
                </p>
                  <div className='mb-2' style={{ height: '40px' }}>
                    <figcaption className="blockquote-footer m-2">
                      Có thể các bài viết theo thẻ đã gắn nếu bạn muốn.
                </figcaption>
                  </div>
                  <SelectTagsComponents
                    disabled={this.props.isBlackMarket}
                    listTags={this.state.listTags}
                    onChange={(e) => this.selectTagsChange(e)}
                    className='form-control' />
                </div>
              </div>
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    filterPost: state.filterPost,
  }
}

export default connect(mapStateToProps)(MenuCategoryComponent);