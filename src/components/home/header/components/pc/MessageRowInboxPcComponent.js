import React, { Component } from 'react';
import FACTORY from '../../../../../common/FACTORY';

class MessageRowInboxComponent extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
  }

  Clickchatbox_pc() {
    this.props.onOpenMessageBox(this.props.user);
  }

  render() {
    return (
      <li className="infor__messer-item" onClick={() => this.Clickchatbox_pc()}>
        <div className="infor__messer-item-hover">
          <div className="infor__messer-item-text">
            <ul className="infor__messer-item-text--">
              <li className="infor__messer-p-li">
                <img src={FACTORY.fun_getAvatarImageView(this.props.user.avatar, this.props.user.avatarUploadType)} className="author-img-meser" alt="logo author" />
                {this.props.user.isOnline ? <span className="avatar_activate"></span> : ''}
                {this.props.user.countUnRead !== 0 ? <span className="btn-messer-notifi">{this.props.user.countUnRead}</span> : ''}
              </li>
              <li className="infor__messer-p-li">
                <div className="infor__messer-item-text-item">
                  <p className="infor__messer-item-text-item-name infor__messer-p">
                    {this.props.user.username}
                  </p>
                  <p className="infor__messer-item-text-item-chat infor__messer-p">Hi, Admin anh đẹp trai quá đi</p>
                </div>
              </li>
            </ul>
            <ul className="infor__messer-item-text--">
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </li>
            </ul>
          </div>
        </div>
      </li>
    );
  }
}

export default MessageRowInboxComponent;