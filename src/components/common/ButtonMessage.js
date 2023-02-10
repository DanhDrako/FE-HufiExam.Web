import React, { Component } from 'react';
import { connect } from 'react-redux';
import FACTORY from '../../common/FACTORY';
import { ActionType } from '../../common/utils/actions-type';
import { NotificationKeys } from '../../common/utils/keys';

class ButtonMessage extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    this.userLoged = FACTORY.fun_getUserLoginLocalStorage();
  }

  async btnMessClicked() {
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (!this.userLoged && (this.props.user && !this.props.user.userName)) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.INFO,
        title: 'Vui lòng đăng nhập',
        message: 'Vui lòng đăng nhập, để dùng tính năng này.',
      })
      return;
    }
    this.dispatch({
      type: ActionType.FORK_MESSAGE_USER,
      user: this.props.user,
    });
  }

  render() {
    return (
      <span
        onClick={() => this.btnMessClicked()}
        role="link">
        <i className="fab fa-facebook-messenger"></i>
      </span>
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    forkMess: state.forkMess,
    user: state.user.user,
  }
}

export default connect(mapStateToProps)(ButtonMessage);