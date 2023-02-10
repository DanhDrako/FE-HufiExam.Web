import React, { Component } from 'react';
import { Apis } from '../../../common/utils/Apis';

class AdsGoogleFixed extends Component {
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
        <div style={{
          display: 'inline-block',
          width: this.props.width || '100%',
          height: this.props.height || '250px',
          backgroundColor: '#b9b9b9'
        }}>
        </div>
      );
    return (
      <div className="fixed-ad">
        <ins className="adsbygoogle"
          style={{
            display: 'inline-block',
            width: this.props.width || '100%',
            height: this.props.height || '250px',
          }}
          data-ad-client={this.props.client || "ca-pub-1245743565916746"}
          data-ad-slot={this.props.slot}
        >
        </ins>
      </div>
    );
  }
}

export default AdsGoogleFixed;