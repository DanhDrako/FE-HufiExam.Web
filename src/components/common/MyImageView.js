import { Image, Tooltip } from 'antd';
import React, { Component } from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import FACTORY from '../../common/FACTORY';

class MyImageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLazy: true,
    }
  }

  render() {
    if (this.state.isLazy)
      return (
        <Tooltip
          color={FACTORY.TOOLTIP_COLOR}
          title='Click 2 lần để xem!'
          className='c-pt'
        >
          <LazyLoadImage
            onClick={() => this.setState({ isLazy: false })}
            {...this.props}
          />
        </Tooltip>
      );

    return (
      <Image
        {...this.props}
      />
    );
  }
}

export default MyImageView;