
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Apis } from '../../common/utils/Apis';
import { MessageKeys, NotificationKeys } from '../../common/utils/keys';
import { message, Radio, Select } from 'antd';
import { CheckOutlined, CloseOutlined, FacebookFilled } from '@ant-design/icons';
import FACTORY from '../../common/FACTORY';
import HeaderComponent from '../../components/home/header/HeaderComponent';
import FooterComponent from '../../components/home/footer/FooterComponents';
import CountDownComponent from '../../components/common/CountDownComponent';
import AfterExam from './AfterExam';
import AdsGoogleFixed from '../../components/common/AdsGoogle/AdsGoogleFixed';
import AdsGoogleDefault from '../../components/common/AdsGoogle/AdsGoogleDefault';

const initialState = {
  redirectTo: null,
  listQuestionAnswer: [],
  currentQuestionSelected: 0,
  numberWrong: 0,
  point: 0,
  isFinish: false,
  doTime: {
    h: 0,
    m: 0,
    s: 0,
  }
}

class Examquiz extends Component {
  constructor(props) {
    super(props);
    // check params
    this.checkParams();
    this.state = {
      ...initialState,
      userExam: {},
    }
    this.PublicModules = null;
    this.CoreUI = null;
  }

  checkParams() {
    const { postId, numberQa, numberTime, isRandom, numberSkip, title } = this.props.match.params;
    if (!postId || !numberQa) {
      this.setState({ redirectTo: '/' })
    }
    this.postId = postId;
    this.numberQa = numberQa || 40;
    if (this.numberQa === 'NaN' || this.numberQa < 0) this.numberQa = 40;
    this.isRandom = isRandom || false;
    this.numberTime = numberTime || 45;
    if (this.numberTime === 'NaN' || this.numberTime < 0) this.numberTime = 45;
    this.numberSkip = numberSkip;
    if (this.numberSkip === 'NaN' || this.numberSkip < 0) this.numberSkip = 0;
    this.title = title;
  }

  initLibs = async () => {
    this.PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    this.CoreUI = await FACTORY.GET_CORE_UI();
  }

