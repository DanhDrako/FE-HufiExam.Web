import React, { Component } from "react";
import { Redirect } from "react-router";
import { Apis } from "../../common/utils/Apis";
import { MessageKeys, NotificationKeys } from "../../common/utils/keys";
import { message, Radio, Select } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import FACTORY from "../../common/FACTORY";
import HeaderComponent from "../../components/home/header/HeaderComponent";
import CountDownComponent from "../../components/common/CountDownComponent";
import AfterExam from "./AfterExam";
import { connect } from "react-redux";
// import { ActionType } from "../../common/utils/actions-type";

class RealExamquiz extends Component {
  constructor(props) {
    super(props);
    // check params
    this.checkParams();
    this.state = {
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
      },
      userExam: {},
    };
    this.PublicModules = null;
    this.CoreUI = null;
    this.dispatch = this.props.dispatch;
    this.isHandleTime = true;
  }

  checkParams() {
    if (
      !this.props.realExam.data.postId ||
      !this.props.realExam.data.totalQa
    ) {
      this.setState({ redirectTo: "/" });
    }
    this.postId = this.props.realExam.data.postId;
    this.numberQa = this.props.realExam.data.totalQa;
    this.isRandom = this.props.realExam.data.isRandom;
    this.numberTime = this.props.realExam.data.numberTime;
    this.numberSkip = this.props.realExam.data.numberSkip;
    this.title = this.props.realExam.data.title;
  }

  initLibs = async () => {
    this.PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    this.CoreUI = await FACTORY.GET_CORE_UI();
  };

  async loadQuestionAnswer() {
    await this.initLibs();
    if (this.props.realExam) {
      this.PublicModules.fun_get(
        `${
          Apis.API_HOST + Apis.API_TAILER.QUESTION_ANSWER + this.postId
        }?isRandom=${this.isRandom}&isQa=true&page=1&limit=${
          this.numberQa
        }&skip=${this.numberSkip}`,
        this.PublicModules.fun_getConfigBearerDefault({})
      ).then((dataRes) => {
        // error ?
        if (!dataRes.success) {
          this.CoreUI.fun_showNotification({
            type: NotificationKeys.ERROR,
            title: "Tải câu hỏi bị lỗi",
            message: this.PublicModules.fun_mapErrorToMessage(dataRes.message),
          });
          return;
        }
        this.setState({
          listQuestionAnswer: dataRes.data,
        });
      });
    }
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
    if (index === this.state.currentQuestionSelected) return " question-active";
  }

  switchQuestion(index) {
    if (index < 0) {
      message.info("Đã đến câu đầu tiên.");
      return;
    }
    if (index >= this.state.listQuestionAnswer.length) {
      message.info("Đã đến câu cuối cùng");
      return;
    }
    this.setState({ currentQuestionSelected: index });
  }

  answerChange(e) {
    const value = e.target.value;
    const strs = value.split(";vsl;");
    const find = this.state.listQuestionAnswer.find((v) => {
      return String(v.id) === strs[0];
    });
    if (!find) return;
    // update
    find["c"] = strs[1];
  }

  calculatorPoint = async (isTime) => {
    await this.initLibs();
    if(isTime) {
      await this.CoreUI.fun_showNotification({
        message: "Đã hết thời gian làm bài.",
        type: NotificationKeys.WARNING,
      });
    } else {
      const ok = await this.CoreUI.fun_showConfirm({
        title: "Hành động nộp bài!",
        message: "Bạn chắc muốn nộp bài chứ ?",
      });
      if (!ok) return;
      this.isHandleTime = false;
    }

    let numberWrong = 0;
    this.state.listQuestionAnswer.forEach((e) => {
      if (String(e.qa) !== String(e.c)) numberWrong += 1;
    });
    const point = parseFloat(
      ((this.numberQa - numberWrong) * 10) / this.numberQa
    ).toFixed(2);
    // UPDATE RANK
    const keyLoading = this.CoreUI.fun_showNotification({
      type: NotificationKeys.LOADING,
      message: "Đang cập nhật RANK của bạn",
    });
    let dataRes = await this.PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.RANK,
      {
        postId: Number.parseInt(this.postId),
        point: point,
        ...this.PublicModules.fun_getOauthClientV2(),
      },
      this.PublicModules.fun_getConfigBearerDefault({})
    );
    if (!dataRes.success) {
      this.CoreUI.fun_closeNotificationLoading(keyLoading);
      this.CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: "Cập nhật RANK không thành công",
        message: MessageKeys.CHECK_CONNECTION,
      });
      return;
    }
    this.CoreUI.fun_closeNotificationLoading(keyLoading);
    // this.dispatch({
    //   type: ActionType.RESET_REAL_EXAM,
    // });

    this.setState({
      numberWrong: numberWrong,
      point: point,
      isFinish: true,
    }, async () => {
      await this.CoreUI.fun_showNotification({
        message: "Bạn đã hoàn thành bài thi. sau 10 giây bạn sẽ được đưa về trang chủ.",
        type: NotificationKeys.SUCCESS,
      });
      setTimeout(() => {
        this.setState({redirectTo:'/'})
      }, 10000);
    });
  };

  getClassQuestionWrong(question) {
    if (String(question.qa) !== String(question.c)) return " _text-thr";
    return " _text-sec";
  }

  getRadioUserCheck() {
    return this.state.listQuestionAnswer.map((v, k) => {
      let wrong = "";
      if (this.state.isFinish) wrong = this.getClassQuestionWrong(v);
      return (
        <div
          onClick={() => this.switchQuestion(k)}
          className={"m-2 p-2 border" + this.getClassQuestionActive(k) + wrong}
          key={k}
          style={{ cursor: "pointer" }}
        >
          <div className="fw-bold text-uppercase float-start">{`Câu ${
            k + 1
          }: `}</div>
          {this.state.isFinish ? (
            <div className="float-end">
              {String(v.qa) === String(v.c) ? (
                <i className="fas fa-check"></i>
              ) : (
                <i className="fas fa-times"></i>
              )}
            </div>
          ) : (
            ""
          )}
          <br />
          <div>
            <Radio.Group
              onChange={(e) => this.answerChange(e)}
              disabled={this.state.isFinish}
            >
              {v.a.map((_i, j) => {
                return (
                  <Radio
                    className={"" + wrong}
                    key={`${k}_${j}`}
                    value={`${v.id};vsl;${j}`}
                  >
                    {FACTORY.fun_mapNumberToLetter(j)}
                  </Radio>
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
        <p className=" fw-bold">{question.q}</p>
        {question.a.map((v, k) => {
          return (
            <p key={k}>
              <span className="fw-bold">
                {this.state.isFinish && String(k) === String(question.qa) ? (
                  <span className="m-2">
                    <CheckOutlined />
                  </span>
                ) : (
                  ""
                )}
                {this.state.isFinish &&
                String(k) === String(question.c) &&
                String(k) !== String(question.qa) ? (
                  <span className="m-2">
                    <CloseOutlined />
                  </span>
                ) : (
                  ""
                )}
                {FACTORY.fun_mapNumberToLetter(k)}
              </span>
              <span>{v}</span>
            </p>
          );
        })}
      </div>
    );
  }

  countAnswer() {
    let count = 0;
    this.state.listQuestionAnswer.forEach((e) => {
      if (e["c"]) count += 1;
    });
    return count;
  }

  async filterSelectChange(e) {
    const Pub = await FACTORY.GET_PUBLIC_MODULES();
    Pub.fun_ComingSoon();
  }

  render() {
    if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />;
    const nameDefault = "Bạn chưa đặt";
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
                      <p className="fw-bold">Thông tin lịch thi</p>
                    </li>
                    <li>
                      <h6>Môn thi: {this.title} </h6>
                    </li>
                  </ul>
                  <ul className="container_exem-center-list">
                    <li>
                      <h6>
                        Thời gian còn lại:
                        {!this.state.isFinish ? (
                          <CountDownComponent
                            className="container_exem-center-item"
                            timeDown={this.numberTime * 60}
                            onFinish={(doTime) =>
                              this.setState({
                                isFinish: true,
                                doTime: { ...doTime },
                              },() => {
                                // onFinish to Point
                                if(this.isHandleTime) {
                                  this.calculatorPoint(true);
                                }
                              })
                            }
                          />
                        ) : (
                          ""
                        )}
                      </h6>
                    </li>
                    <li>
                      <h6>
                        Số câu trả lời / Tổng số câu:
                        <span>
                          {" "}
                          {this.countAnswer()} / {this.numberQa}
                        </span>
                      </h6>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="overflow-scroll overflow-scroll-center bg-border m-2 p-2">
                {/* show question */}
                {this.showCurrentQuestionSelected()}

                {this.state.isFinish ? (
                  <AfterExam
                    doTime={this.state.doTime}
                    total={this.numberQa}
                    numberWrong={this.state.numberWrong}
                    point={this.state.point}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="container_exem_R m-1">
              <div className="exem_info bg-border m-2 p-2">
                <p className="L-10px fw-bold">Thông tin sinh viên</p>
                <div className="exem_info-list  ">
                  <ul className="exem_info-list-item">
                    <li>
                      <img
                        src={
                          FACTORY.fun_getAvatarImageView(
                            this.state.userExam.avatar
                          )
                            ? FACTORY.fun_getAvatarImageView(
                                this.state.userExam.avatar
                              )
                            : "/image/authors/author1.png"
                        }
                        className="author-img m-2"
                        alt="logo author"
                      ></img>
                    </li>
                  </ul>
                  <ul className="exem_info-list-item">
                    <li className="L-10px">
                      Họ Tên:{" "}
                      <span>
                        {this.state.userExam.displayName ||
                          this.state.userExam.username}
                      </span>
                    </li>
                    <li className="L-10px">
                      Ngày Sinh:{" "}
                      <span>{this.state.userExam.birthDay || nameDefault}</span>
                    </li>
                    <li className="L-10px">
                      Số điện thoại:{" "}
                      <span>{this.state.userExam.phone || nameDefault}</span>
                    </li>
                    <li className="L-10px">
                      Link Facebook:{" "}
                      <span>
                        {this.state.userExam.linkFacebook ? (
                          <a
                            href={this.state.userExam.linkFacebook}
                            target="blank"
                          >
                            <FacebookFilled /> facebook
                          </a>
                        ) : (
                          nameDefault
                        )}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-border m-2 p-2">
                <ul className="exem_option1">
                  <li>
                    <button
                      onClick={() =>
                        this.switchQuestion(
                          this.state.currentQuestionSelected - 1
                        )
                      }
                      className="btn-ds outline-pr block"
                    >
                      <i className="fas fa-angle-double-left">&nbsp;</i> Câu
                      trước
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        this.switchQuestion(
                          this.state.currentQuestionSelected + 1
                        )
                      }
                      className="btn-ds outline-pr block"
                    >
                      Câu sau&nbsp;{" "}
                      <i className="fas fa-angle-double-right"></i>
                    </button>
                  </li>
                </ul>
                <ul className="exem_option2">
                  <li>
                    {!this.state.isFinish ? (
                      <button
                        onClick={() => this.calculatorPoint(false)}
                        className="btn-ds outline-sec block"
                      >
                        <i className="fas fa-check-double">&nbsp;</i>
                        Nộp bài
                      </button>
                    ) : (
                      ""
                    )}
                  </li>
                </ul>
              </div>
              {/* <div className="exem_quiz">
                <div className="exem_quiz-filter bg-border m-2 p-2">
                  <p className="fw-bold">Lọc câu hỏi</p>
                  <Select
                    onChange={(e) => this.filterSelectChange(e)}
                    defaultValue={0}
                    className="w-100"
                  >
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
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    realExam: state.realExam,
  };
};

export default connect(mapStateToProps)(RealExamquiz);
