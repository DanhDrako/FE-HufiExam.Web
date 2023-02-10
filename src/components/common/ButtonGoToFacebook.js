import { message, Tooltip } from 'antd';
import React, { Component } from 'react';
import FACTORY from '../../common/FACTORY';

class ButtonGoToFacebook extends Component {

  getUI() {
    if (!this.props.user)
      return '';
    const user = this.props.user;
    if (user.linkFacebook && user.linkFacebook.trim() !== '')
      return (
        <a
          href={user.linkFacebook} target='blank'>
          <Tooltip
            color={FACTORY.TOOLTIP_COLOR}
            title={user.displayName || user.username}>
            <i className="fas fa-link _text-sec">&nbsp;</i>
          </Tooltip>
        </a>
      );

    return (
      <Tooltip
        color={FACTORY.TOOLTIP_COLOR}
        title={user.displayName || user.username}>
        <span
          onClick={() => message.info('Người dùng này chưa đặt link facebook.')}
          role="link">
          <i className="fas fa-link text-muted">&nbsp;</i>
        </span>
      </Tooltip>
    );
  }

  render() {
    return this.getUI();
  }
}

export default ButtonGoToFacebook;