  async loadQuestionAnswer() {
    await this.initLibs();
    this.PublicModules.fun_get(
      `${Apis.API_HOST + Apis.API_TAILER.QUESTION_ANSWER + this.postId}?isRandom=${this.isRandom}&isQa=true&page=1&limit=${this.numberQa}&skip=${this.numberSkip}`,
      this.PublicModules.fun_getConfigBearerDefault({}),
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        this.CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Tải câu hỏi bị lỗi',
          message: this.PublicModules.fun_mapErrorToMessage(dataRes.message),
        })
        return;
      }
      this.setState({
        listQuestionAnswer: dataRes.data,
      });
    })
  }

  getMe = async () => {
    this.user = FACTORY.fun_getUserLoginLocalStorage();
    if (!this.user) {
      return window.location.replace('/');
    }
    if (this.state.userExam.id) return;
    await this.initLibs();
    const dataRes = await this.PublicModules.fun_get(Apis.API_HOST + Apis.API_TAILER.AUTH,
      this.PublicModules.fun_getConfigBearerDefault({}));
    if (!dataRes.success) {
      this.CoreUI.fun_showNotification({
        title: 'Tải thông tin user lỗi',
        message: MessageKeys.CHECK_CONNECTION
      })
      return;
    }
    this.setState({
      userExam: dataRes.data,
    });
  }

  componentDidMount() {
    this.getMe();
    this.loadQuestionAnswer();
  }

  getClassQuestionActive(index) {
    if (index === this.state.currentQuestionSelected)
      return ' question-active';
  }

  switchQuestion(index) {
    if (index < 0) {
      message.info('Đã đến câu đầu tiên.');
      return;
    }
    if (index >= this.state.listQuestionAnswer.length) {
      message.info('Đã đến câu cuối cùng');
      return;
    }
    this.setState({ currentQuestionSelected: index });
  }

  answerChange(e) {
    const value = e.target.value;
    const strs = value.split(';vsl;');
    const find = this.state.listQuestionAnswer.find((v) => {
      return String(v.id) === strs[0];
    });
    if (!find) return;
    // update
    find['c'] = strs[1];
  }

  calculatorPoint = async () => {
    if (this.state.isFinish) {
      this.setState({ ...initialState });
      this.loadQuestionAnswer();
      return;
    }

    await this.initLibs();
    const ok = await this.CoreUI.fun_showConfirm({
      title: 'Hành động nộp bài!',
      message: 'Bạn chắc muốn nộp bài chứ ?',
    });
    if (!ok) return;

    let numberWrong = 0;
    this.state.listQuestionAnswer.forEach(e => {
      if (String(e.qa) !== String(e.c))
        numberWrong += 1;
    });
    const point = parseFloat((this.numberQa - numberWrong) * 10 / this.numberQa).toFixed(2)
    // UPDATE RANK
    const keyLoading = this.CoreUI.fun_showNotification({
      type: NotificationKeys.LOADING,
      message: 'Đang cập nhận RANK của bạn',
    });
    let dataRes = await this.PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.RANK,
      {
        postId: Number.parseInt(this.postId),
        point: point,
        ...this.PublicModules.fun_getOauthClientV2(),
      }, this.PublicModules.fun_getConfigBearerDefault({}),
    );
    if (!dataRes.success) {
      this.CoreUI.fun_closeNotificationLoading(keyLoading);
      this.CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Cập nhật RANK không thành',
        message: MessageKeys.CHECK_CONNECTION,
      });
      return;
    }
    this.CoreUI.fun_closeNotificationLoading(keyLoading);

    this.setState({
      numberWrong: numberWrong,
      point: point,
      isFinish: true,
    })
  }

  getClassQuestionWrong(question) {
    if (String(question.qa) !== String(question.c))
      return ' _text-thr';
    return ' _text-sec'
  }

  getRadioUserCheck() {
    return this.state.listQuestionAnswer.map((v, k) => {
      let wrong = '';
      if (this.state.isFinish)
        wrong = this.getClassQuestionWrong(v);
      return (
        <div onClick={() => this.switchQuestion(k)} className={'m-2 p-2 border' + this.getClassQuestionActive(k) + wrong} key={k} style={{ cursor: 'pointer' }}>
          <div className='fw-bold text-uppercase float-start'>{`Câu ${k + 1}: `}</div>
          {this.state.isFinish ?
            <div className='float-end'>
              {String(v.qa) === String(v.c) ?
                <i className="fas fa-check"></i> : <i className="fas fa-times"></i>}
            </div> : ''}
          <br />
          <div>
            <Radio.Group onChange={(e) => this.answerChange(e)} disabled={this.state.isFinish}>
              {v.a.map((_i, j) => {
                return (
                  <Radio className={'' + wrong} key={`${k}_${j}`} value={`${v.id};vsl;${j}`}>{FACTORY.fun_mapNumberToLetter(j)}</Radio>
                );
              })}
            </Radio.Group>
          </div>
        </div>
      );
    });
  }

  showCurrentQuestionSelected() {
    if (this.state.listQuestionAnswer.length === 0) return;
    const index = this.state.currentQuestionSelected;
    const question = this.state.listQuestionAnswer[index];
    return (
      <div className="examquiz_lined_up">
        <h3 className="quiz_lined_up fw-bold text-center">CÂU {index + 1}:</h3>
        <hr />
        <p className=" fw-bold">
          {question.q}
        </p>
        {question.a.map((v, k) => {
          return (
            <p key={k}>
              <span className='fw-bold'>
                {this.state.isFinish && String(k) === String(question.qa) ?
                  <span className='m-2'>
                    <CheckOutlined />
                  </span> : ''}
                {this.state.isFinish && String(k) === String(question.c) && String(k) !== String(question.qa) ?
                  <span className='m-2'>
                    <CloseOutlined />
                  </span> : ''}
                {FACTORY.fun_mapNumberToLetter(k)}
              </span>
              <span>
                {v}
              </span>
            </p>
          );
        })}
      </div>
    );
  }

  countAnswer() {
    let count = 0;
    this.state.listQuestionAnswer.forEach(e => {
      if (e['c']) count += 1;
    });
    return count;
  }

  async filterSelectChange(e) {
    const Pub = await FACTORY.GET_PUBLIC_MODULES();
    Pub.fun_ComingSoon();
  }

  render() {
    if (this.state.redirectTo)
      return <Redirect to={this.state.redirectTo} />

    const nameDefault = 'Bạn chưa đặt';
    return (
      <>
        <HeaderComponent />
        <div className="container-fluid">
          <div className="container_exem">
            <div className="container_exem_L m-1">
              <div className="exem_header bg-border m-2 p-2">
                <h3>HỆ THỐNG THI TRẮC NGHIỆM TRỰC TUYẾN</h3>
                <div className="container_exem-center">
                  <ul className="container_exem-center-list">
                    <li>
                      <p className='fw-bold'>Thông tin lịch thi</p>
                    </li>
                    <li>
                      <h6>Môn thi: {this.title} </h6>
                    </li>
                  </ul>
                  <ul className="container_exem-center-list">
                    <li>
                      <h6 >Thời gian còn lại:
                        {!this.state.isFinish ?
                          <CountDownComponent
                            className='container_exem-center-item'
                            timeDown={this.numberTime * 60}
                            onFinish={(doTime) => this.setState({
                              isFinish: true,
                              doTime: { ...doTime }
                            })}
                          /> : ''}
                      </h6>
                    </li>
                    <li>
                      <h6>Số câu trả lời / Tổng số câu: <span> {this.countAnswer()} / {this.numberQa}</span></h6>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="overflow-scroll overflow-scroll-center bg-border m-2 p-2">
                {/* show question */}
                {this.showCurrentQuestionSelected()}

                <div className='mt-5'>
                  <AdsGoogleDefault
                    slot="2949055488"
                  />
                </div>

                {this.state.isFinish ?
                  <AfterExam
                    doTime={this.state.doTime}
                    total={this.numberQa}
                    numberWrong={this.state.numberWrong}
                    point={this.state.point}
                  /> : ''}
              </div>
            </div>
            {/* <div className="show_exem_KQ exem_color">
              <div className="container_exem-center ">
                <ul className="container_exem-center-list">
                  <li>
                    <h6>Thông tin lịch thi</h6>
                  </li>
                  <li>
                    <h6>Môn thi: Tư Tưởng Hồ Chí Minh </h6>
                  </li>
                </ul>
                <ul className="container_exem-center-list">
                  <li>
                    <h6 >Thời gian còn lại: <p className="container_exem-center-item">00 : 44 : 03</p> </h6>
                  </li>
                  <li>
                    <h6>Số câu trả lời / Tổng số câu: <span> 5/20</span></h6>
                  </li>
                </ul>
              </div>
            </div> */}
            <div className="container_exem_R m-1">
              <div className="exem_info bg-border m-2 p-2">
                <p className="L-10px fw-bold">Thông tin sinh viên</p>
                <div className="exem_info-list  ">
                  <ul className="exem_info-list-item">
                    <li>
                      <img src={FACTORY.fun_getAvatarImageView(this.state.userExam.avatar) ? 
                        FACTORY.fun_getAvatarImageView(this.state.userExam.avatar) : 
                        "/image/authors/author1.png"} className="author-img m-2" alt="logo author" >
                      </img>
                    </li>
                  </ul>
                  <ul className="exem_info-list-item">
                    <li className="L-10px">Họ Tên: <span>
                      {this.state.userExam.displayName || this.state.userExam.username}
                    </span></li>
                    <li className="L-10px">Ngày Sinh: <span>
                      {this.state.userExam.birthDay || nameDefault}
                    </span></li>
                    <li className="L-10px">Số điện thoại: <span>
                      {this.state.userExam.phone || nameDefault}
                    </span></li>
                    <li className="L-10px">Link Facebook: <span>
                      {this.state.userExam.linkFacebook ?
                        <a href={this.state.userExam.linkFacebook} target='blank'>
                          <FacebookFilled /> facebook
                        </a> : nameDefault}
                    </span></li>
                  </ul>
                </div>
              </div>

    
              <div className="bg-border m-2 p-2">
                <ul className="exem_option1">
                  <li><button
                    onClick={() => this.switchQuestion(this.state.currentQuestionSelected - 1)}
                    className="btn-ds outline-pr block">
                    <i className="fas fa-angle-double-left">&nbsp;</i> Câu trước</button>
                  </li>
                  <li><button
                    onClick={() => this.switchQuestion(this.state.currentQuestionSelected + 1)}
                    className="btn-ds outline-pr block">
                    Câu sau&nbsp; <i className="fas fa-angle-double-right"></i></button>
                  </li>
                </ul>
                <ul className="exem_option2">
                  <li><button onClick={() => this.calculatorPoint()} className="btn-ds outline-sec block">
                    <i className="fas fa-check-double">&nbsp;</i>
                    {this.state.isFinish ?
                      'Làm lại' : 'Nộp bài'
                    }
                  </button></li>
                </ul>
              </div>
              {/* <div className="exem_quiz">
                <div className="exem_quiz-filter bg-border m-2 p-2">
                  <p className='fw-bold'>Lọc câu hỏi</p>
                  <Select
                    onChange={(e) => this.filterSelectChange(e)}
                    defaultValue={0} className='w-100'>
                    <Select.Option value={0}>Tất cả</Select.Option>
                    <Select.Option value={1}>Chưa trả lời</Select.Option>
                    <Select.Option value={2}>Đã trả lời</Select.Option>
                  </Select>
                </div>
              </div> */}
              <div className="exam_question bg-border m-2 p-2">
                <div className="overflow-auto--">
                  {this.getRadioUserCheck()}
                </div>
              </div>
              {Apis.IS_SHOW_ADS !== '0' ?
                <div className="bg-border m-2 p-2">
                  <AdsGoogleFixed
                    slot="2847121314"
                  />
                </div> : ''}
            </div>
          </div>
        </div>
        <FooterComponent />
      </>
    );
  }
}
export default Examquiz;
