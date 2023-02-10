import React, { Component } from "react";
import { connect } from "react-redux";
import { ActionType } from "../../../common/utils/actions-type";
import { Apis } from "../../../common/utils/Apis";
import io from "socket.io-client";
import FACTORY from "../../../common/FACTORY";
import AvatarComponent from "./components/AvatarComponent";
import ButtonLoginComponent from "./components/ButtonLoginComponent";
import ButtonSigupComponent from "./components/ButtonSigupComponent";
import NavbarMobileComponent from "./components/mb/NavbarMobileComponent";
import NavbarPcComponent from "./components/pc/NavbarPcComponent";

// import loadable from '@loadable/component';
// const AvatarComponent = loadable(() => import('./components/AvatarComponent'));
// const ButtonLoginComponent = loadable(() => import('./components/ButtonLoginComponent'));
// const ButtonSigupComponent = loadable(() => import('./components/ButtonSigupComponent'));
// const NavbarMobileComponent = loadable(() => import('./components/mb/NavbarMobileComponent'));
// const NavbarPcComponent = loadable(() => import('./components/pc/NavbarPcComponent'));

// import socket io

// initial socket = null
let socket = null;

// ENDPOINT
const ENDPOINT = Apis.API_HOST.substring(0, Apis.API_HOST.indexOf("/api"));

// get new socket
const NEW_SOCKET = (userLoged) => {
  if (String(process.env.REACT_APP_TURN_MESSENGER).toLowerCase() === "off")
    return;
  // DEV
  if (String(process.env.REACT_APP_DEBUG_MODE).toLowerCase() === "true")
    socket = io(ENDPOINT, {
      query: { ...userLoged },
    });
  // PROD
  else
    socket = io(ENDPOINT, {
      path: "/socket-mess",
      query: { ...userLoged },
    });
};

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    this.dimension = FACTORY.fun_getWindowDimensions();
  }

  componentDidMount() {
    const userLocal = FACTORY.fun_getUserLoginLocalStorage();
    this.getNewSocketOrDestroy(userLocal);
    if (!userLocal || this.props.user.avatar) return;
    this.checkAuth(userLocal);
  }

  async checkAuth(userLocal) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    PublicModules.fun_get(
      Apis.API_HOST + Apis.API_TAILER.AUTH,
      PublicModules.fun_getConfigBearerDefault({})
    ).then((dataRes) => {
      if (!dataRes.success) return;
      this.dispatch({
        type: ActionType.USER_LOGIN,
        user: { ...userLocal, ...dataRes.data },
      });
    });
  }

  getNewSocketOrDestroy(userLoged) {
    if (!userLoged && socket != null) {
      socket.disconnect();
      socket = null;
      return;
    }
    if (userLoged && socket == null) NEW_SOCKET(userLoged);
  }

  componentWillReceiveProps(_nextProps) {
    const userLocal = FACTORY.fun_getUserLoginLocalStorage();
    this.getNewSocketOrDestroy(userLocal);
  }

  getUserAvatar() {
    const user = this.props.user;
    // login ?
    if (user.userName && user.role) return <AvatarComponent user={user} />;
    else if (this.dimension.width >= 1000)
      return (
        <>
          <ButtonLoginComponent />
          <ButtonSigupComponent />
        </>
      );
    else
      return (
        <div className="row">
            <ButtonLoginComponent />
            <ButtonSigupComponent />
        </div>
      );
  }

  navLinkClicked(menu) {
    switch (menu) {
      case "USER_POST": {
        break;
      }
      case "HOME": {
        this.dispatch({
          type: ActionType.POST_FILTER_UPDATE_BLACK_MARKET,
          value: false,
        });
        break;
      }
      case "BLACK_MARKET": {
        this.dispatch({
          type: ActionType.POST_FILTER_UPDATE_BLACK_MARKET,
          value: true,
        });
        break;
      }

      default:
        break;
    }
  }

  getNavBar() {
    if (this.dimension.width >= 1000)
      return (
        <NavbarPcComponent
          getUserAvatar={() => this.getUserAvatar()}
          navLinkClicked={() => this.navLinkClicked()}
          user={this.props.user}
          socket={socket}
        />
      );
    return (
      <NavbarMobileComponent
        getUserAvatar={() => this.getUserAvatar()}
        navLinkClicked={() => this.navLinkClicked()}
        user={this.props.user}
        socket={socket}
      />
    );
  }

  render() {
    return <header className="p-3 _bg-opa">{this.getNavBar()}</header>;
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    user: state.user.user,
    filterPost: state.filterPost,
  };
};

export default connect(mapStateToProps)(HeaderComponent);
