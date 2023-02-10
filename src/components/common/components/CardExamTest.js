import { CheckOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, List, Modal } from "antd";
import React, { Component } from "react";
import FACTORY from "../../../common/FACTORY";
import { PublicModules } from "../../../common/PublicModules";
import { Apis } from "../../../common/utils/Apis";
import { NotificationKeys } from "../../../common/utils/keys";
import ButtonExamComponent from "../../default/components/posts/components/components/ButtonExamComponent";
import ButtonRealExamComponent from "../../default/components/posts/components/components/ButtonRealExamComponent";
import TitleForModel from "../../home/header/components/TitleForModel";
import ButtonAddQA from "../ButtonAddQA";
import ButtonListEditQA from "../ButtonListEditQA";
import MyImageView from "../MyImageView";

class CardExamTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalExamReal: false,
      postId: 0,
      listData: [],
      isLoading: false,
      inputEmail: null,
      emailErr: "",
    };
    this.refCommentContent = React.createRef();
    this.dimension = FACTORY.fun_getWindowDimensions();
  }

  cbSetRealTestChange(postId, checked) {
    if (checked) this.props.showModalRealTestConf(postId);
  }

  getCardHeader(postId, isRealTest) {
    if (!isRealTest)
      return (
        <div className="card-header">
          <Checkbox
            onChange={(e) => this.cbSetRealTestChange(postId, e.target.checked)}
          >
            Đặt làm bài kiểm tra
          </Checkbox>
        </div>
      );
    return (
      <Button
        style={{ height: "39px" }}
        type="dashed"
        block
        danger
        onClick={() => this.setIdDataExamReal(postId)}
      >
        + Người làm bài
      </Button>
    );
  }

  getButtonExam(v) {
    if (v.isRealTest) {
      return (
        <ButtonRealExamComponent
          post={{
            countQuestion: 100,
            id: v.id,
            title: v.title,
            isRealTest: v.isRealTest,
          }}
          text={"Làm kiểm tra"}
        />
      );
    } else {
      return (
        <ButtonExamComponent
          post={{
            countQuestion: 100,
            id: v.id,
            title: v.title,
          }}
        />
      );
    }
  }

  renderLiItem(v, k) {
    if (v)
      return (
        <li className="_text-thr">
          {v.ttexam ? (<CheckOutlined />) : ''} &nbsp;
          STT: {k + 1} - EMAIL: {v.email} &nbsp; &nbsp;
          <span
            style={{ color: "red", float: "right", marginRight: "3%" }}
            onClick={() => this.handleClickDelete(v)}
          >
            Xóa
          </span>
        </li>
      );
  }

  setIdDataExamReal = (id) => {
    if (!id) return;
    this.setState({ postId: id }, () => {
      this.getDataExamReal();
    });
  };

  getDataExamReal = () => {
    if (this.state.isLoading) return;
    this.setState({ isLoading: true, isModalExamReal: true }, async () => {
      const dataRes = await PublicModules.fun_get(
        Apis.API_HOST + Apis.API_TAILER.REALEXAMOWN + this.state.postId
      );
      const data = dataRes.success && dataRes.data ? dataRes.data : [];
      this.setState({ isLoading: false, listData: data });
    });
  };

  handleClickDelete = async (v) => {
    const CoreUI = await FACTORY.GET_CORE_UI();
    const isConfirm = await CoreUI.fun_showConfirm({
      title: "Xác nhận: Bạn có muốn loại người dùng ngày khỏi bài thi không ?",
      message:
        "Sau khi hành động này được xác nhận, người dùng này sẽ bị loại khỏi hệ thống thi.",
    });
    if (!isConfirm) return;

    if (this.state.isLoading) return;
    this.setState({ isLoading: true }, async () => {
      const dataRes = await PublicModules.fun_delete(
        Apis.API_HOST + Apis.API_TAILER.REALEXAMOWN + v.id
      );
      this.setState({ isLoading: false }, () => {
        if (!dataRes.success) {
          CoreUI.fun_showNotification({
            type: NotificationKeys.ERROR,
            title: "Xóa người làm bị lỗi.",
            message: "Hãy thử lại nhé.",
          });
          return;
        }
        CoreUI.fun_showNotification({
          type: NotificationKeys.SUCCESS,
          title: "Xóa người làm thành công.",
          message: "Đã loại người dùng này ra khỏi hệ thông thi.",
        });
        this.getDataExamReal();
      });
    });
  };

  handleClickAdd = async () => {
    const CoreUI = await FACTORY.GET_CORE_UI();

    const inputEmail = this.state.inputEmail || "";

    // validate
    if (!inputEmail) {
      CoreUI.fun_showNotification({
        message: "Nhập không hợp lệ!",
      });
      return;
    }
    if (this.state.isLoading) return;
    this.setState({ isLoading: true }, async () => {
      const dataRes = await PublicModules.fun_post(
        Apis.API_HOST + Apis.API_TAILER.REALEXAMOWN,
        {
          email: inputEmail,
          postId: this.state.postId,
        },
        PublicModules.fun_getConfigBearerDefault({})
      );
      this.setState({ isLoading: false }, () => {
        if (!dataRes.success) {
          CoreUI.fun_showNotification({
            type: NotificationKeys.ERROR,
            title: "Thêm người làm bị lỗi.",
            message: "Hãy thử lại nhé.",
          });
          return;
        }
        CoreUI.fun_showNotification({
          type: NotificationKeys.SUCCESS,
          title: "Thêm người làm thành công.",
          message: "Hãy kiểm tra danh sách bên dưới nhé.",
        });
        this.getDataExamReal();
        return;
      });
    });
  };

  render() {
    const { v, updateAt, onAdded, userLoged } = this.props;
    const isAdmin = userLoged && userLoged.role === "ADMIN";
    return (
      <div className="col">
        <Modal
          visible={this.state.isModalExamReal}
          onCancel={() => this.setState({ isModalExamReal: false })}
          onOk={() => this.setState({ isModalExamReal: false })}
          title={<TitleForModel text="Thêm người làm bài" />}
          className="_text-thr"
        >
          <Input.Group compact>
            <span
              style={{
                fontWeight: "bold",
                color: "red",
              }}
            >
              {this.state.emailErr}
            </span>
            <Input
              style={{ width: "calc(100% - 20%)" }}
              type="email"
              placeholder="abc@gmail.com"
              onChange={(e) => this.setState({ inputEmail: e.target.value })}
            />
            <Button type="primary" onClick={() => this.handleClickAdd()}>
              Thêm
            </Button>
          </Input.Group>
          <div>
            <h5 className="text-center mt-3">Danh sách đã thêm</h5>
            {this.state.listData.length > 0 ? (
              <span>Tổng người tham gia: {this.state.listData.length}</span>
            ) : (
              ""
            )}
            <div
              ref={(ref) => (this.refCommentContent = ref)}
              className="comment-content"
              style={{
                overflowY: "auto",
                height: `${this.dimension.height - (this.dimension.height * 50 /100)}px`,
              }}
            >
              <List
                className="comment-list"
                itemLayout="horizontal"
                dataSource={this.state.listData}
                renderItem={(v, k) => this.renderLiItem(v, k)}
              />
            </div>
          </div>
        </Modal>

        <div className="card border">
          {isAdmin ? this.getCardHeader(v.id, v.isRealTest) : ""}
          <div className="card-img-top-exam">
            <MyImageView
              className="card-img-top w-100"
              alt="banner-exam"
              src={FACTORY.fun_getImageViewFromServer(
                v.imageBanner,
                v.imageUploadType
              )}
            />
          </div>

          <div className="card-body examtest-body">
            <h5 className="card-title">{v.title}</h5>
            <p className="card-text">{v.description}</p>
            {this.getButtonExam(v)}
          </div>
          <div className="card-footer">
            <span className="fw-bold m-0 p-0">Updated:</span> {updateAt}.
            <br />
            <span className="fw-bold m-0 p-0">Ngân hàng:</span>
            <span className="_text-sec fw-bold">{v.numQ}</span> Câu hỏi.
          </div>
          <div className="card-footer">
            <div className="row">
              <div className="col-6">
                <ButtonAddQA
                  postId={v.id}
                  countQa={v.numQ}
                  onAdded={(num, postId) => onAdded(num, postId)}
                />
              </div>
              <div className="col-6">
                <ButtonListEditQA
                  postId={v.id}
                  onAdded={(num, postId) => onAdded(num, postId)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardExamTest;
