import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { PicRightOutlined } from "@ant-design/icons";
import ButtonMessagePcComponent from "../pc/ButtonMessagePcComponent";
import BodyMessagePcComponent from "../pc/BodyMessagePcComponent";
import ButtonSwithTheme from "../../../../common/ButtonSwithDarkLightTheme";
import { Drawer, Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";

// import loadable from '@loadable/component';
// const ButtonMessagePcComponent = loadable(() => import('../pc/ButtonMessagePcComponent'));
// const BodyMessagePcComponent = loadable(() => import('../pc/BodyMessagePcComponent'));
// const ButtonSwithTheme = loadable(() => import('../../../../common/ButtonSwithDarkLightTheme'));

class NavbarMobileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      redirect: null,
      keyActivate: "black-market",
    };
  }

  navLinkClicked(value) {
    if (!this.props.navLinkClicked) return;
    this.props.navLinkClicked(value);
  }

  onClickNav(redirect, value) {
    if (!redirect && !value) return;
    this.navLinkClicked(value);
    this.setState({ redirect: redirect });
  }

  menuClickHandle(item) {
    this.props.clickItem(item.key);
  }

  render() {
    const pathName = window.location.pathname;
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className="container__mobile ">
        <ul className="mobile__navbar-list">
          <li className="mobile__navbar-item mobile__navbar-item-7 ">
            <nav className="navbar navbar--S ">
              <div className="container-fluid container-fluid- ">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={() => this.setState({ visible: true })}
                >
                  <PicRightOutlined />
                </button>
              </div>
            </nav>
          </li>
          <li className="mobile__navbar-item-">
            <Link to="/">
              <i
                className="fas fa-book-reader bi container-fluid-"
                style={{ fontSize: "30px" }}
              >
                &nbsp;
              </i>
            </Link>
          </li>

          <li className="mobile__navbar-item">
            {/* btn switchtheme */}
            <div className="mobile__navbar-item-R">
              <ul className="mobile__navbar-item-R">
                <li className="mobile__navbar-item-R-li">
                  <span style={{ marginRight: "7px" }}>
                    {/* <ButtonSwithTheme /> */}
                  </span>
                </li>
                <li>
                  {/*
              # Code by thangchay
              # edit by vietsaclo
              This button message -> user logon -> show button ?
            */}
                  {this.props.user && this.props.user.userId ? (
                    <ButtonMessagePcComponent
                      user={this.props.user}
                      socket={this.props.socket}
                    />
                  ) : (
                    ""
                  )}
                  {/*
              # Code by thangchay
              # edit by vietsaclo
              This is body button message -> user logon -> show body button ?
            */}
                  {this.props.user && this.props.user.userId ? (
                    <BodyMessagePcComponent
                      user={this.props.user}
                      socket={this.props.socket}
                    />
                  ) : (
                    ""
                  )}
                </li>
              </ul>
            </div>
          </li>
        </ul>
          <Drawer
            placement="left"
            onClose={() => this.setState({ visible: false })}
            closable={false}
            visible={this.state.visible}
          > 
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <ButtonSwithTheme />  <span className="fw-bold _text-thr">MY-HUFIER</span> 
          </div>
            <div className="m-3">
              <div className="d-flex">
                <div className="">
                  {this.props.getUserAvatar != null
                    ? this.props.getUserAvatar()
                    : ""}
                </div>
                <div className="mt-1">
                  {localStorage.getItem("USERNAME")
                    ? `Welcome: ${localStorage.getItem("USERNAME")}`
                    : ""}
                </div>
              </div>
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={["/"]}
              selectedKeys={[pathName]}
              defaultOpenKeys={['sub1']}
            >
              <Menu.Item
                key="/black-market"
                className="fw-bold"
                onClick={() => this.onClickNav("/black-market", "BLACK_MARKET")}
              >
                <i className="fas fa-torah icon-header"></i> &nbsp; Nhà sách
              </Menu.Item>
              <Menu.Item
                key="/user-post"
                className="fw-bold"
                onClick={() => this.onClickNav("/user-post", "USER_POST")}
              >
                <i className="fas fa-cannabis icon-header"></i>&nbsp; Đăng Bài
                Viết
              </Menu.Item>
              <Menu.Item
                key="/exam"
                className="fw-bold"
                onClick={() => this.onClickNav("/exam", "RANK_EXAMP")}
              >
                <i className="fab fa-teamspeak icon-header"></i>&nbsp; Thi thử
              </Menu.Item>
              <Menu.Item
                key="/rank"
                className="fw-bold"
                onClick={() => this.onClickNav("/rank", "RANK_EXAMP")}
              >
                <i className="fas fa-random icon-header"></i>&nbsp; Xếp hạng
              </Menu.Item>
              <SubMenu
                key="sub1"
                className="fw-bold"
                icon={
                  <i className="fab fa-buromobelexperte icon-header">&nbsp;</i>
                }
                title="Xem thêm"
              >
                <Menu.Item
                  key="/suggestion"
                  onClick={() => this.onClickNav("/suggestion", "SUGGESTION")}
                >
                  Hộp thư góp ý
                </Menu.Item>
                {/* <Menu.Item
                  key="/donate"
                  onClick={() => this.onClickNav("/donate", "DONATE")}
                >
                  Ủng hộ admin
                </Menu.Item> */}
                {/* <Menu.Item
                  key="/price-gold"
                  onClick={() => this.onClickNav("/price-gold", "PRICEGOLD")}
                >
                  Xem biểu đồ giá vàng
                </Menu.Item> */}
              </SubMenu>
            </Menu>
          </Drawer>
        </div>
    );
  }
}

export default NavbarMobileComponent;
