import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import FACTORY from '../../../../common/FACTORY';
import { ActionType } from '../../../../common/utils/actions-type';

class AvatarComponent extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    this.state = {
      isLogout: false,
    };
  }

  async btnSignOutClicked() {
    const CoreUI = await FACTORY.GET_CORE_UI();
    // show confirm !
    const ok = await CoreUI.fun_showConfirm({
      message: 'Thực hiện chức năng đăng xuất',
    });
    if (!ok) return;

    this.setState({
      isLogout: true,
    });
    this.dispatch({
      type: ActionType.USER_LOGOUT,
    });
  }

  getAccessGoToAdminPage() {
    if (this.props.user.role === 'ADMIN')
      return (
        <li><Link to="/admin-v2" className="dropdown-item">Go To Admin Page</Link></li>
      );
  }

  render() {
    if (this.state.isLogout)
      return (
        <Redirect to="/" />
      );
    return (
      <div className="dropdown">
        <span role="link" className="d-flex align-items-center text-white text-decoration-none" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
          <img src={FACTORY.fun_getAvatarImageView(this.props.user.avatar, this.props.user.avatarUploadType)} alt="" width={32} height={32} className="rounded-circle me-2" />
        </span>
        <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
          <li><span role="link" className="dropdown-item" >
            Wellcome: {FACTORY.fun_trimString(this.props.user.userName, 6)}
          </span></li>
          {/* <li><span role="link" className="dropdown-item" >Cài đặt</span></li> */}
          <li><Link to='/profile' className="dropdown-item" >Cá nhân hóa</Link></li>
          {this.getAccessGoToAdminPage()}
          <li className='dropdown-divider'></li>
          <li><span role="link" onClick={() => this.btnSignOutClicked()} className="dropdown-item" >Đăng xuất</span></li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    user: state.user.user
  }
}

export default connect(mapStateToProps)(AvatarComponent);