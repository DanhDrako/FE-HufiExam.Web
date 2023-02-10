import { Tooltip } from 'antd';
import React, { Component } from 'react';
import FACTORY from '../../common/FACTORY';

class SlogantComponent extends Component {
  render() {
    return (
      <div className="container-fluid mt-0 p-2 slogant">
        <p className='mb-0 fw-bold text-center'>
          <Tooltip title='Day | GREEN UI' color={FACTORY.COLOR_DAY_SEC}>
            <span className='text-muted float-start'>
              <i className="fas fa-sun">&nbsp;Day</i>
            </span>
          </Tooltip>
          <span
            className='text-uppercase'
          >
            <i className="far fa-heart" style={{ fontSize: '5px' }}>&nbsp;</i>
            <i className="far fa-heart" style={{ fontSize: '10px' }}>&nbsp;</i>
            <i className="far fa-heart"></i>
            &nbsp;======HUFI======&nbsp;
            <i className="far fa-heart">&nbsp;</i>
            <i className="far fa-heart" style={{ fontSize: '10px' }}>&nbsp;</i>
            <i className="far fa-heart" style={{ fontSize: '5px' }}>&nbsp;</i>
          </span>

          <Tooltip title='Night | PINK UI' color={FACTORY.COLOR_NIGHT_SEC}>
            <span className='text-muted float-end'>
              <i className="fas fa-moon">&nbsp;Night</i>
            </span>
          </Tooltip>
        </p>
      </div>
    );
  }
}

export default SlogantComponent;