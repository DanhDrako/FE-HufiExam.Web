import React, { Component } from "react";
import { Input, Modal } from "antd";
import { Redirect } from "react-router";
import FACTORY from "../../../../../../common/FACTORY";
import { Apis } from "../../../../../../common/utils/Apis";
import { NotificationKeys } from "../../../../../../common/utils/keys";
import TitleForModel from "../../../../../home/header/components/TitleForModel";
import { PublicModules } from "../../../../../../common/PublicModules";
import { CoreUI } from "../../../../../../common/CoreUI";
import { connect } from "react-redux";
import { ActionType } from "../../../../../../common/utils/actions-type";

const initialState = {
  redirectTo: null,
  isRandom: false,
  numberTime: 0,
  totalQa: 0,
  numberSkip: 0,
  isLoading: false,
};

class ButtonRealExamComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
    };
    this.dispatch = this.props.dispatch;
  }

  async btnExamNowClicked() {
    const CoreUI = await FACTORY.GET_CORE_UI();
    // interup ?
    if (this.props.post && !this.props.post.countQuestion) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.INFO,
        title: "Chưa có bộ đề cho bài viết này!",
        message: "Bài viết này sẽ sớm có bộ đề, bạn hãy quay lại sau",
      });
      return;
    }

    // exam
    const userLoged = FACTORY.fun_getUserLoginLocalStorage();
    if (!userLoged) {
      await CoreUI.fun_showConfirm({
        title: "Cần đăng nhập để THI!",
        message:
          "Để thực hiện hành động THI bạn cần đăng nhập trước. [ nút đăng nhập ở góc phía trên, bên phải màn hình ] mẹo: đăng nhập bằng google hay facebook cho nó nhanh.",
      });
      const btnLogin = document.getElementById("btnLogin");
      try {
        if (btnLogin) btnLogin.click();
      } catch {}
      return;
    }

    //check email

    // checking...
    const keyLoading = CoreUI.fun_showNotification({
      type: NotificationKeys.LOADING,
      message: "Đang kiểm tra!",
    });
    const isMarket = this.props.post ? this.props.post.isBlackMarket : false;
    if (isMarket) {
      CoreUI.fun_closeNotificationLoading(keyLoading);
      return;
    }
    // show modal
    this.setState({ isLoading: true }, async () => {
      const dataRes = await PublicModules.fun_get(
        Apis.API_HOST + Apis.API_TAILER.POST + this.props.post.id
      );
      await CoreUI.fun_closeNotificationLoading(keyLoading);
      // error ?
      if (!dataRes.success) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: "Tải đề thi bị lỗi!",
          message: PublicModules.fun_mapErrorToMessage(dataRes.message),
        });
        return;
      }
      const total = dataRes.data.countQuestion;
      if (total === 0) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.INFO,
          title: "Chưa có bộ đề cho bài viết này!",
          message: "Bài viết này sẽ sớm có bộ đề, bạn hãy quay lại sau",
        });
        return;
      }
      this.setState({
        isModalVisible: true,
        totalQa: total,
        isRandom: dataRes.data.isRandom,
        numberTime: dataRes.data.realTestTime,
      });
    });
  }

  async handleOk() {
    if (this.props.post.isRealTest) {
      const dataResReal = await PublicModules.fun_get(
        Apis.API_HOST + Apis.API_TAILER.CHECK_REALEXAMOWN + this.props.post.id,
        PublicModules.fun_getConfigBearerDefault({})
      );
      const data =
        dataResReal.success && dataResReal.data ? dataResReal.data : null;
      if (!data && !dataResReal.success) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: "Bạn không nằm trong danh sách thi hoặc vược quá số lần thi.",
          message: "Hãy kiểm tra danh sách và liên hệ người gác thi nhé.",
        });
        return;
      }
    }
    const data = {
      postId: this.props.post.id,
      totalQa: this.state.totalQa,
      numberTime: this.state.numberTime,
      numberSkip: this.state.numberSkip,
      isRandom: this.state.isRandom,
      title: this.props.post.title,
    };
    this.dispatch({
      type: ActionType.SET_REAL_EXAM,
      value: data,
    });
    this.setState({
      redirectTo: `/realexamquiz`,
      isModalVisible: false,
    });
  }

  handleCancel() {
    this.setState({ isModalVisible: false });
  }

  getDisableClass() {
    if (this.props.post && this.props.post.countQuestion) return "";
    return " disable";
  }
  render() {
    if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />;
    return (
      <>
        <button
          className={"btn-ds outline-pr block" + this.getDisableClass()}
          onClick={() => this.btnExamNowClicked()}
        >
          <i className="fas fa-tasks">&nbsp;</i>
          {this.props.text || "Làm kiểm tra"}
        </button>
        <Modal
          title={<TitleForModel text="Thông tin thi" />}
          visible={this.state.isModalVisible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
        >
          <p className="mb-0">Số câu thi.</p>
          <Input
            defaultValue={
              (this.state.totalQa >= this.state.numberQa
                ? this.state.numberQa
                : this.state.totalQa) || ""
            }
            name="numberQa"
            type="number"
            addonAfter={"Tổng: " + this.state.totalQa}
            className="mb-3"
            disabled
          />

          <p className="mb-0">Thời gian làm (Phút).</p>
          <Input
            value={this.state.numberTime || ""}
            name="numberTime"
            type="number"
            addonAfter={"Tổng: " + this.state.numberTime}
            className="mb-3"
            disabled
          />
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateToProps)(ButtonRealExamComponent);
