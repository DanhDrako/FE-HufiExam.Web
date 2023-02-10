import { Tooltip } from 'antd';
import React, { Component } from 'react';
import { EmailShareButton } from "react-share";
import FACTORY from '../../common/FACTORY';

class ButtonShareOnEmail extends Component {
  constructor(props) {
    super(props);
    // const api = process.env.REACT_APP_API_END_POINT;
    // this.ENDPOINT = api.substring(0, api.indexOf('/api'));
    this.ENDPOINT = 'https://myhufier.com';
  }

  render() {
    if (this.props.post && this.props.post.id)
      return (
        <EmailShareButton
          url={`${this.ENDPOINT}/post/${this.props.post.slug}.${this.props.post.id}`}
          subject={this.props.post.title}
          body={this.props.post.description + '\n============ myhufier.com ============\n'}
        >
          <Tooltip
            color={FACTORY.TOOLTIP_COLOR}
            title='Gởi qua gmail'
          >
            <i className="fas fa-envelope font-react"></i>
          </Tooltip>
        </EmailShareButton>
      );

    return '';
  }
}

export default ButtonShareOnEmail;