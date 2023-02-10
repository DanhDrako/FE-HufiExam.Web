import { Button, Result, Skeleton } from 'antd';
import React, { Component } from 'react';
import { Apis } from '../../common/utils/Apis';
import { Typography } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router';
import FACTORY from '../../common/FACTORY';

class UserActivePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.match.params.token,
      status: 'LOADING',
      redirectLink: null,
    }
  }

  async componentDidMount() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const token = this.state.token;
    PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.USER_ACTIVE + token,
    ).then((dataRes) => {
      if (!dataRes.success)
        this.setState({
          status: 'ERROR',
        });
      else
        this.setState({
          status: 'SUCCESS',
        });
    });
  }

  btnGoTo(value) {
    this.setState({
      redirectLink: value,
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
          <Skeleton active />
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

export default UserActivePage;