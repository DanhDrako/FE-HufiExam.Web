import React, { Component } from 'react';

class LoadingComponent extends Component {
  render() {
    return (
      <div id="gl-loading">
        <img id="ct-loading" src="/image/gif/gl-loading.svg" alt='Loading...' />
      </div>
    );
  }
}

export default LoadingComponent;