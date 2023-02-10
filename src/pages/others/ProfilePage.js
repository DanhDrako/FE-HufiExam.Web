import { ManOutlined, QuestionOutlined, WomanOutlined } from '@ant-design/icons';
import { DatePicker, Input, message, Modal, Select } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Apis } from '../../common/utils/Apis';
import { ImageUploadKeys, MessageKeys, NotificationKeys } from '../../common/utils/keys';
import moment from 'moment';
import FACTORY from '../../common/FACTORY';
import HeaderComponent from '../../components/home/header/HeaderComponent';
import FooterComponent from '../../components/home/footer/FooterComponents';
import CropAvatarComponent from '../../components/common/CropAvatarComponent';
import TitleForModel from '../../components/home/header/components/TitleForModel';
import MyImageView from '../../components/common/MyImageView';

// import loadable from '@loadable/component';
// const HeaderComponent = loadable(() => import('../../components/home/header/HeaderComponent'));
// const FooterComponent = loadable(() => import('../../components/home/footer/FooterComponents'));
// const CropAvatarComponent = loadable(() => import('../../components/common/CropAvatarComponent'));
// const TitleForModel = loadable(() => import('../../components/home/header/components/TitleForModel'));

const initialState = {
  user: {},
  isLoading: false,
  isModalVisible: false,
  columnUpdate: null,
  columnUpdateOld: '',
  columnUpdateOld_TypeAny: null,
  isUpdatePass: false,
  avatar: null,
}

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
    };
    this.blobImageAvatar = null;
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadInfo();
  }

  loadInfo() {
    this.setState({ isLoading: true }, async () => {
      const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
      const CoreUI = await FACTORY.GET_CORE_UI();
      PublicModules.fun_get(
        Apis.API_HOST + Apis.API_TAILER.AUTH,
        PublicModules.fun_getConfigBearerDefault({}),
      ).then((dataRes) => {
        // error ?
        if (!dataRes.success) {
          CoreUI.fun_showNotification({
            type: NotificationKeys.ERROR,
            title: 'Tải thông tin bị lỗi',
            message: PublicModules.fun_mapErrorToMessage(dataRes.message),
          });
          this.setState({ isLoading: false });
          return;
        }

        this.setState({
          ...initialState,
          user: dataRes.data,
          avatar: dataRes.data.avatar,
          isLoading: false,
        })
      });
    });
  }

  getPasswordHidden(password) {
    if (!password) return '•••••••••••••••••••';
    let result = '';
    for (let i = 0; i < password.length; i++)
      result += '•';
    return result.length > 20 ? result.substring(0, 20) : result;
  }

  showModal = (column, columnOld, isUpdatePass) => {
    this.setState({
      columnUpdate: column,
      isModalVisible: true,
      columnUpdateOld: columnOld,
      columnUpdateOld_TypeAny: columnOld,
      isUpdatePass: isUpdatePass != null ? isUpdatePass : false,
    });
  };

  handleOk = async () => {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    // isUpdate pass ?
    if (this.state.columnUpdate === 'avatar') {
      if (this.blobImageAvatar == null) {
        message.error('Chưa chọn hình nào hết!');
        return;
      }
      this.setState({ isModalVisible: false, isLoading: true });
      const isUpdate = await PublicModules.fun_uploadAnImageToServer(this.blobImageAvatar.origin, ImageUploadKeys.SERVER);
      // error ?
      if (!isUpdate) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Cập nhật Avatar không thành',
          message: MessageKeys.CHECK_CONNECTION,
        });
        return;
      }
      const objData = `{"avatar": "${isUpdate.fileName}", "avatarUploadType": "${ImageUploadKeys.SERVER}"}`;
      const dataRes = await PublicModules.fun_put(
        Apis.API_HOST + Apis.API_TAILER.USER,
        JSON.parse(objData),
        PublicModules.fun_getConfigBearerDefault({}),
      );
      // error ?
      if (!dataRes.success) {
        message.error(PublicModules.fun_mapErrorToMessage(dataRes.message));
        this.setState({ isLoading: false });
        return;
      }

      CoreUI.fun_showNotification({
        type: NotificationKeys.SUCCESS,
        title: 'Thành công',
        message: 'Đã cập nhật Avatar',
      });
      this.setState({
        ...initialState,
        user: dataRes.data,
        avatar: dataRes.data.avatar,
        isLoading: false,
      });
    }
    else if (this.state.isUpdatePass) {
      let pass = this.state.columnUpdateOld || '';
      let passNew = this.state.tbPassNew || '';
      let passNewRetype = this.state.tbPassNewRetype || '';
      pass = pass.trim();
      passNew = passNew.trim();
      passNewRetype = passNewRetype.trim();
      if (pass === '' || passNew === '' || passNewRetype === '') return;
      if (passNew !== passNewRetype) {
        message.error('Nhập lại mật khẩu không khớp, hãy nhập lại.');
        return;
      }
      this.setState({ isModalVisible: false, isLoading: true });
      const objData = `{"password": "${passNew}", "oldPasswrod": "${pass}"}`;
      const dataRes = await PublicModules.fun_put(
        Apis.API_HOST + Apis.API_TAILER.USER,
        JSON.parse(objData),
        PublicModules.fun_getConfigBearerDefault({}),
      );
      // error ?
      if (!dataRes.success) {
        message.error(PublicModules.fun_mapErrorToMessage(dataRes.message));
        this.setState({ isLoading: false });
        return;
      }

      CoreUI.fun_showNotification({
        type: NotificationKeys.SUCCESS,
        title: 'Thành công',
        message: 'Đã cập nhật mật khẩu',
      });
      this.setState({
        ...initialState,
        user: dataRes.data,
        isLoading: false,
      });
    } else {
      const columnUpdate = this.state.columnUpdate;
      let value = this.state.columnUpdateOld || '';
      if (this.state.columnUpdate === 'birthDay'
        || this.state.columnUpdate === 'sex'
      ) value = this.state.columnUpdateOld_TypeAny;
      else value = value.trim();
      if (!value || value === '') return;
      this.setState({ isModalVisible: false, isLoading: true });
      const objData = `{"${columnUpdate}": "${value}"}`;
      const dataRes = await PublicModules.fun_put(
        Apis.API_HOST + Apis.API_TAILER.USER,
        JSON.parse(objData),
        PublicModules.fun_getConfigBearerDefault({}),
      );
      // error ?
      if (!dataRes.success) {
        message.error(PublicModules.fun_mapErrorToMessage(dataRes.message));
        this.setState({ isLoading: false });
        return;
      }

      CoreUI.fun_showNotification({
        type: NotificationKeys.SUCCESS,
        title: 'Thành công',
        message: 'Đã cập nhật thông tin.',
      });
      this.setState({
        ...initialState,
        user: dataRes.data,
        isLoading: false,
      });
    }
  };

  handleUpdataAvatar(blob) {
    this.blobImageAvatar = blob;
  }

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  tbChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  }

  tbBirthDayChange(e) {
    this.setState({
      columnUpdateOld_TypeAny: e.toDate(),
    })
  }

  tbSexChange(e) {
    this.setState({
      columnUpdateOld_TypeAny: e,
    })
  }

  getUpdatePassOrOtherUI(isUpdatePass) {
    switch (this.state.columnUpdate) {
      case 'birthDay':
        return (
          <DatePicker
            className='form-control'
            onChange={(e) => this.tbBirthDayChange(e)} style={{ width: '100%' }} />
        );
      case 'avatar':
        return (
          <CropAvatarComponent onOk={(blob) => this.handleUpdataAvatar(blob)} />
        );
      case 'sex':
        return (
          <Select onChange={(e) => this.tbSexChange(e)} defaultValue={this.state.columnUpdateOld} style={{ width: '100%' }}>
            <Select.Option key='MALE'>
              <span style={{ margin: '0px 7px 0px 0px' }}><ManOutlined /></span>
              Nam</Select.Option>
            <Select.Option key='FEMALE'>
              <span style={{ margin: '0px 7px 0px 0px' }}><WomanOutlined /></span>
              Nữ</Select.Option>
            <Select.Option key='OTHER'>
              <span style={{ margin: '0px 7px 0px 0px' }}><QuestionOutlined /></span>
              Khác</Select.Option>
          </Select>
        );

      default:
        break;
    }
    if (!isUpdatePass)
      return (
        <Input
          onChange={(e) => this.tbChange(e)}
          name='columnUpdateOld'
          value={this.state.columnUpdateOld}
          type='text' placeholder={'Cập nhật ' + this.state.columnUpdate} />
      );
    return (
      <>
        <Input.Password
          onChange={(e) => this.tbChange(e)}
          name='columnUpdateOld'
          value={this.state.columnUpdateOld}
          addonAfter='MK Cũ'
          type='password' className='mb-2' placeholder='Mật khẩu củ' />
        <Input
          onChange={(e) => this.tbChange(e)}
          name='tbPassNew'
          addonAfter='MK Mới'
          type='password' className='mb-2' placeholder='Mật khẩu mới' />
        <Input.Password
          onChange={(e) => this.tbChange(e)}
          name='tbPassNewRetype'
          addonAfter='Nhập lại Mới'
          type='password' className='mb-2' placeholder='Nhập lại MK mới' />
      </>
    );
  }

  getBirthDayUI(birthDay) {
    if (birthDay)
      return moment(birthDay).calendar();
    return 'Chưa có';
  }

  render() {
    return (
      <>
        {FACTORY.fun_getGl_loading(this.state.isLoading)}
        <HeaderComponent />
        <Modal
          title={<TitleForModel text={'Cập nhật ' + this.state.columnUpdate} />}
          visible={this.state.isModalVisible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}>
          {this.getUpdatePassOrOtherUI(this.state.isUpdatePass)}
        </Modal>
        <div className='container'>
          <div className="profile">
            <div className="profile__text1 fw-bold text-uppercase">Thông tin cá nhân</div>
            <div className="profile__text">Thông tin cơ bản, như tên và ảnh của bạn, mà bạn sử dụng trên các dịch vụ của My hufier</div>
            <div className="profile__header">
              <div className="profile__header-list">
                <div className="profile__header--headding">
                  <h2 className="profile__header--headding-item1">Thông tin cơ bản</h2>
                  <div className="profile__header--headding-item2">Một số thông tin có thể hiện thị cho những người khác đang sử dụng My hufier.

                    <Link to="/rule" className="profile__header--headding-item3"> Tìm hiểu thêm</Link>
                  </div>
                </div>
                <div onClick={() => this.showModal('avatar', this.state.user.avatar)} className="profile_container profile_container-img">
                  <ul className="profile_container-list">
                    <li className="profile_container-item profile_container-item-- font-frofile">ẢNH</li>
                    <li className="profile_container-item">Một bức ảnh giúp cá nhân hóa tài khoản của bạn</li>
                  </ul>
                  <ul className="profile_container-list">
                    <li className="profile_container-item">
                      <MyImageView
                        src={FACTORY.fun_getAvatarImageView(this.state.avatar, this.state.user.avatarUploadType)} className="author-img--" alt="logo author" />
                    </li>
                  </ul>
                </div>
                <div onClick={() => this.showModal('username', this.state.user.username)} className="profile_container">
                  <ul className="profile_container-list">
                    <li className="profile_container-item profile_container-item-- font-frofile ">USER NAME</li>
                    <li className="profile_container-item">
                      {this.state.user.username}
                    </li>
                  </ul>
                  <ul className="profile_container-list">
                    <li className="profile_container-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </li>
                  </ul>
                </div>
                <div onClick={() => this.showModal('displayName', this.state.user.displayName)} className="profile_container">
                  <ul className="profile_container-list">
                    <li className="profile_container-item profile_container-item--  font-frofile">TÊN HIỂN THỊ</li>
                    <li className="profile_container-item">
                      {this.state.user.displayName || 'Chưa có'}
                    </li>
                  </ul>
                  <ul className="profile_container-list">
                    <li className="profile_container-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </li>
                  </ul>
                </div>
                <div onClick={() => this.showModal('birthDay', this.state.user.birthDay)} className="profile_container">
                  <ul className="profile_container-list">
                    <li className="profile_container-item profile_container-item--  font-frofile">NGÀY SINH</li>
                    <li className="profile_container-item">
                      {this.getBirthDayUI(this.state.user.birthDay)}
                    </li>
                  </ul>
                  <ul className="profile_container-list">
                    <li className="profile_container-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </li>
                  </ul>
                </div>
                <div onClick={() => this.showModal('sex', this.state.user.sex)} className="profile_container">
                  <ul className="profile_container-list">
                    <li className="profile_container-item profile_container-item--  font-frofile">GIỚI TÍNH</li>
                    <li className="profile_container-item">{
                      this.state.user.sex || 'Chưa có'
                    }</li>
                  </ul>
                  <ul className="profile_container-list">
                    <li className="profile_container-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </li>
                  </ul>
                </div>
                <div onClick={() => this.showModal('password', this.state.user.password, true)} className="profile_container">
                  <ul className="profile_container-list">
                    <li className="profile_container-item profile_container-item-- font-frofile ">MẬT KHẨU</li>
                    <li className="profile_container-item">
                      <ul className="profile_container-item-pass">
                        <li>
                          {this.getPasswordHidden(this.state.user.password)}
                        </li>
                        <li className="profile__text profile__text-pass ">Thay đổi lần gần đây nhất:
                          <span style={{ margin: '0px 0px 0px 7px' }} className='fw-bold'>{moment(this.state.user.updateAt).fromNow()}</span>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <ul className="profile_container-list">
                    <li className="profile_container-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="profile__header profile__header-- ">
              <div className="profile__header-list">
                <div className="profile__header--headding">
                  <h2 className="profile__header--headding-item1">Thông tin liên hệ</h2>
                </div>
                <div onClick={() => message.info('Không đổi được!')} className="profile_container">
                  <ul className="profile_container-list">
                    <li className="profile_container-item profile_container-item-- font-frofile ">EMAIL</li>
                    <li className="profile_container-item">
                      {this.state.user.email}
                    </li>
                  </ul>
                  <ul className="profile_container-list">
                    <li className="profile_container-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </li>
                  </ul>
                </div>
                <div onClick={() => this.showModal('phone', this.state.user.phone)} className="profile_container">
                  <ul className="profile_container-list">
                    <li className="profile_container-item profile_container-item-- font-frofile ">ĐIỆN THOẠI</li>
                    <li className="profile_container-item">
                      {this.state.user.phone || 'Chưa có'}
                    </li>
                  </ul>
                  <ul className="profile_container-list">
                    <li className="profile_container-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </li>
                  </ul>
                </div>
                <div onClick={() => this.showModal('linkFacebook', this.state.user.linkFacebook)} className="profile_container">
                  <ul className="profile_container-list">
                    <li className="profile_container-item profile_container-item-- font-frofile ">Link Facebook</li>
                    <li className="profile_container-item">
                      {this.state.user.linkFacebook || 'Chưa có'}
                    </li>
                  </ul>
                  <ul className="profile_container-list">
                    <li className="profile_container-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent />
      </>
    );
  }
}

export default ProfilePage;