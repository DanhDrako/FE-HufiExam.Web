import { Tooltip } from 'antd';
import React, { Component } from 'react';
import { FacebookShareButton } from "react-share";
import FACTORY from '../../common/FACTORY';

class ButtonShareOnFacebook extends Component {
  constructor(props) {
    super(props);
    // const api = process.env.REACT_APP_API_END_POINT;
    // this.ENDPOINT = api.substring(0, api.indexOf('/api'));
    this.ENDPOINT = 'https://myhufier.com';
  }

  getHashTag(hashTag) {
    hashTag = hashTag.replaceAll(' ', '');
    hashTag = hashTag.replaceAll('-', '')
    hashTag = hashTag.replaceAll('.', '');
    return `#${hashTag}`;
  }

  render() {
    return (
      <Tooltip
        color={FACTORY.TOOLTIP_COLOR}
        title='Chia sẽ lên facebook'
      >
        {this.props.post && this.props.post.id ?
          <FacebookShareButton
            url={`${this.ENDPOINT}/post/${this.props.post.slug}.${this.props.post.id}`}
            quote={this.props.post.title}
            description={this.props.post.description}
            hashtag={this.getHashTag(this.props.post.cate.name)}
          >
            <i className="fab fa-facebook font-react"></i>
          </FacebookShareButton> : ''}
      </Tooltip>
    );
  }
}

export default ButtonShareOnFacebook;