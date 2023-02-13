import { message, Skeleton } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionType } from '../../../../../common/utils/actions-type';
import { Apis } from '../../../../../common/utils/Apis';
import { NotificationKeys } from '../../../../../common/utils/keys';
import { Progress } from 'antd';
import FACTORY from '../../../../../common/FACTORY';
import OutsideClickHandler from 'react-outside-click-handler';
import MessageRowInboxComponent from './MessageRowInboxPcComponent';

// import loadable from '@loadable/component';
// const OutsideClickHandler = loadable(() => import('react-outside-click-handler'));
// const MessageRowInboxComponent = loadable(() => import('./MessageRowInboxPcComponent'));

const initialState = {
  userFinds: [],
  isLoading: false,
}

class ButtonMessagePcComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
    };
    this.isInitilizeNof = false;
    this.socket = null;
    this.userNameChatWith = null;
    this.oldRoom = null;
    this.dispatch = this.props.dispatch;
    this.messengerTimeDelay = Number.parseInt(process.env.REACT_APP_MESSENGER_DELAY || 5);
    this.countDownTimer = null;
    this.numberCountDown = 0;
  }

  initilizeNof() {
    if (!this.socket)
      this.socket = this.props.socket;
    if (!this.socket || this.isInitilizeNof) return;
    this.isInitilizeNof = true;
    this.socket.on('notification', (args) => {
      const userNameFrom = args.user.username;
      if (userNameFrom === this.userNameChatWith)
        this.socket.emit('serverMakeReadMessage', { room: args.room, from: args.user.id });
      this.dispatch({
        type: ActionType.RECIVE_MESSAGE,
        value: { ...args, userNameChatWith: this.userNameChatWith },
      });
    });
    this.socket.on('makeReadMessage', (args) => {
      this.userNameChatWith = args.from;
      this.oldRoom = args.room;
      this.dispatch({
        type: ActionType.MAKE_READ_MESSAGE,
        value: args,
      });
    });
    this.socket.on('onLeaveRoom', (_args) => {
      this.userNameChatWith = null;
    });
  }

  componentDidMount() {
    this.initilizeNof();
  }

  async loadUserHistories() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.LIST_USER_CHAT_HISTORIES,
      null,
      PublicModules.fun_getConfigBearerDefault({}),
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Lỗi khi tải lịch sử nhắn tin.',
          message: PublicModules.fun_mapErrorToMessage(dataRes.message),
        });
        return;
      }
      this.setState({ isLoading: false }, () => {
        this.dispatch({
          type: ActionType.RELOAD_USERS_CHAT_HISTORIES,
          totalCountUnRead: dataRes.total,
          listUsers: dataRes.data,
        });
      });
    });
  }

  async filterUserInbox(api) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (this.state.isLoading) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.INFO,
        title: 'Giới hạn nhắn tin, Làm ơn chờ.',
        message: 'Hãy mở khóa không giới hạn nhắn tin, hoặc hãy đợi.',
      });
      return;
    }
    this.setState({ isLoading: true });
    PublicModules.fun_get(
      api,
      PublicModules.fun_getConfigBearerDefault({}),
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        message.error(PublicModules.fun_mapErrorToMessage(dataRes.message));
        return;
      }
      this.setState({
        userFinds: dataRes.data,
        isLoading: false,
      });
    });
  }

  btnOnShowMessList_pc() {
    if (this.numberCountDown < this.messengerTimeDelay && !this.state.isLoading) {
      this.setState({ isLoading: true }, () => {
        this.countDownTimer = setInterval(() => {
          this.numberCountDown += 1;
          if (this.numberCountDown >= this.messengerTimeDelay) {
            clearInterval(this.countDownTimer);
            this.countDownTimer = null;
            // load list user histories
            this.loadUserHistories();
            this.numberCountDown = 0;
          } else {
            this.setState({});
          }
        }, 1000);
      })
    }
    document.getElementById("messer_show_list_pc").style.display = "block";
  }

  btnOffShowMessList_pc() {
    document.getElementById("messer_show_list_pc").style.display = "none";
  }

  tbSearchUserChange(e) {
    let value = e.target.value || '';
    value = value.trim();
    if (value === '') {
      this.setState({ userFinds: [] }, () => {
        this.loadUserHistories();
      });
      return;
    };
    // filter user
    const api = Apis.API_HOST + Apis.API_TAILER.USER + 'filter?keyWord=' + value;
    this.filterUserInbox(api);
  }

  componentWillUnmount() {
    if (this.socket && this.oldRoom) {
      this.socket.emit('leaveRoom', { room: this.oldRoom });
    }
    this.dispatch({
      type: ActionType.RESET_FORK_MESSAGE_USER,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.initilizeNof();
    const user = nextProps.forkMess.user;
    if (user.username === this.userNameChatWith) return;
    if (user.username && user.username !== this.props.forkMess.user.username && user.username !== this.userNameChatWith) {
      this.onOpenMessageBox(user);
    }
  }

  buildRoomName(userIdCurrent, userIdChatWith) {
    let withs = [];
    withs.push(userIdCurrent);
    withs.push(userIdChatWith);
    withs = withs.sort();
    return `room:[${withs[0]};vsl;${withs[1]}]`;
  }

  onOpenMessageBox(user) {
    const userLoged = FACTORY.fun_getUserLoginLocalStorage();
    if (this.socket == null || userLoged == null) {
      message.error('Sorry please try again later');
      return;
    }

    const roomName = this.buildRoomName(userLoged.userId, user.id);
    // leave room old ?
    if (this.oldRoom) {
      this.socket.emit('leaveRoom', { room: this.oldRoom });
    }
    this.socket.emit('joinRoom', {
      room: roomName,
      from: user.username,
      fromId: user.id,
      to: userLoged.username,
      toId: userLoged.userId,
    });
    this.userNameChatWith = user.username;
    this.dispatch({
      type: ActionType.OPEN_MESSAGE_BOX,
      value: { ...user, room: roomName },
    });

    document.getElementById("messer_show_chat_pc").style.display = "block"
    document.getElementById("messer_show_list_pc").style.display = "none"
    document.getElementById("messer_show_chat_pc-hidden").style.display = "none"
  }

  getUsesInboxUI() {
    if (this.state.isLoading) {
      return [1, 2, 3, 4].map((v) => {
        return (
          <Skeleton key={v} active avatar />
        );
      });
    }
    if (this.state.userFinds && this.state.userFinds.length !== 0)
      return this.state.userFinds.map((v, k) => {
        return (
          <MessageRowInboxComponent
            key={k}
            user={v}
            socket={this.props.socket}
            onOpenMessageBox={(user) => this.onOpenMessageBox(user)}
          />
        );
      });

    if (this.props.messNof && this.props.messNof.listUsers.length !== 0)
      return this.props.messNof.listUsers.map((v, k) => {
        return (
          <MessageRowInboxComponent
            key={k}
            user={v.user}
            socket={this.props.socket}
            onOpenMessageBox={(user) => this.onOpenMessageBox(user)}
          />
        );
      });
  }

  render() {
    return (
      <div>
        {/* <div className="col-12 col-lg-auto mb-lg-0 me-lg-3">
          <button className="btn-messer" onClick={() => this.btnOnShowMessList_pc()} >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chat-dots-fill" viewBox="0 0 16 16">
              <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
            {this.props.messNof.totalCountUnRead !== 0 ?
              <span className="btn-messer-notifi">{this.props.messNof.totalCountUnRead}</span> :
              ''
            }
          </button>
        </div> */}
        <OutsideClickHandler
          onOutsideClick={() => {
            this.btnOffShowMessList_pc();
          }}>
          <div className="infor__messer" id="messer_show_list_pc">
            <div className="header-messer"><span className="header-messer-text">Messenger</span>
              <Progress
                percent={FACTORY.fun_getPercent(this.numberCountDown, this.state.isLoading, this.messengerTimeDelay)} />
            </div>
            <div className="search-messer">
              <input onChange={(e) => { this.tbSearchUserChange(e) }} type="search" className="form-control" placeholder="Search Messenger" />
            </div>
            <ul style={{ height: '300px', overflow: 'auto' }} className="infor__messer-list">
              {this.getUsesInboxUI()}
            </ul>
            <div className="footer-messer">
              <p className="footer-messer-p" onClick={() => this.btnOffShowMessList_pc()}>Close messenger</p>
            </div>
          </div>
        </OutsideClickHandler>
      </div>
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    messNof: state.messNof,
    forkMess: state.forkMess,
  }
}

export default connect(mapStateToProps)(ButtonMessagePcComponent);