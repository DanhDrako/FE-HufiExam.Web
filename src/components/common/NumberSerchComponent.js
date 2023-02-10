import { LoadingOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class NumberSerchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      number: 0,
    }
  }


  getLoadingFiter() {
    if (this.state.isLoading)
      return (
        <span>
          <LoadingOutlined /> Đang tải...
        </span>
      );
    return (
      <span className='text-uppercase'>
        Tìm thấy <span className='_text-sec'>{this.state.number} Bài viết</span>
      </span>
    );
  }

  componentWillReceiveProps(nextProps) {
    const param = nextProps.searchPostNum;
    this.setState({
      isLoading: param.isLoading,
      number: param.number,
    });
  }

  render() {
    return this.getLoadingFiter();
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    searchPostNum: state.searchPostNum,
  }
}

export default connect(mapStateToProps)(NumberSerchComponent);