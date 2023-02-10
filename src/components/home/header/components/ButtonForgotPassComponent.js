import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { FrownOutlined, MailOutlined } from '@ant-design/icons';
import { NotificationKeys } from '../../../../common/utils/keys';
import { Apis } from '../../../../common/utils/Apis';
import FACTORY from '../../../../common/FACTORY';
import TitleForModel from './TitleForModel';

// import loadable from '@loadable/component';
// const TitleForModel = loadable(() => import('./TitleForModel'));

const ButtonForgotPassComponent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const getIsSuccessUI = () => {
    if (isSuccess)
      return (
        <div className='m-2 p-2 mt-0 pt-0 mt-3'>
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
    return (
      <div className='m-2 p-2 mt-0 pt-0'>
        <p style={{ textAlign: 'justify' }} className='mt-3'>
          <span className='text-uppercase fw-bold text-primary'>
            Chúng tôi </span>
           sẽ
          <span className='text-uppercase fw-bold text-danger'> gởi link khôi phục </span>
           mật khẩu cho bạn qua
           <span className='text-uppercase fw-bold text-danger'> địa chỉ email </span>
            trước đây bạn đăng ký.</p>
      </div>
    );
  }

  const handleOk = async () => {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (!email || email === '' || !email.includes('@')) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Email không hợp lệ.',
        message: 'Hãy nhập một địa chỉ email hợp lệ.',
      });
      return;
    }

    setConfirmLoading(true);
    // call api reset pass
    const dataRes = await PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.RESET_PASSWORD + email,
    );
    // error ?
    if (!dataRes.success) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Không thành công!',
        message: PublicModules.fun_mapErrorToMessage(dataRes.message),
      });
      setConfirmLoading(false);
      return;
    }

    // success
    setIsSuccess(true);
  };

  const handleCancel = async () => {
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (isSuccess) {
      const ok = await CoreUI.fun_showConfirm({
        title: 'Hãy nhớ kích hoạt tài khoản ở hộp thư gmail.',
        message: 'Từ từ, từ từ. Một link kích hoạt tài khoản đã gởi đến địa chỉ gmail của bạn, hãy kích hoạt để đăng nhập vào hệ thống, thời hạn kích hoạt trong vòng 24h đồng hồ.',
      });
      if (!ok) return;
    }

    // setConfirmLoading(false);
    setIsModalVisible(false);
  };

  const tbChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  }

  return (
    <>
      <span className='m-0 p-0' role='link' onClick={showModal} type='link'>
        <FrownOutlined /> Quên mật khẩu.
      </span>
      <Modal
        confirmLoading={confirmLoading}
        title={<TitleForModel text='Khôi phục mật khẩu' />}
        visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input onChange={(e) => tbChange(e)} size="large" placeholder="Nhập địa chỉ Email" prefix={<MailOutlined />} />
        {getIsSuccessUI()}
      </Modal>
    </>
  );
};

export default ButtonForgotPassComponent;