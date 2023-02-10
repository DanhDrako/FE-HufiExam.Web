import { Button, Input, Result } from 'antd';
import React, { Component } from 'react';
import { Apis } from '../../common/utils/Apis';
import { Typography } from 'antd';
import { CloseCircleOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router';
import axios from 'axios';
import { NotificationKeys } from '../../common/utils/keys';
import FACTORY from '../../common/FACTORY';

class UserResetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.match.params.token,
      status: 'LOADING',
      redirectLink: null,
      isLoading: false,
    }
  }

  async handleNewPassword() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    // check pass
    const pass = this.state.tbPassword;
    const retypePass = this.state.tbRetypePassword;
    if (!pass || !retypePass || pass === '' || retypePass === '') {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Nhập không hợp lệ.',
        message: 'Hãy nhập hợp lệ để đổi mật khẩu!',
      });
      return;
    }
    // match
    if (pass !== retypePass) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Nhập không khớp.',
        message: 'Xác nhận mật khẩu phải khớp với mật khẩu!',
      });
      return;
    }
    this.setState({
      isLoading: true,
    });
    const token = this.state.token;
    let config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    let isSuccess = true;
    config = PublicModules.fun_makeNewConf(config);
    const dataRes = await axios.put(
      Apis.API_HOST + Apis.API_TAILER.RESET_PASSWORD + this.state.tbPassword,
      null,
      config,
    ).catch((err) => {
      isSuccess = false;
      PublicModules.fun_log(err, 'Reset Password Error', 32);
    });

    if (!dataRes || !dataRes.data) isSuccess = false;
    if (isSuccess) {
      const data = dataRes.data;
      if (!data.success) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Không thành công.',
          message: PublicModules.fun_mapErrorToMessage(data.message),
        });
        this.setState({
          isLoading: false,
        });
        return;
      }
      this.setState({
        status: 'SUCCESS',
        isLoading: false,
      });
      PublicModules.fun_log(data);
    } else {
      this.setState({
        status: 'ERROR',
        isLoading: false,
      });
    }
  }

  btnGoTo(value) {
    this.setState({
      redirectLink: value,
    });
  }

  tbChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  }

  getStatusUI() {
    switch (this.state.status) {
      case 'SUCCESS':
        return (
          <Result
            status="success"
            title="Kích hoạt tài khoản thành công. cám ơn bạn đã dùng MY-HUFIER!"
            subTitle="Chào mừng thành viên mới, hãy cùng nhau trao đổi và học tập tại đây nhé, hãy tìm kiếm tài liệu, đăng bài viết và luyện thi, và còn nhiều thứ hơn nửa đang chờ đợi bạn..."
            extra={[
              <Button onClick={() => this.btnGoTo('/')} type="primary" key="console">
                Về trang chủ và đăng nhập
              </Button>,
              <Button onClick={() => this.btnGoTo('/user-post')} key="buy">Đến trang đăng bài</Button>,
            ]}
          />
        );
      case 'ERROR':
        return (
          <Result
            status="error"
            title="Submission Failed"
            subTitle="Please check and modify the following information before resubmitting."
            extra={[
              <Button onClick={() => this.btnGoTo('/')} type="primary" key="console">
                Về trang chủ
              </Button>,
              <Button onClick={() => this.btnGoTo('/user-post')} key="buy">Đăng bài viết</Button>,
            ]}
          >
            <div className="desc">
              <Typography.Paragraph>
                <Typography.Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  The content you submitted has the following error:
        </Typography.Text>
              </Typography.Paragraph>
              <Typography.Paragraph>
                <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account has been
        frozen. <span role="link"  >Thaw immediately &gt;</span>
              </Typography.Paragraph>
              <Typography.Paragraph>
                <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account is not yet
        eligible to apply. <span role="link"  >Apply Unlock &gt;</span>
              </Typography.Paragraph>
            </div>
          </Result>
        );

      default:
        return (
          <Result
            status="info"
            title="Hãy nhập mật khẩu mới cho bạn."
            subTitle="PWD mới phải đủ mạnh, đừng quên mật khẩu của mình nửa nhé ^^."
            extra={[
              <Input.Password
                prefix={<UnlockOutlined />}
                name='tbPassword'
                onChange={(e) => this.tbChange(e)}
                placeholder='Nhập mật khẩu mới'
                key='tbPasswod' style={{ width: '250px', margin: '10px' }} />,
              <br key='br01' />,
              <Input
                name='tbRetypePassword'
                onChange={(e) => this.tbChange(e)}
                type='password'
                prefix={<LockOutlined />}
                placeholder='Nhập lại mật khẩu'
                key='tbRetypePassword' style={{ width: '250px', margin: '10px' }} />,
              <br key='br02' />,
              <Button
                type='primary'
                ghost
                style={{ width: '250px', margin: '10px' }} onClick={() => this.handleNewPassword()}
                key="buy">Đổi mật khẩu</Button>,
            ]}
          >
          </Result>
        );
    }
  }

  render() {
    if (this.state.redirectLink) {
      return (
        <Redirect to={this.state.redirectLink} />
      );
    }
    return (
      <>
        {this.getStatusUI()}
      </>
    );
  }
}

export default UserResetPasswordPage;