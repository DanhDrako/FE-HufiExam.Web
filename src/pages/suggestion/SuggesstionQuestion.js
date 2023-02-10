import React from 'react'
import { Component } from 'react';
import FACTORY from '../../common/FACTORY';
import { Apis } from '../../common/utils/Apis';
import { MessageKeys, NotificationKeys } from '../../common/utils/keys';
import PagingComponent from '../../components/common/PagingComponent';
import SuggesstionForm from './SuggesstionForm';
import moment from 'moment';
import { Tag } from 'antd';
import ButtonGoToFacebook from '../../components/common/ButtonGoToFacebook';

class SuggesstionQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listSupport: [],
      totalSupport: 0,
      comment: '',
      idCommentVisible: -1,
      currentPagination: {}
    }
  }

  componentDidMount() {
    this.listSupport(1, Apis.NUM_PER_PAGE)
  }

  async listSupport(page, pageSize) {
    this.setState({
      currentPagination: {
        page: page,
        pageSize: pageSize
      }
    })
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES()
    const coreUI = await FACTORY.GET_CORE_UI()

    let url = Apis.API_HOST + Apis.API_TAILER.SUGESSTION;
    url += `?page=${page}&limit=${pageSize}`;
    const response = await PublicModules.fun_get(
      url
    );

    if (!response.success) {
      coreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Tải danh sách góp ý bị lỗi',
        message: MessageKeys.CHECK_CONNECTION,
      });
      return;
    }

    this.setState({
      listSupport: response.data,
      totalSupport: response.total
    })

  }

  async comment(_e, value) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (this.state.comment === '') {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Thông báo!',
        message: 'Vui lòng nhập bình luận của bạn!',
      });
      return;
    }

    const res = await PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.SUGESSTION,
      {
        title: "Reply support" + value.id,
        message: this.state.comment,
        idSupportFather: value.id
      },
      PublicModules.fun_getConfigBearerDefault({})
    )


    if (res.success) {
      this.setState({
        idCommentVisible: -1
      })
      CoreUI.fun_showNotification({
        type: NotificationKeys.SUCCESS,
        title: 'Gửi thành công!',
        message: 'Đã gửi trả lời!',
      });
      this.listSupport(this.state.currentPagination.page, this.state.currentPagination.pageSize)
      return;
    }
  }

  btnReplyClicked(id) {
    if (this.state.idCommentVisible === id)
      this.setState({ idCommentVisible: -1, comment: '' });
    else
      this.setState({ idCommentVisible: id, comment: '' });
  }

  getSupport() {
    return this.state.listSupport.map((value, key) => {
      return (
        <div key={key} className="m-2 p-2 bg-border">
          <div>
            <span role="link" className="d-flex align-items-center text-white text-decoration-none">
              <img src={FACTORY.fun_getAvatarImageView(value.user.avatar, value.user.avatarUploadType)} alt="" width={32} height={32} className="rounded-circle me-2" />
              <p style={{ paddingTop: "7px" }}><b>{value.user.displayName}</b>
                <span className='text-muted'>&nbsp;{value.user.userName}&nbsp;</span>
                <Tag className='tag-sec'>{moment(value.createAt).fromNow()}&nbsp;</Tag>
                <span><ButtonGoToFacebook user={value.user} /></span>
              </p>
            </span>
          </div>
          <div style={{ paddingLeft: "50px" }}>
            <p className='mb-1' style={{ wordBreak: 'break-word' }}><b>Tiêu đề : </b> {value.title}</p>
            <p style={{ wordBreak: 'break-word' }}><b>Nội dung : </b> {value.message}</p>
            <b>{value.replys.length !== 0 ? 'Phản hồi:' : ''}</b>
            <div style={{ paddingLeft: '20px' }}>
              {
                value.replys.map((value2, key2) => {
                  return (
                    <div key={key2}>
                      <span role="link" className="d-flex align-items-center text-white text-decoration-none">
                        <img src={FACTORY.fun_getAvatarImageView(value2.user.avatar, value2.user.avatarUploadType)} alt="" width={32} height={32} className="rounded-circle me-2" />
                        <p style={{ paddingTop: "7px" }}><b>{value2.user.displayName}</b>
                          <span className='text-muted'>&nbsp;{value2.user.userName}&nbsp;</span>
                          <Tag className='tag-sec'>{moment(value2.createAt).fromNow()}&nbsp;</Tag>
                          <span><ButtonGoToFacebook user={value2.user} /></span>
                        </p>
                      </span>
                      <p style={{ paddingLeft: "50px" }}>{value2.message}</p>
                    </div>
                  )
                })
              }
            </div>

            <span
              onClick={() => this.btnReplyClicked(value.id)}
              role='link'>
              <i className="fas fa-reply mb-3">&nbsp;</i>Trả lời
                  </span>
            {this.state.idCommentVisible > 0 && this.state.idCommentVisible === value.id ?
              <div>
                <div className="mb-3 input-group" style={{ width: "65%" }}>
                  <input value={this.state.comment} onChange={(e) => { this.setState({ comment: e.target.value }) }}
                    className="form-control custom-control" placeholder="Viết bình luận của bạn tại đây...." style={{ borderRadius: "25px 0px 0px 25px" }} />
                  <span onClick={(e) => { this.comment(e, value) }} className='input-group-addon btn-ds outline-pr' style={{ borderRadius: "0px 25px 25px 0px" }}>
                    <i className="fas fa-paper-plane">&nbsp;</i>
                  </span>
                </div>
              </div> : ''}
          </div>
        </div>
      )
    })
  }


  onPageChange = (page, pageSize) => {
    this.listSupport(page, pageSize)
    window.scrollTo(0, 0);
  };

  render() {
    return (
      <div className="container">
        <SuggesstionForm
          onReload={() => this.listSupport(1, Apis.NUM_PER_PAGE)}
        />
        <h3 className='m-2 text-uppercase fw-bold'>Các góp ý gần đây</h3>
        <div className="pt-3">
          {this.getSupport()}
        </div>

        <div className="w-100 mt-3 mb-3 p-3">
          <PagingComponent
            total={this.state.totalSupport}
            onPageChange={(page, pageSize) => this.onPageChange(page, pageSize)}
          />
        </div>
      </div>
    )
  }
}

export default SuggesstionQuestion
