import React, { Component } from 'react';

class LoadingV2Component extends Component {
  render() {
    return (
      <div className="ipl-progress-indicator" id="ipl-progress-indicator">
        <div className="ipl-progress-indicator-head">
          <div className="first-indicator" />
          <div className="second-indicator" />
        </div>
        <div className="insp-logo-frame">
          <img
            src='/image/gif/gl-loading.svg'
            width={112} className="insp-logo-frame-img" height={112}
            alt='loading page logo'
          />
          <p className='mb-0 fw-bold text-center'>
            {/* <span className='text-muted float-start op-01'>© 2021 MF </span> */}
            <span
              className='text-uppercase'
            >
              <i className="far fa-heart" style={{ fontSize: '5px' }}>&nbsp;</i>
              <i className="far fa-heart" style={{ fontSize: '10px' }}>&nbsp;</i>
              <i className="far fa-heart"></i>
            &nbsp;hufidoc.online&nbsp;
            <i className="far fa-heart">&nbsp;</i>
              <i className="far fa-heart" style={{ fontSize: '10px' }}>&nbsp;</i>
              <i className="far fa-heart" style={{ fontSize: '5px' }}>&nbsp;</i>
            </span>

            {/* <span className='text-muted float-end op-01'>© 2021 MF </span> */}
          </p>
        </div>
      </div>
    );
  }
}

export default LoadingV2Component;