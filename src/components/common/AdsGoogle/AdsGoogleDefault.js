import React, { Component } from 'react';
import { Apis } from "../../../common/utils/Apis";

class AdsGoogleDefault extends Component {
  constructor(props) {
    super(props);
    this.isShowAds = Apis.IS_SHOW_ADS;
  }

  componentDidMount() {
    if (this.isShowAds)
      (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  render() {
    if (this.isShowAds === '0') return '';
    if (this.isShowAds === '2')
      return (
        <div
          onClick={() => alert('Ads Clicked')}
          style={{
            display: 'block',
            width: this.props.width || '100%',
            height: this.props.height || '200px',
            backgroundColor: '#b9b9b9',
            cursor: 'pointer',
          }}
        >
        </div>
      );
    return (
      <ins className='adsbygoogle'
        style={{
          display: 'block',
          width: this.props.width || '100%',
          height: this.props.height || '200px'
        }}
        data-ad-client={this.props.client || "ca-pub-1245743565916746"}
        data-ad-slot={this.props.slot}
        data-ad-format='auto'
        data-full-width-responsive="true"
      >
      </ins>
    );
  }
}

export default AdsGoogleDefault;