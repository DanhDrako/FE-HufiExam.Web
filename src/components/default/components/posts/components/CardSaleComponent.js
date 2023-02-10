import React, { Component } from "react";
import moment from "moment";
import FACTORY from "../../../../../common/FACTORY";
import ButtonsReactComponent from "./components/ButtonsReactComponent";
import MyImageView from "../../../../common/MyImageView";
import ButtonGoToFacebook from "../../../../common/ButtonGoToFacebook";
import ButtonMessage from "../../../../common/ButtonMessage";
import { Modal, Tooltip } from "antd";
import { FacebookFilled } from "@ant-design/icons";
import { NotificationKeys } from "../../../../../common/utils/keys";
import TitleForModel from "../../../../home/header/components/TitleForModel";

// import loadable from '@loadable/component';
// const ButtonsReactComponent = loadable(() => import('./components/ButtonsReactComponent'));
// const MyImageView = loadable(() => import('../../../../common/MyImageView'));

class CardSaleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  getPercent(post) {
    if (post) {
      const pr =
        (post.priceSell * 100) / (post.priceBuy || post.priceSell) || 0;
      return Math.round(100 - pr);
    }
    return "";
  }

  handleOnOK = async () => {
    const CoreUI = await FACTORY.GET_CORE_UI();
    navigator.clipboard.writeText(this.props.post.own.email);
    this.setState(
      {
        isModalVisible: false,
      },
      () => {
        CoreUI.fun_showNotification({
          type: NotificationKeys.SUCCESS,
          title: "Đã coppy địa chỉ email thành công",
          message: "Hãy liên hệ với người bán sớm nhất nhé",
        });
      }
    );
  };

  render() {
    const post = this.props.post;
    return (
      <div className="card card-hover">
        <div
          style={{
            height: "150px",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "5px 15px 0px 3px",
          }}
        >
          <span role="link" className="card-img-top p-2 pb-0">
            <MyImageView
              src={FACTORY.fun_getImageViewFromServer(
                post.imageBanner,
                post.imageUploadType
              )}
              alt=""
              className="card-img-top rounded-top-md"
            />
          </span>
        </div>
        {/* Card Body */}
        <div className="card-body">
          <div className="list-product-item__favourite">
            <i className="fas fa-check"></i>
            <span>Yêu thích</span>
          </div>
          <div className="list-product-item__sale-off">
            <p className="list-product-item_sale-off-percent">
              {this.getPercent(post)} %
            </p>
            <p className="list-product-item_sale-off-label">GIẢM</p>
          </div>
          <h6 style={{ height: "40px", overflow: "hidden" }} className="mb-2">
            <span role="link">{post.title}</span>
          </h6>
          {/* List */}
          <div className="float-start">{moment(post.createAt).calendar()}</div>
          <div className="float-end">
            <ButtonMessage user={post.own} />
          </div>
          <br />
          <hr />
          <div className="text-center">
            <ButtonsReactComponent post={post} />
          </div>
        </div>
        {/* Card Footer */}
        <div className="card-footer">
          <div className="row align-items-center g-0">
            <div className="col-auto">
              <MyImageView
                src={FACTORY.fun_getAvatarImageView(
                  post.own.avatar,
                  post.own.avatarUploadType
                )}
                style={{ width: "30px" }}
                className="rounded-circle avatar-xs"
                alt=""
              />
            </div>
            <div className="col ms-2">
              <span>{post.own.username}</span>
            </div>
            <div className="col-auto">
              <ButtonGoToFacebook user={post.own} />
            </div>
          </div>
          <div className="mt-2">
            <div className="float-start">
              <span className="price-buy">
                {FACTORY.fun_formatCurrency(post.priceBuy)}
              </span>
            </div>
            <div className="float-end _text-thr fw-bold">
              <span>{FACTORY.fun_formatCurrency(post.priceSell)}</span>
            </div>
            <br />
          </div>
          <div className="mt-2">
            <button
              className="btn-ds outline-sec block text-uppercase"
              onClick={() => this.setState({ isModalVisible: true })}
            >
              Thông tin
            </button>
          </div>
          <Modal
            title={<TitleForModel text="Thông tin người bán" />}
            className="_text-thr"
            visible={this.state.isModalVisible}
            onOk={() => this.handleOnOK()}
            onCancel={() => this.setState({ isModalVisible: false })}
          >
            <div className="row align-items-center g-0">
              <div className="col-auto">
                <MyImageView
                  src={FACTORY.fun_getAvatarImageView(
                    post.own.avatar,
                    post.own.avatarUploadType
                  )}
                  style={{ width: "100px" }}
                  className="rounded-circle avatar-xs"
                  alt=""
                />
              </div>
              <div className="col ms-2">
                <h4 className="_text-thr">{post.own.username}</h4>
              </div>
            </div>
            <div className="text-capitalize">
              <span className="fw-bold">Email:</span>
              <span className="_text-thr">
                {post.own.email || "Người bán chưa cập nhật email"}
              </span>
            </div>
            <div className="text-capitalize">
              <span className="fw-bold">Số điện thoại:</span>
              {
                post.own.phone ? (
                  <span className="_text-thr">
                {post.own.phone}
              </span>
                ) : (
                  <Tooltip
                  color={FACTORY.TOOLTIP_COLOR}
                  className="_text-thr"
                  title="Người này chưa cập nhật số điện thoại !Mẹo: Nhấn vào biểu tượng avatar góc bên phải, phía trên cùng -> Cá nhân hóa -> cập nhật số điện thoại"
                >
                  Người bán chưa cập nhật số điện thoại
                </Tooltip>
                )
              }
            </div>
            <div className=" text-capitalize">
              <span className="fw-bold">Link Facebook:</span>
              {post.own.linkFacebook ? (
                <a
                  href={post.own.linkFacebook}
                  className="_text-thr"
                  target="blank"
                >
                  <FacebookFilled /> Facebook
                </a>
              ) : (
                <Tooltip
                  color={FACTORY.TOOLTIP_COLOR}
                  className="_text-thr"
                  title="Người này chưa cập nhật Link Facebook !Mẹo: Nhấn vào biểu tượng avatar góc bên phải, phía trên cùng -> Cá nhân hóa -> cập nhật link facebook"
                >
                  Facebook
                </Tooltip>
              )}
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default CardSaleComponent;
