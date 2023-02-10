import { LogoutOutlined, TagOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import FACTORY from '../../../common/FACTORY';
import { ActionType, AdminRouterType } from '../../../common/utils/actions-type';

class AdminV2MenuComponent extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    this.state = {
      selectedMenuItem: AdminRouterType.ALL_POST,
    }
  }

  componentDidMount() {
    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')
    function colorLink() {
      if (linkColor) {
        linkColor.forEach(l => l.classList.remove('active'))
        this.classList.add('active')
      }
    }
    linkColor.forEach(l => l.addEventListener('click', colorLink));
  }

  handleClick = async (e) => {
    const CoreUI = await FACTORY.GET_CORE_UI();
    let router = e;
    // such as middleware check is updated ?
    if (this.props.adminRouter === AdminRouterType.EDIT_POST) {
      const ok = await CoreUI.fun_showConfirm({
        title: 'Rời khỏi mà chưu lưu ?',
        message: 'Bạn có chắc rời khỏi trang Edit bài viết này mà chưa lưu ?',
      });
      if (!ok) return;
      if (router === AdminRouterType.INSERR_NEW_POST)
        router = AdminRouterType.ALL_POST;
    }
    this.dispatch({
      type: ActionType.ADMIN_ROUTER_UPDATE,
      router: router,
    });
    this.setState({
      selectedMenuItem: router,
    });
  };

  render() {
    return (
      <nav className="nav">
        <div>
          <a href='/' className="nav_logo">
            <i className="fas fa-book-reader nav_logo-icon" style={{ fontSize: '20px' }}></i>
            <span className="nav_logo-name">My Hufier</span>
          </a>
          <div className="nav_list">
            <span
              onClick={() => this.handleClick(AdminRouterType.DASHBOARD)}
              role='link' className="nav_link active">
              <i className="far fa-chart-bar nav_icon"></i>
              <span className="nav_name">Dashboard</span>
            </span>
            <span
              onClick={() => this.handleClick(AdminRouterType.ALL_POST)}
              role='link' className="nav_link">
              <i className="fas fa-list nav_icon"></i>
              <span className="nav_name">Quản lý bài viết</span>
            </span>
            <span
              onClick={() => this.handleClick(AdminRouterType.CATEGORIES)}
              role='link' className="nav_link">
              <i className="fab fa-buffer nav_icon"></i>
              <span className="nav_name">Quản lý thể loại</span>
            </span>
            <span
              onClick={() => this.handleClick(AdminRouterType.TAGS)}
              role='link' className="nav_link">
              <TagOutlined className='nav_icon' />
              <span className="nav_name">Quản lý thẻ</span>
            </span>
          </div>
        </div>
        <span role='link' className="nav_link">
          <LogoutOutlined className='nav_icon' />
          <span className="nav_name">SignOut</span> </span>
      </nav>
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    adminRouter: state.adminRouter.router,
  }
}

export default connect(mapStateToProps)(AdminV2MenuComponent);