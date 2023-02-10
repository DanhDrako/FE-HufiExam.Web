import { Radio, Space } from 'antd';
import React, { Component } from 'react';
import FACTORY from '../../../common/FACTORY';
import { Apis } from '../../../common/utils/Apis';
import { MessageKeys, NotificationKeys } from '../../../common/utils/keys';
import PagingComponent from '../../common/PagingComponent';

class QuestionAnswerComponent extends Component {
  constructor(props) {
    super(props);
    this.pubs = null;
    this.coreUI = null;
    this.QaRef = React.createRef();

    this.state = {
      listQuestionAnswer: [],
      total: 0,
    }
  }

  initModule = async () => {
    if (!this.pubs) this.pubs = await FACTORY.GET_PUBLIC_MODULES();
    if (!this.coreUI) this.coreUI = await FACTORY.GET_CORE_UI();
  }

  componentDidMount() {
    this.loadQA(this.props.postId, 1, Apis.NUM_PER_PAGE);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.postId !== this.props.postId) {
      this.loadQA(nextProps.postId, 1, Apis.NUM_PER_PAGE);
    }
  }


  loadQA = async (postId, page, limit) => {
    await this.initModule();
    const keyLoading = this.coreUI.fun_showNotification({
      type: NotificationKeys.LOADING,
      message: 'Đang chuyển trang!',
    });
    const data = await this.pubs.fun_get(
      Apis.API_HOST + Apis.API_TAILER.QUESTION_ANSWER + postId + `?isQa=true&page=${page}&limit=${limit}`
    );
    this.coreUI.fun_closeNotificationLoading(keyLoading);
    if (!data.success) {
      this.coreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: MessageKeys.CHECK_CONNECTION,
        message: 'Tải câu hỏi lỗi',
      });
      return;
    }
    this.setState({
      listQuestionAnswer: data.data,
      total: data.total,
    })
  }

  onRadioChange = async (e) => {
    await this.initModule();
    this.coreUI.fun_showConfirm({
      title: 'Đã khả dụng để thi thử',
      message: `Bạn kéo xuống phần dưới của bài viết, chọn "Luyện Tập (Thi Thử)"`
    });
  }

  onPageChange(page, limit) {
    this.loadQA(this.props.postId, page, limit);
  }

  reloadListQuestionAnswer() {
    if (this.state.listQuestionAnswer.length === 0)
      return (
        <h4 className='_text-thr fw-bold text-center text-uppercase'>
          thi thử không khả dụng.
        </h4>
      );
    return this.state.listQuestionAnswer.map((v, k) => {
      return (
        <div key={k} className='hover p-2 m-2 bg-border'>
          <p>
            {v.q}
          </p>
          <div>
            <Radio.Group
              onChange={(e) => this.onRadioChange(e)}>
              <Space direction="vertical">
                {v.a.map((a, ii) => {
                  return (
                    <Radio key={`${v.id};${ii}`} value={`${v.id};vsl;${ii}`}>
                      {`${FACTORY.fun_mapNumberToLetter(ii)} ${a}`}
                    </Radio>
                  );
                })}
              </Space>
            </Radio.Group>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div ref={(ref) => this.QaRef = ref}>
        {this.reloadListQuestionAnswer()}

        <PagingComponent
          total={this.state.total}
          refScroll={this.QaRef}
          onPageChange={(page, limit) => this.onPageChange(page, limit)}
        />
      </div>
    );
  }
}

export default QuestionAnswerComponent;