import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { GaurdEntity, UserLoginEntity } from '../../common/entities';
import FACTORY from '../../common/FACTORY';
import { ActionType } from '../../common/utils/actions-type';
import { Apis } from '../../common/utils/Apis';
import { MessageKeys, NotificationKeys } from '../../common/utils/keys';

const initialState = {
  isLoading: true,
  redirectTo: null,
}

class FacebookLogedPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
    }
    this.dispatch = this.props.dispatch;
  }

  async componentDidMount() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    let code = null;
    try {
      const query = this.props.location.search;
      code = query.substring(query.indexOf('?code=') + 6, query.length);
    } catch (_e) { PublicModules.fun_log(_e, 'Facebook Loged Result') }
    if (!code) {
      this.showError();
    } else {
      // call api login facebook.
      PublicModules.fun_post(
        Apis.API_HOST + Apis.API_TAILER.AUTH_FACEBOOK + '?code=' + code,
      ).then((dataRes) => {
        // error ?
        if (!dataRes.success) {
          this.showError();
        } else {
          const result = dataRes.data;
          // set token
          PublicModules.fun_removeTokenAndRefreshTokenLocalStorage();
          const gaurd = new GaurdEntity();
          gaurd.token = result.gaurd.token;
          gaurd.refresh = result.gaurd.refresh;
          PublicModules.fun_setTokenAndRefreshTokenLocalStorage(gaurd);
          // set user
          PublicModules.fun_removeUserLoginLocalStorage();
          const user = new UserLoginEntity();
          user.userName = result.user.username;
          user.role = result.user.role;
          user.userId = result.user.id;
          PublicModules.fun_setUserLoginLocalStorage(user);

          // NOF
          CoreUI.fun_showNotification({
            type: NotificationKeys.SUCCESS,
            title: 'Đăng nhập thành công',
            message: `Chào mừng bạn đến với ${process.env.REACT_APP_APP_NAME}`,
          });

          // dispatch state
          this.setState({
            isLoading: false,
            redirectTo: '/',
          }, () => {
            this.dispatch({
              type: ActionType.USER_LOGIN,
              user: {
                ...dataRes.data.user,
                ...user,
              }
            });
          });
        }
      });
    }
  }

  async showError() {
    const CoreUI = await FACTORY.GET_CORE_UI();
    CoreUI.fun_showConfirm({
      title: 'Đăng nhập facebook bị lỗi',
      message: MessageKeys.CHECK_CONNECTION,
    }).then((_) => {
      this.setState({ redirectTo: '/' });
      return;
    });
  }

  render() {
    if (this.state.redirectTo)
      return <Redirect to={this.state.redirectTo} />
    return (
      <div>
        {FACTORY.fun_getGl_loading(this.state.isLoading)}
      </div>
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    user: state.user.user,
  }
}

export default connect(mapStateToProps)(FacebookLogedPage);