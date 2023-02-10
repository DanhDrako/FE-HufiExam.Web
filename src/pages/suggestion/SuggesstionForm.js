import React from 'react'
import { Component } from 'react';
import FACTORY from '../../common/FACTORY';
import { Apis } from '../../common/utils/Apis';
import { NotificationKeys } from '../../common/utils/keys';

class SuggesstionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      message: '',
    }

  }

  async sendSuggestion(_e) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();

    if (this.state.title === '') {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Thông báo!',
        message: 'Vui lòng nhập tiêu đề của bạn!',
      });
      return;
    }

    if (this.state.message === '') {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Thông báo!',
        message: 'Vui lòng nhập nội dung của bạn!',
      });
      return;
    }

    const res = await PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.SUGESSTION,
      {
        title: this.state.title,
        message: this.state.message
      },
      PublicModules.fun_getConfigBearerDefault({})
    )

    if (res.success) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.SUCCESS,
        title: 'Gửi thành công!',
        message: 'Cám ơn bạn đã gửi góp ý đến chúng tôi!',
      });
      this.props.onReload();
    }
  }

  render() {
    return (
      <div className="container mt-4">
        <div className="row" style={{ minHeight: '400px' }}>
          <div className="col-12 col-sm-12 col-md-4 col-lg-4">
            <div className="container text-center">
              <h3 className='text-uppercase fw-bold'>Thư góp ý</h3>
              <p>
                Chào bạn, danh mục này dành cho tất cả mọi người mong muốn góp ý cũng như chỉnh sửa các tính năng trong tương lai để phù hợp với nhu cầu sử dụng của tất cả mọi người!
                                </p>
              <p>
                Rất cám ơn bạn đã chân thành góp ý với chúng tôi!
              </p>
              <div className='text-center'>
                <img src='/image/logos/logo-200.png' alt='logo-icon' width='140px' height='140px'/>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-8 col-lg-8 bg-border mb-5">
            <div className="container pt-3 pb-3">
              <div className="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label fw-bolder">Tiêu đề</label>
                <input value={this.state.title} onChange={(e) => { this.setState({ title: e.target.value }) }} type="text" className="form-control" id="exampleFormControlInput1" />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label fw-bolder">Nôi dung thư góp ý</label>
                <textarea value={this.state.message} onChange={(e) => { this.setState({ message: e.target.value }) }} className="form-control" id="exampleFormControlTextarea1" rows={3} />
              </div>
              <div className="text-center">
                <button
                  onClick={(e) => { this.sendSuggestion(e) }}
                  className='btn-ds outline-pr'
                >
                  <i className="fas fa-paper-plane">&nbsp;</i>
                  Góp ý
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SuggesstionForm;
