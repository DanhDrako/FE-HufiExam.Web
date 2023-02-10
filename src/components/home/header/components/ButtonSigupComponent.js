import React from 'react';
import { Modal, Slider, Switch } from 'antd';
import { Form, Input, } from 'antd';
import { Apis } from '../../../../common/utils/Apis';
import { NotificationKeys } from '../../../../common/utils/keys';
import FACTORY from '../../../../common/FACTORY';
import TitleForModel from './TitleForModel';

// import loadable from '@loadable/component';
// const TitleForModel = loadable(() => import('./TitleForModel'));

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const ButtonSigupComponent = (_props) => {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [isAcessRule, setIsAcessRule] = React.useState(false);
  const [isAccessRuleNumber, setIsAccessRuleNumber] = React.useState(-1);
  const [isAccessRuleNumberUserChoose, setIsAccessRuleNumberUserChoose] = React.useState(-1);
  const [isAccessRuleCount, setIsAccessRuleCount] = React.useState(0);
  const [inputs, setInputs] = React.useState({});
  const [isSuccess, setIsSuccess] = React.useState(false);

  const tbChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs({ ...inputs, [name]: value });
  }

  const showModal = () => {
    setVisible(true);
  };

  const callApiSigup = async () => {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    // check isAccessRobot
    if (!isAcessRule) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Bạn chưa đồng ý với điều khoản',
        message: 'Hãy đồng ý với điều khoản của trang web và tiếp tục tác vụ! Thank ^^'
      });
      return;
    }

    // check count try again
    if (isAccessRuleCount === 3) {
      await CoreUI.fun_showConfirm({
        title: 'Đã quá mức lượt thử lại',
        message: 'Chỉ cho phép sai quá 3 lần thôi nhé, lần sau bạn cố gắng lên: Fitting...',
      });
      setVisible(false);
      setIsAccessRuleCount(0);
      return;
    }

    // check access not robot.
    if (isAccessRuleNumber !== isAccessRuleNumberUserChoose) {
      const newNumber = FACTORY.fun_random1To100();
      setIsAccessRuleNumber(newNumber);
      setIsAccessRuleCount(isAccessRuleCount + 1);
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Thanh trược không khớp !',
        message: `Làm ơn hãy kéo thanh trược khớp với số  ${newNumber} đã hiển thị, Thank ^^`
      });
      return;
    }

    const email = inputs['tbEmail'];
    if (!email || email === '' || !email.includes('@')) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Email chưa nhập, hoặc đã nhập sai !',
        message: `Hãy nhập địa chỉ email, để kích hoạt tài khoản.`
      });
      return;
    }

    const userName = inputs['tbUserName'];
    if (!userName || userName === '') {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'User Name chưa nhập !',
        message: `User Name là trường bắt buộc không để trống.`
      });
      return;
    }

    const pass = inputs['tbPassword'];
    if (!pass || pass === '') {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Mật khẩu chưa nhập !',
        message: `Mật khẩu là trường bắt buộc không để trống.`
      });
      return;
    }

    const retypePass = inputs['tbRetypePass'];
    if (!retypePass || retypePass === '') {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Xác nhận mật khẩu chưa nhập !',
        message: `Xác nhận mật khẩu là trường bắt buộc không để trống.`
      });
      return;
    }

    const isCompare = pass === retypePass;
    if (!isCompare) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Mật khẩu không khớp !',
        message: `Nhập lại mật khẩu của bạn và đảm bảo nó khớp.`
      });
      return;
    }

    setConfirmLoading(true);
    // login from db
    const dataRes = await PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.USER,
      {
        "username": userName,
        "email": email,
        "displayName": inputs['tbDisplayName'],
        "password": pass,
      }
    )
    // error ?
    if (!dataRes.success) {
      setConfirmLoading(false);
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Đăng ký không thành công!',
        message: PublicModules.fun_mapErrorToMessage(dataRes.message),
      });
      return;
    }
    setIsSuccess(true);
    CoreUI.fun_showNotification({
      type: NotificationKeys.SUCCESS,
      title: 'Đăng ký thành công. chờ xác nhận',
      message: 'Đã đăng ký thành công, hãy xác nhận qua hộp thư gmail nhé.'
    });
  };

  const handleCancel = async () => {
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (!isSuccess) {
      setVisible(false);
      return;
    }
    const ok = await CoreUI.fun_showConfirm({
      title: 'Hãy nhớ kích hoạt tài khoản ở hộp thư gmail.',
      message: 'Từ từ, từ từ. Một link kích hoạt tài khoản đã gởi đến địa chỉ gmail của bạn, hãy kích hoạt để đăng nhập vào hệ thống, thời hạn kích hoạt trong vòng 24h đồng hồ.',
    });
    if (!ok) return;
    setVisible(false);
  };

  const getAccessNotRobotUI = () => {
    if (!isAcessRule) return;
    return (
      <>
        <p className='fw-bold text-uppercase mb-8'>Kéo thang trược tới mức:
        <span className='_text-sec'>
            &nbsp;[ {isAccessRuleNumber} ]
          </span>
        </p>
        <Slider onChange={(e) => setIsAccessRuleNumberUserChoose(e)} defaultValue={0} />
      </>
    );
  }

  const accessRuleChange = (e) => {
    if (e) {
      setIsAcessRule(e);
      setIsAccessRuleNumber(FACTORY.fun_random1To100());
    } else {
      setIsAcessRule(e);
      setIsAccessRuleNumber(-1);
    }
  }

  const getIsSuccessUI = () => {
    if (isSuccess)
      return (
        <div className='m-2 p-2 mt-0 pt-0'>
          <p style={{ textAlign: 'justify' }} className='text-uppercase text-danger fw-bold'>Hãy nhớ kích hoạt tài khoản ở hộp thư gmail</p>
          <div className="spinner-grow spinner-grow-sm text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ textAlign: 'justify' }} className='text-success'><span className='text-uppercase fw-bold text-danger'>message: </span>
          'Từ từ, từ từ. Một link kích hoạt tài khoản đã gởi đến địa chỉ gmail của bạn, hãy kích hoạt để đăng nhập vào hệ thống, thời hạn kích hoạt trong vòng
          <span className='text-uppercase fw-bold text-danger'>&nbsp;24h đồng hồ.</span>
          </p>
          <p className='text-center m-0'>* * * * *</p>
          <p className='text-info text-uppercase fw-bold text-center'>Nếu không thấy thư hãy tìm trong thư mục SPAM nhé. THANKs</p>
        </div>
      );
  }

  return (
    <>
      <button onClick={showModal} type="button" className="btn-ds outline-sec m-1">Đăng Ký</button>
      <Modal
        title={<TitleForModel text='Đăng ký tài khoản' />}
        visible={visible}
        onOk={callApiSigup}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          {...layout}
          name="basic"
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            label="Đại chỉ email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input name="tbEmail"
              autoComplete='off'
              onChange={tbChange} />
          </Form.Item>

          <Form.Item
            label="User Name"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input name="tbUserName"
              autoComplete='off'
              onChange={tbChange} />
          </Form.Item>

          <Form.Item
            label="Tên hiển thị"
            name="displayName"
          >
            <Input name="tbDisplayName"
              autoComplete='off'
              onChange={tbChange} />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password
              autoComplete='off'
              className='form-control' name="tbPassword" onChange={tbChange} />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="retypePass"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password
              autoComplete='off'
              className='form-control' name="tbRetypePass" onChange={tbChange} />
          </Form.Item>

        </Form>
        <div className='row mb-3'>
          <div className='col-6' style={{ textAlign: 'right' }}>
            <a href={Apis.API_HOST + Apis.API_TAILER.AUTH_FACEBOOK}>
              <button className='btn-ds outline-pr'>
                <i className="fab fa-facebook-square"></i> Đ.Nhập Bằng facebook
              </button>
            </a>
          </div>
          <div className='col-6' style={{ textAlign: 'left' }}>
            <a href={Apis.API_HOST + Apis.API_TAILER.AUTH_GOOGLE} >
              <button className='btn-ds outline-sec'>
                <i className="fab fa-google-plus-square"></i> Đ.Nhập Bằng Google
              </button>
            </a>
          </div>
        </div>
        <div className='m-2 p-2 mt-0 pt-0'>
          <Switch name='isAccessRule' onChange={(e) => accessRuleChange(e)} checkedChildren="Cám ơn" unCheckedChildren="Tôi!... Đồng ý với điều khoản" />
        </div>
        <div className='m-2 p-2 mt-0 pt-0'>
          {getAccessNotRobotUI()}
        </div>
        {getIsSuccessUI()}
      </Modal>
    </>
  );
};

export default ButtonSigupComponent;