import { Pagination } from 'antd';
import React, { Component } from 'react';
import Apis from '../../common/utils/Apis/Apis';

class PagingComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: Apis.NUM_PER_PAGE,
    }
  }

  onPageChange(page, pageSize) {
    this.setState({
      currentPage: page,
      pageSize: pageSize,
    }, () => {
      this.props.onPageChange(page, pageSize);
      if (this.props.refScroll)
        this.props.refScroll.scrollIntoView({ block: 'start', behavior: 'smooth' });
      else if (!this.props.nonScroll) window.scrollTo(0, 0);
    });
  }

  getUiVisible() {
    // const perPage = Apis.NUM_PER_PAGE;
    if (this.props.total && this.props.total > 10)
      return (
        <div className='p-2' style={{ textAlign: 'right' }}>
          <Pagination
            current={this.state.currentPage}
            total={this.props.total}
            onChange={(page, pageSize) => this.onPageChange(page, pageSize)}
            showSizeChanger
            showQuickJumper
            // pageSize={perPage}
            // pageSizeOptions={[
            //   perPage * 1,
            //   perPage * 2,
            //   perPage * 4,
            //   perPage * 9
            // ]}
            showTotal={total => <p className='fw-bold text-uppercase _text-sec'>Total <span className='_text-thr'>{total}</span> items</p>}
          />
        </div>
      );
  }

  render() {
    return (
      <div className="d- pagination justify-content-end my-4">
        {this.getUiVisible()}
      </div>
    );
  }
}

export default PagingComponent;