import React, { Component } from 'react';
import { Apis } from '../../../../../common/utils/Apis';
import { NotificationKeys } from '../../../../../common/utils/keys';
import { message, Radio, Space } from "antd";
import FACTORY from '../../../../../common/FACTORY';
import PagingComponent from '../../../../common/PagingComponent';

// import loadable from '@loadable/component';
// const PagingComponent = loadable(() => import('../../../../common/PagingComponent'));

const initialState = {
  listQuestionAnswer: [],
  total: 0,
}

class UpdateQuestionAnswerComponent extends Component {
  constructor(props) {
    super(props);
    this.isQa = false;
    this.page = 1;
    this.limit = Apis.NUM_PER_PAGE;
    this.state = {
      ...initialState,
    }
  }

  componentDidMount() {
    this.loadQuestionAnswer();
  }

  componentWillReceiveProps(nextProps) {
    if (this.isQa !== nextProps.isQa) {
      this.isQa = nextProps.isQa;
      this.loadQuestionAnswer();
    }
  }

  async loadQuestionAnswer() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    const dataRes = await PublicModules.fun_get(
      `${Apis.API_HOST + Apis.API_TAILER.QUESTION_ANSWER + this.props.postId}?isRandom=${false}&isQa=${this.isQa}&page=${this.page}&limit=${this.limit}`,
      PublicModules.fun_getConfigBearerDefault({}),
    );
    // error ?
    if (!dataRes.success) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Lỗi tải QA',
        message: PublicModules.fun_mapErrorToMessage(dataRes.message),
      })
      return;
    }
    // success
    this.setState({
      listQuestionAnswer: dataRes.data,
      total: dataRes.total,
    })
  }

  onPageChange(page, limit) {
    this.page = page;
    this.limit = limit;
    this.loadQuestionAnswer();
  }

  onRadioChange(e) {
    const value = e.target.value;
    const strs = value.split(';vsl;');
    const id = strs[0];
    const qa = strs[1];
    const find = this.state.listQuestionAnswer.find((v) => {
      return String(v.id) === id;
    });
    if (find)
      find.qa = qa;
  }

  reloadListQuestionAnswer() {
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

  async btnUpdateQuestionNowClicked() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    const dataRes = await PublicModules.fun_put(
      Apis.API_HOST + Apis.API_TAILER.QUESTION_ANSWER + this.props.postId,
      {
        body: this.state.listQuestionAnswer.map((v) => {
          v.a = PublicModules.fun_buildAnswer(v.a);
          return v;
        }),
      },
      PublicModules.fun_getConfigBearerDefault({}),
    );
    // error ?
    if (!dataRes.success) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Lỗi update',
        message: PublicModules.fun_mapErrorToMessage(dataRes.message),
      })
      return;
    }
    message.success('Update Sucess');
    this.loadQuestionAnswer();
  }

  render() {
    return (
      <div>
        {this.reloadListQuestionAnswer()}

        {this.state.total ?
          <button
            className='btn-ds outline-sec block'
            onClick={() => this.btnUpdateQuestionNowClicked()}
          >Update Question Now</button> :
          ''
        }

        <PagingComponent
          total={this.state.total}
          onPageChange={(page, limit) => this.onPageChange(page, limit)}
        />
      </div>
    );
  }
}

export default UpdateQuestionAnswerComponent;