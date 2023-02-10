import { Input, Modal } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import FACTORY from '../../../../../../common/FACTORY';
import { Apis } from '../../../../../../common/utils/Apis';
import { NotificationKeys } from '../../../../../../common/utils/keys';
import TitleForModel from '../../../../../home/header/components/TitleForModel';

// import loadable from '@loadable/component';
// const TitleForModel = loadable(() => import('../../../../../home/header/components/TitleForModel'));

const initialState = {
  redirectTo: null,
  isRandom: false,
  numberQa: 40,
  totalTime: 24 * 60,
  numberTime: 45,
  totalQa: 0,
  numberSkip: 0,
  isLoading: false,
}

class ButtonExamComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
    }
  }

  async btnExamNowClicked() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();

    // interup ?
    if (this.props.post && !this.props.post.countQuestion) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.INFO,
        title: 'Chưa có bộ đề cho bài viết này!',
        message: 'Bài viết này sẽ sớm có bộ đề, bạn hãy quay lại sau',
      });
      return;
    }

    // exam
    const userLoged = FACTORY.fun_getUserLoginLocalStorage();
    if (!userLoged) {
      await CoreUI.fun_showConfirm({
        title: 'Cần đăng nhập để THI!',
        message: 'Để thực hiện hành động THI bạn cần đăng nhập trước. [ nút đăng nhập ở góc phía trên, bên phải màn hình ] mẹo: đăng nhập bằng google hay facebook cho nó nhanh.',
      });
      const btnLogin = document.getElementById('btnLogin');
      try {
        if (btnLogin) btnLogin.click();
      } catch { }
      return;
    }
    // checking...
    const keyLoading = CoreUI.fun_showNotification({
      type: NotificationKeys.LOADING,
      message: 'Đang kiểm tra!',
    });
    const isMarket = this.props.post ? this.props.post.isBlackMarket : false;
    if (isMarket) {
      CoreUI.fun_closeNotificationLoading(keyLoading);
      return;
    }
    // show modal
    this.setState({ isLoading: true }, () => {
      PublicModules.fun_get(
        Apis.API_HOST + Apis.API_TAILER.POST + this.props.post.id,
      ).then((dataRes) => {
        CoreUI.fun_closeNotificationLoading(keyLoading);
        // error ?
        if (!dataRes.success) {
          CoreUI.fun_showNotification({
            type: NotificationKeys.ERROR,
            title: 'Tải đề thi bị lỗi!',
            message: PublicModules.fun_mapErrorToMessage(dataRes.message),
          });
          return;
        }
        const total = dataRes.data.countQuestion;
        if (total === 0) {
          CoreUI.fun_showNotification({
            type: NotificationKeys.INFO,
            title: 'Chưa có bộ đề cho bài viết này!',
            message: 'Bài viết này sẽ sớm có bộ đề, bạn hãy quay lại sau',
          });
          return;
        }
        this.setState({
          isModalVisible: true,
          totalQa: total,
          isRandom: dataRes.data.isRandom,
        });
      });
    });
  }

  handleOk() {
    this.setState({ redirectTo: `/examquiz/${this.props.post.id}/${(this.state.totalQa >= this.state.numberQa ? this.state.numberQa : this.state.totalQa) || ''}/${this.state.numberTime}/${this.state.numberSkip}/${this.state.isRandom}/${this.props.post.title}`, isModalVisible: false });
  }

  handleCancel() {
    this.setState({ isModalVisible: false });
  }

  tbOnChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    try {
      let num = Number.parseInt(value);
      if (name === 'numberQa' && num > this.state.totalQa) num = this.state.totalQa;
      if (name === 'numberTime' && num > this.state.totalTime) num = this.state.totalTime;
      this.setState({ [name]: num });
    } catch {
      this.setState({ [name]: 40 });
    }
  }

  getDisableClass(){
    if (this.props.post && this.props.post.countQuestion) return '';
    return ' disable';
  }

  render() {
    if (this.state.redirectTo)
      return (
        <Redirect to={this.state.redirectTo} />
      );
    return (
      <>
        <button
          className={'btn-ds outline-sec block' + this.getDisableClass()}
          onClick={() => this.btnExamNowClicked()}
        >
          <i className="fas fa-tasks">&nbsp;</i>
          {this.props.text || 'Luyện tập (Thi thử)'}
        </button>
        <Modal title={<TitleForModel text='Thông tin thi' />} visible={this.state.isModalVisible} onOk={() => this.handleOk()} onCancel={() => this.handleCancel()}>
          <p className='mb-0'>Chọn số lượng câu.</p>
          <Input defaultValue={(this.state.totalQa >= this.state.numberQa ? this.state.numberQa : this.state.totalQa) || ''} name='numberQa' onChange={(e) => this.tbOnChange(e)} type='number' addonAfter={'Tổng: ' + this.state.totalQa} placeholder='Số lượng câu EX: 40' className='mb-3' />

          <p className='mb-0'>Chọn thời gian làm (Phút).</p>
          <Input value={this.state.numberTime || ''} name='numberTime' onChange={(e) => this.tbOnChange(e)} type='number' addonAfter={'Tổng: ' + this.state.totalTime} placeholder='Số thời gian EX: 45' className='mb-3' />

          <p className='mb-0'>Bắt đầu thi từ câu thứ (? / {this.state.totalQa}).</p>
          <Input value={this.state.numberSkip} name='numberSkip' onChange={(e) => this.tbOnChange(e)} type='number' addonAfter={'Tổng: ' + this.state.totalQa} placeholder='Số câu bỏ qua EX: 0' className='mb-3' />

          <Checkbox checked={this.state.isRandom} onChange={(e) => this.setState({ isRandom: e.target.checked })}>Trộn ngẫu nhiên ?</Checkbox>
        </Modal>
      </>
    );
  }
}

export default ButtonExamComponent;