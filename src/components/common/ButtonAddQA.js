import { Button, Input, Modal } from 'antd';
import React, { Component } from 'react';
import FACTORY from '../../common/FACTORY';
import { Apis } from '../../common/utils/Apis';

const inititalState = {
  isShowModal: false,
  q: '',
  a0: '',
  a1: '',
  a2: '',
  a3: '',
  qa: null,
  orderIndex: null,
}

class ButtonAddQA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...inititalState,
    }
    this.coreUI = null;
    this.pubs = null;
  }

  componentDidMount() {
    this.initLibs();
  }


  async initLibs() {
    if (!this.coreUI)
      this.coreUI = await FACTORY.GET_CORE_UI();
    if (!this.pubs)
      this.pubs = await FACTORY.GET_PUBLIC_MODULES();
    this.userLoged = FACTORY.fun_getUserLoginLocalStorage();
  }

  handleOk() {
    if (!this.userLoged || this.userLoged.role !== 'ADMIN') {
      this.coreUI.fun_showNotification({
        message: 'Chức năng chỉ dành cho ADMIN!',
      })
      return;
    }

    if (!this.state.q
      || !this.state.a0
      || !this.state.a1
      || !this.state.a2
      || !this.state.a3
      || this.state.qa == null) {
      this.coreUI.fun_showNotification({
        message: 'Nhập không hợp lệ!',
      })
      return;
    }
    this.setState({ isShowModal: false }, async () => {
      const dataRes = await this.pubs.fun_post(
        Apis.API_HOST + Apis.API_TAILER.QUESTION_ANSWER,
        {
          postId: this.props.postId,
          q: this.state.q,
          a: `${this.state.a0};vsl;${this.state.a1};vsl;${this.state.a2};vsl;${this.state.a3}`,
          qa: this.state.qa
        },
        this.pubs.fun_getConfigBearerDefault({})
      );
      if (!dataRes.success) {
        this.coreUI.fun_showNotification({
          message: 'Thêm câu hỏi bị lỗi, hãy thử lại.',
        });
        return;
      }
      this.setState({
        ...inititalState,
        orderIndex: dataRes.data.orderIndex,
        isShowModal: true,
      }, () => {
        // console.log(dataRes.data);
        this.props.onAdded(1, this.props.postId);
      });
    });
  }

  handleCancel() {
    this.setState({ isShowModal: false });
  }

  onTbChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  }

  onQaChange(index, checked) {
    if (checked)
      this.setState({ qa: index });
  }

  render() {
    return (
      <>
        <Button block type='dashed'
          onClick={() => this.setState({ isShowModal: true })}
        >+ Add QA</Button>

        <Modal
          visible={this.state.isShowModal}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
        >
          <div className='row mt-4'>
            <div className='col-12 mb-2'>
              <div className='w-100 text-center fw-bold p-1 text-uppercase'>
                Câu {this.state.orderIndex ? this.state.orderIndex + 1 : Number(this.props.countQa) + 1}
              </div>
            </div>
            <div className='col-12 mb-2'>
              <Input value={this.state.q} name='q' onChange={(e) => this.onTbChange(e)} placeholder='example: Trường Hufi ở đâu ?' />
            </div>

            <div className='col-2 mb-2'>
              <div className='w-100 fw-bold p-1 text-right'>
                <span className='float-end'>
                  <input checked={this.state.qa === 0} onChange={(e) => this.onQaChange(0, e.target.checked)} type='radio' name='qa' id='radio-insert-qa-A' />
                  <label htmlFor='radio-insert-qa-A'>&nbsp;&nbsp;A: </label>
                </span>
                <br />
              </div>
            </div>
            <div className='col-10 mb-2'>
              <Input value={this.state.a0} name='a0' onChange={(e) => this.onTbChange(e)} placeholder='example: 138 Lee soong zhaaan' />
            </div>

            <div className='col-2 mb-2'>
              <div className='w-100 fw-bold p-1 text-right'>
                <span className='float-end'>
                  <input checked={this.state.qa === 1} onChange={(e) => this.onQaChange(1, e.target.checked)} type='radio' name='qa' id='radio-insert-qa-B' />
                  <label htmlFor='radio-insert-qa-B'>&nbsp;&nbsp;B: </label>
                </span>
                <br />
              </div>
            </div>
            <div className='col-10 mb-2'>
              <Input value={this.state.a1} name='a1' onChange={(e) => this.onTbChange(e)} placeholder='example: 138 Lê Trọng Tấn' />
            </div>

            <div className='col-2 mb-2'>
              <div className='w-100 fw-bold p-1 text-right'>
                <span className='float-end'>
                  <input checked={this.state.qa === 2} onChange={(e) => this.onQaChange(2, e.target.checked)} type='radio' name='qa' id='radio-insert-qa-C' />
                  <label htmlFor='radio-insert-qa-C'>&nbsp;&nbsp;C: </label>
                </span>
                <br />
              </div>
            </div>
            <div className='col-10 mb-2'>
              <Input value={this.state.a2} name='a2' onChange={(e) => this.onTbChange(e)} placeholder='example: 139 Lê Trọng Tấn' />
            </div>

            <div className='col-2 mb-2'>
              <div className='w-100 fw-bold p-1 text-right'>
                <span className='float-end'>
                  <input checked={this.state.qa === 3} onChange={(e) => this.onQaChange(3, e.target.checked)} type='radio' name='qa' id='radio-insert-qa-D' />
                  <label htmlFor='radio-insert-qa-D'>&nbsp;&nbsp;D: </label>
                </span>
                <br />
              </div>
            </div>
            <div className='col-10 mb-2'>
              <Input value={this.state.a3} name='a3' onChange={(e) => this.onTbChange(e)} placeholder='example: 140 Lê Trọng Tấn' />
            </div>

          </div>
          {/* <div className='w-100 mt-3 mb-3'>
            <Button block type='dashed'>+ Thêm đáp án</Button>
          </div> */}
        </Modal>
      </>
    );
  }
}

export default ButtonAddQA;