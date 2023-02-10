import { DeleteOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { Component } from 'react';
import FACTORY from '../../common/FACTORY';
import { Apis } from '../../common/utils/Apis';
import PagingComponent from '../common/PagingComponent';

class ButtonListEditQA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      listQa: [],
      total: 0,
    }
    this.coreUI = null; this.pubs = null;
  }

  handleOk() {
    this.setState({ isShowModal: false });
  }

  handleCancel() {
    this.setState({ isShowModal: false });
  }

  btnListEditQaClicked() {
    this.setState({ isShowModal: true });
    this.loadListQa(1, 10);
  }

  async loadListQa(page, limit) {
    const postId = this.props.postId;
    this.coreUI = await FACTORY.GET_CORE_UI();
    this.pubs = await FACTORY.GET_PUBLIC_MODULES();
    const dataRes = await this.pubs.fun_get(
      Apis.API_HOST + Apis.API_TAILER.QUESTION_ANSWER + postId + `?page=${page}&limit=${limit}&isQa=true`,
    );
    if (!dataRes.success) {
      this.coreUI.fun_showNotification({
        message: 'Tải câu hỏi bị lỗi, vui lòng thử lại sau.',
      })
      return;
    }
    this.setState({
      listQa: dataRes.data,
      total: dataRes.total,
    }, () => {
      // console.log(this.state);
    });
  }

  onPageChange(page, pageSize) {
    this.page = page;
    this.limit = pageSize;
    this.loadListQa(page, pageSize);
  }

  async deleteQuestion(id) {
    const userLoged = FACTORY.fun_getUserLoginLocalStorage();
    if (!userLoged || userLoged.role !== 'ADMIN') {
      this.coreUI.fun_showNotification({
        message: 'Chức năng chỉ dành cho ADMIN!',
      })
      return;
    }

    const ok = await this.coreUI.fun_showConfirm({
      message: `Xóa câu hỏi có ID: ${id} ?`,
    });
    if (!ok) return;
    const dataRes = await this.pubs.fun_delete(
      Apis.API_HOST + Apis.API_TAILER.QUESTION_ANSWER + id,
      this.pubs.fun_getConfigBearerDefault({}),
    );
    if (!dataRes.success) {
      this.coreUI.fun_showConfirm({
        message: `Xóa câu hỏi có ID: ${id} Bị lỗi.`,
      });
      return;
    }
    this.loadListQa(this.page || 1, this.limit || 10);
    this.props.onAdded(-1, this.props.postId)
  }

  reloadListQaUI() {
    const list = this.state.listQa;
    if (!list || !list.length) return;
    return list.map((v, k) => {
      return (
        <p key={k} className='p-list-edit-qa'>
          <span className='_text-sec fw-bold'>Câu {k + 1}: </span>
          <span>{v.q}</span>
          <span>
            <Button type='link' danger
              onClick={() => this.deleteQuestion(v.id)}
            ><DeleteOutlined /> DELETE.{v.id}</Button>
          </span>
        </p>
      );
    });
  }

  render() {
    return (
      <>
        <Button block type='primary'
          onClick={() => this.btnListEditQaClicked()}
        >List-Edit QA</Button>

        <Modal
          visible={this.state.isShowModal}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
        >

          {this.reloadListQaUI()}

          <PagingComponent
            total={this.state.total}
            onPageChange={(page, pageSize) => this.onPageChange(page, pageSize)}
          />
        </Modal>
      </>
    );
  }
}

export default ButtonListEditQA;