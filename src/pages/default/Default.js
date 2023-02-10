import React, { Component } from 'react';
import DefaultComponent from '../../components/default/DefaultComponent';

// import loadable from '@loadable/component';
// const DefaultComponent = loadable(() => import('../../components/default/DefaultComponent'));

class Default extends Component {
  render() {
    return (
      <>
        <DefaultComponent />
      </>
    );
  }
}

export default Default;