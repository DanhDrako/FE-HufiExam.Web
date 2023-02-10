import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { Component } from 'react';

class ButtonDownload extends Component {
  render() {
    return (
      <a style={{ marginRight: '5px' }} href={this.props.href} target='blank'>
        <Button icon={<DownloadOutlined />} type='primary' ghost>
          {this.props.title}
        </Button>
      </a>
    );
  }
}

export default ButtonDownload;