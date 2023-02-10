import { message as AntdMessage, Progress } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Apis } from '../../../../../common/utils/Apis';
import moment from 'moment';
import { ActionType } from '../../../../../common/utils/actions-type';
import { NotificationKeys } from '../../../../../common/utils/keys';
import FACTORY from '../../../../../common/FACTORY';

const initialState = {
  listHistoriesMessage: [],
  tbInputMessage: '',
  isLoading: false,
};

class BodyMessagePcComponent extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.isInitilizeSocket = false;
    this.room = null;
    this.userCurrent = this.props.user.userName;
    this.userChatWith = {};
    this.listHistoriesMessage = [];
    this.state = {
      ...initialState,
    };
    this.refMessageScroll = React.createRef();
    this.dispatch = this.props.dispatch;
    this.userChatWithIsOnline = false;
    this.messengerTimeDelay = Number.parseInt(process.env.REACT_APP_MESSENGER_DELAY || 5);
    this.countDownTimer = null;
    this.numberCountDown = 0;
  }

  initilizeSocket() {
    if (this.socket == null)
      this.socket = this.props.socket;
    if (this.socket == null || this.isInitilizeSocket) return;
    // listining.
    this.userCurrent = this.props.user.userName;
    this.socket.on('message', ({ room, from, to, message, time, bonus }) => {
      // nof when chat hidden ?
      const isHidden = document.getElementById("messer_show_chat_pc-hidden").style.display === 'block';
      if (isHidden)
        AntdMessage.info(`Form: ${from} => ${message}`);

      this.userChatWithIsOnline =
        from === this.userChatWith.username
        || (from === this.userCurrent && this.userChatWithIsOnline);
      // add messages
      if (bonus && bonus === 'admin') return;
      const raw = Object.assign({}, { room, from, to, message, time });
      this.listHistoriesMessage.unshift(raw);
      this.setState({
        raw: raw,
        tbInputMessage: this.userCurrent === from ? '' : this.state.tbInputMessage,
      }, () => {
        this.scrollBottom();
      });
    });

    // initilized socket
    this.isInitilizeSocket = true;
  }

  componentDidMount() {
    this.socket = this.props.socket;
    this.initilizeSocket();
  }

  async loadListHistoryMessageFromDB(room) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    PublicModules.fun_get(
      Apis.API_HOST + Apis.API_TAILER.USER2USER_MESSAGE + room,
      PublicModules.fun_getConfigBearerDefault({}),
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        AntdMessage.error(dataRes.message);
        return;
      }
      const oldListLength = this.listHistoriesMessage.length;
      this.listHistoriesMessage = dataRes.data;
      this.setState({
        oldListLength,
        isLoading: false,
      }, () => {
        this.scrollBottom();
      });
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isReloadWithUserChatWith = nextProps.UserChatWith.username != null
      || (this.userChatWith.username !== nextProps.UserChatWith.username);

    const isLoadListHistoriesMess = this.listHistoriesMessage.length !== 0
      && isReloadWithUserChatWith;

    const isReloadWithTextBox = this.state.tbInputMessage !== nextState.tbInputMessage;

    // update ?
    if (isLoadListHistoriesMess
      || isReloadWithUserChatWith
      || isReloadWithTextBox
    ) return true;
    return false;
  }

  handleWithTimeOut(callBack) {
    if (this.numberCountDown < this.messengerTimeDelay && !this.state.isLoading) {
      this.setState({ isLoading: true }, () => {
        this.countDownTimer = setInterval(() => {
          this.numberCountDown += 1;
          if (this.numberCountDown >= this.messengerTimeDelay) {
            clearInterval(this.countDownTimer);
            this.countDownTimer = null;
            callBack();
            this.numberCountDown = 0;
          } else {
            this.setState({});
          }
        }, 1000);
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.userChatWith.username
      || (this.userChatWith.username !== nextProps.UserChatWith.username
        && nextProps.UserChatWith.username
      )
    ) {
      this.userChatWith = nextProps.UserChatWith;
      const newRoom = this.userChatWith.room;
      if (this.room !== newRoom || this.listHistoriesMessage.length === 0) {
        // load histories message
        if (newRoom) {
          this.room = newRoom;
          this.userChatWithIsOnline = false;
          this.handleWithTimeOut(() => this.loadListHistoryMessageFromDB(newRoom));
        }
        else
          this.setState({ ...initialState }, () => {
            this.initilizeSocket();
          });
      }
    }
  }

  // #funtion show PC
  Offchatbox_pc() {
    document.getElementById("messer_show_chat_pc").style.display = "none"
    document.getElementById("messer_show_chat_pc-hidden").style.display = "none"
    this.userChatWith = {};
    this.listHistoriesMessage = [];
    this.socket.emit('leaveRoom', { room: this.room });
    this.setState({ ...initialState }, () => {
      this.dispatch({
        type: ActionType.CLOSE_MESSAGE_BOX,
        value: {},
      });
      this.dispatch({
        type: ActionType.RESET_FORK_MESSAGE_USER,
      })
    });
  }
  Clickchatbox_pc_hidden() {
    document.getElementById("messer_show_chat_pc").style.display = "none"
    document.getElementById("messer_show_chat_pc-hidden").style.display = "block"
  }
  Offchatbox_pc_hidden() {
    document.getElementById("messer_show_chat_pc").style.display = "block"
    document.getElementById("messer_show_chat_pc-hidden").style.display = "none"
  }

  getHistoriesChatMessage() {
    const result = [];
    for (let k = this.listHistoriesMessage.length - 1; k >= 0; k--) {
      const v = this.listHistoriesMessage[k];
      if (v.from === this.userCurrent) {
        result.push(
          <div key={k} className='chat-r'>
            <div className="sp"></div>
            <div className="mess mess-r">
              <p className='_text-sec'>{v.message}</p>
              <div className="check _text-sec">
                <span>
                  {moment(v.time).fromNow()}
                </span>
                <div>
                  {/* icon send */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-all " viewBox="0 0 16 16">
                    <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        result.push(
          <div key={k} className="chat-l">
            <img src={FACTORY.fun_getAvatarImageView(this.userChatWith.avatar, this.userChatWith.avatarUploadType)} className="author-img-chat-mess" alt="logo author" ></img>
            <div className="mess mess-l">
              <p className='_text-thr'>{v.message}</p>
              <div className="check _text-thr">
                <span>
                  {moment(v.time).fromNow()}
                </span>
              </div>
            </div>
            <div className="sp"></div>
          </div>
        );
      }
    };
    return result;
  }

  tbOnChange(e) {
    const name = e.target.name;
    const value = e.target.value || '';
    this.setState({
      [name]: value,
    });
  }

  async handleSendMessage() {
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (this.state.isLoading) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.INFO,
        title: 'Giới hạn nhắn tin, Làm ơn chờ.',
        message: 'Hãy mở khóa không giới hạn nhắn tin, hoặc hãy đợi.',
      });
      return;
    }
    const mess = this.state.tbInputMessage.trim();
    const userChatWith = this.userChatWith;
    if (this.room == null)
      this.room = this.userChatWith.room;
    if (mess === '' || !userChatWith || !userChatWith.username) return;
    if (this.socket == null || this.room == null || this.userCurrent == null) {
      AntdMessage.error('Xin lỗi, đã xảy ra sự cố, hãy reload lại trang web');
      return;
    }
    this.socket.emit('sendMessage', { room: this.room, from: this.userCurrent, to: userChatWith.username, message: mess });
  }

  tbOnKeyPress(event, fork) {
    if (event.which === 13 || event.keyCode === 13 || fork) {
      this.handleSendMessage().then((_) => {
        this.handleWithTimeOut(() => {
          this.setState({ isLoading: false });
        });
      });
      return false;
    }
    return true;
  }

  scrollBottom() {
    // scroll bottom
    if (this.refMessageScroll)
      this.refMessageScroll.scrollTo({ top: this.refMessageScroll.scrollHeight, behavior: 'smooth', });
  }

  getFooterUI() {
    return (
      <div className="messer_chat-footer">
        <div className="messer_chat-footer_info">
          <ul className="messer_chat-footer_info-list">
            <li className="messer_chat-footer_info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-images" viewBox="0 0 16 16">
                <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" />
              </svg>
            </li>
            <li className="messer_chat-footer_info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-file-earmark-arrow-up" viewBox="0 0 16 16">
                <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707V11.5z" />
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
              </svg>
            </li>
          </ul>
        </div>
        <div className="input-group mb-3">
          <input value={this.state.tbInputMessage}
            name='tbInputMessage'
            onKeyPress={(e) => this.tbOnKeyPress(e)}
            onChange={(e) => this.tbOnChange(e)}
            autoComplete="off"
            type="text" className="form-control" placeholder="Input message" aria-label="Aa" aria-describedby="button-addon2" />
          <button
            onClick={(e) => this.tbOnKeyPress(e, true)}
            className="btn btn-sendMessage" type="button" >
            <i className="far fa-paper-plane"></i>
          </button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <div className="messer_chat" id="messer_show_chat_pc">
          <div className="messer_chat-header">
            <ul className="messer_chat-header-list">
              <li>
                <img src={FACTORY.fun_getAvatarImageView(this.userChatWith.avatar, this.userChatWith.avatarUploadType)} className="author-img-chat" alt="logo author" ></img>
              </li>
              <li>
                <span className='fw-bold'>{FACTORY.fun_trimString(this.userChatWith.username, 10)}</span>
                {this.userChatWith.isOnline || this.userChatWithIsOnline ? <p className="active_name"> Đang hoạt động</p> : ''}
              </li>
            </ul>
            <ul className="messer_chat-header-list">
              <li className="messer_chat-header-item-close" onClick={() => this.Clickchatbox_pc_hidden()} >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
                  <path d="M0 8a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1z" />
                </svg>
              </li>
              <li className="messer_chat-header-item-close" onClick={() => this.Offchatbox_pc()} >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                  <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
                </svg>
              </li>
            </ul>
          </div>
          <Progress
            percent={FACTORY.fun_getPercent(this.numberCountDown, this.state.isLoading, this.messengerTimeDelay)} />
          <div ref={(ref) => this.refMessageScroll = ref} className="messer_chat-container">
            {/* chat ib */}
            {this.getHistoriesChatMessage()}
          </div>
          {this.getFooterUI()}
        </div>
        {/* hidden messenger cricle */}
        <div className="messenger_cricle" id="messer_show_chat_pc-hidden" onClick={() => this.Offchatbox_pc_hidden()}>
          <img src={FACTORY.fun_getAvatarImageView(this.userChatWith.avatar, this.userChatWith.avatarUploadType)} className="author-img-chat-mess-hidden" alt="logo author" ></img>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    UserChatWith: state.UserChatWith,
    forkMess: state.forkMess,
  }
}

export default connect(mapStateToProps)(BodyMessagePcComponent);