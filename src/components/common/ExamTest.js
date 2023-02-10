import React, { Component } from 'react';
import FACTORY from '../../common/FACTORY';
import { Apis } from '../../common/utils/Apis';
import { MessageKeys, NotificationKeys } from '../../common/utils/keys';
import moment from 'moment';
import PagingComponent from './PagingComponent';
import CardExamTest from './components/CardExamTest';
import { Checkbox, Input, Modal } from 'antd';
import TitleForModel from '../home/header/components/TitleForModel';

class ExamTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listExampTest: [],
      total: 0,
      isLoading: false,
      isModalRealTestConfVisible: false,
      postIdSelected: null,
    }
    this.page = 1; this.limit = 10;
    this.pubs = null; this.coreUI = null;
    this.userLoged = FACTORY.fun_getUserLoginLocalStorage();
  }

  initLibs = async () => {
    if (!this.pubs) this.pubs = await FACTORY.GET_PUBLIC_MODULES();
    if (!this.coreUI) this.coreUI = await FACTORY.GET_CORE_UI();
  }

  loadListExamTest = (page, limit) => {
    this.setState({ isLoading: true }, async () => {
      await this.initLibs();
      const dataRes = await this.pubs.fun_get(Apis.API_HOST + Apis.API_TAILER.QUESTION_ANSWER + `?page=${page}&limit=${limit}`);
      if (!dataRes) {
        this.coreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Tải những bài thi lỗi',
          message: MessageKeys.CHECK_CONNECTION,
        });
        return;
      }
      this.setState({
        listExampTest: dataRes.data,
        total: dataRes.total,
        isLoading: false,
      });
    });
  }

  onAdded(num, postId) {
    const list = this.state.listExampTest;
    const find = list.find((v) => v.id === postId)
    if (!find) return;
    find.numQ = Number(find.numQ) + num;
    this.setState({ listExampTest: list });
  }

  reloadUI() {
    if(!this.state.listExampTest) return;
    return this.state.listExampTest.map((v, k) => {
      return (
        <CardExamTest
          key={k}
          v={v}
          updateAt={moment(v.updateAt).fromNow()}
          onAdded={(num, postId) => this.onAdded((num, postId))}
          userLoged={this.userLoged}
          showModalRealTestConf={(postId) => this.setState({ isModalRealTestConfVisible: true, postIdSelected: postId })}
        />
      );
    });
  }

  componentDidMount() {
    this.loadListExamTest(this.page, this.limit);
  }

  onPageChange(page, limit) {
    this.page = page;
    this.limit = limit;
    this.loadListExamTest(page, limit);
  }

  handleModalTestConfOk() {
    if (!this.userLoged || this.userLoged.role !== 'ADMIN' || !this.state.postIdSelected) return;
    const realTestTime = this.state.realTestTime || 0;
    const realTestRandom = this.state.realTestRandom || false;
    // validate
    if (!realTestTime) {
      this.coreUI.fun_showNotification({
        message: 'Nhập không hợp lệ!',
      });
      return;
    }

    this.setState({ isLoading: true, isModalRealTestConfVisible: false }, async () => {
      await this.initLibs();
      const postId = this.state.postIdSelected;
      const dataRes = await this.pubs.fun_put(
        Apis.API_HOST + Apis.API_TAILER.POST + Apis.API_TAILER.REAL_TEST + postId,
        {
          isRealTest: true,
          realTestTime,
          realTestRandom,
        },
        this.pubs.fun_getConfigBearerDefault({}),
      );
      this.setState({ isLoading: false }, () => {
        if (!dataRes.success) {
          this.coreUI.fun_showNotification({
            message: dataRes.message,
          });
          return;
        }
        this.loadListExamTest(this.page, this.limit);
      });
    });
  }

  render() {
    console.log(this.state.listExampTest);
    return (
      <div className='mt-4 p-4'>
        {FACTORY.fun_getGl_loading(this.state.isLoading)}
        <div className='row row-cols-1 row-cols-md-4 g-4'>
          {this.reloadUI()}
        </div>
        <PagingComponent
          total={this.state.total}
          onPageChange={(page, pageSize) => this.onPageChange(page, pageSize)}
        />

        <Modal
          title={<TitleForModel text='Thông tin thi' />}
          visible={this.state.isModalRealTestConfVisible}
          onOk={() => this.handleModalTestConfOk()}
          onCancel={() => this.setState({ isModalRealTestConfVisible: false })}>

          <p className='mb-0'>Chọn thời gian làm (Phút).</p>
          <Input
            onChange={(e) => this.setState({ realTestTime: e.target.value })}
            type='number' placeholder='Số thời gian EX: 45' className='mb-3' />

          <Checkbox
            onChange={(e) => this.setState({ realTestRandom: e.target.checked })}
          >Trộn ngẫu nhiên ?</Checkbox>
        </Modal>
      </div>
    );
  }
}

export default ExamTest;