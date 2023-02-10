import React, { useEffect, useState } from 'react';
import { Modal, Button, Tooltip, Input, message } from 'antd';
import { PlusCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { ImageUploadKeys, NotificationKeys } from '../../../../../common/utils/keys';
import { Apis } from '../../../../../common/utils/Apis';
import RoleUser from '../../../../../common/utils/keys/RoleUserKey';
import FACTORY from '../../../../../common/FACTORY';
import TitleForModel from '../../../../home/header/components/TitleForModel';

// import loadable from '@loadable/component';
// const TitleForModel = loadable(() => import('../../../../home/header/components/TitleForModel'));

const ButtonAddNewCategoryComponent = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageBanner, setImageBanner] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOnEdit, setIsOnEdit] = useState(false);

  const showModal = () => {
    // mem ? -> ignore
    const user = FACTORY.fun_getUserLoginLocalStorage();
    if (!user || user.role !== RoleUser.ADMIN) {
      message.info('Bạn chưa đủ điền kiện để mở khóa tính năng này.');
      return;
    }

    if (!isOnEdit) {
      setName(null);
      setImageBanner(null);
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (!name || name === ''
      || (!imageBanner && !isOnEdit)
    ) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Không hợp lệ',
        message: 'Dữ liệu nhập không hợp lệ, hãy thử lại.'
      });
      return;
    }
    setLoading(true);
    // call api upload image;
    let imageBannerUrl = null;
    if (isOnEdit && !imageBanner) {
      imageBannerUrl = props.onEdit.imageBanner;
    } else {
      const isUploaded = await PublicModules.fun_uploadAnImageToServer(imageBanner.origin, ImageUploadKeys.SERVER);
      if (!isUploaded) { setLoading(false); return };
      imageBannerUrl = isUploaded.fileName;
    }
    // call api inser new cate
    let dataRes = null;
    if (!isOnEdit) {
      dataRes = await PublicModules.fun_post(
        Apis.API_HOST + Apis.API_TAILER.CATE,
        {
          "name": name,
          "imageBanner": imageBannerUrl,
          "imageUploadType": ImageUploadKeys.SERVER,
          "isBlackMarket": props.isBlackMarket || false,
        },
        PublicModules.fun_getConfigBearerDefault({}),
      );
    } else {
      dataRes = await PublicModules.fun_put(
        Apis.API_HOST + Apis.API_TAILER.CATE + props.onEdit.id,
        {
          "name": name,
          "imageBanner": imageBannerUrl,
          "imageUploadType": ImageUploadKeys.SERVER,
          "isBlackMarket": props.isBlackMarket || false,
        },
        PublicModules.fun_getConfigBearerDefault({}),
      );
    }
    if (!dataRes.success) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Không thành công!',
        message: PublicModules.fun_mapErrorToMessage(dataRes.message),
      });
      setLoading(false);
      return;
    }

    setLoading(false);
    // success
    setIsModalVisible(false);
    CoreUI.fun_showNotification({
      type: NotificationKeys.SUCCESS,
      title: 'Thao tác thành công',
      message: `Thao tác thể loại [ ${name} ] thành công.`,
    });
    setIsOnEdit(false);
  };

  const handleCancel = () => {
    setIsOnEdit(false);
    setIsModalVisible(false);
  };

  const onTbChange = (e) => {
    FACTORY.GET_PUBLIC_MODULES().then((PublicModules) => {
      const name = e.target.name;
      const value = e.target;
      if (name === 'imageBanner') {
        const file = value.files[0];
        if (!file) return;
        PublicModules.fun_resizeImage(file).then((resize) => {
          setImageBanner(resize);
        });
      } else {
        setName(value.value);
      }
    });
  }

  const getImageView = () => {
    if (imageBanner)
      return (
        <div className='text-center'>
          <img className='w-50' src={imageBanner.base64} alt='Preview' />
        </div>
      );
  }

  const onRefresh = () => {
    if (!props.onRefresh) return;
    props.onRefresh().then((_) => {
      message.success('Cates loaded!');
    });
  }

  useEffect(() => {
    if (!props.onEdit) return;
    const data = props.onEdit;
    setName(data.name);
    setImageBanner(null);
    setIsModalVisible(true);
    setIsOnEdit(true);
  }, [props.onEdit]);

  const getButtonStyled = () => {
    if (props.styled)
      return (
        <>
          <Tooltip color={FACTORY.TOOLTIP_COLOR} title='thêm nhanh thể loại'>
            <Button className='mb-2' onClick={showModal} icon={<PlusCircleOutlined />} type='link' >
              Thêm thể loại
            </Button>
          </Tooltip>
          <Tooltip className='m-2' color={FACTORY.TOOLTIP_COLOR} title='Làm mới sau khi thêm'>
            <Button className='mb-2' onClick={() => onRefresh()} icon={<RedoOutlined />} type='link' >
              Làm tươi
            </Button>
          </Tooltip>
        </>
      );
    return (
      <>
        <Tooltip color={FACTORY.TOOLTIP_COLOR} title='thêm nhanh thể loại'>
          <button
            className='btn-ds outline-pr'
            onClick={showModal} >
            <PlusCircleOutlined /> Thêm thể loại
        </button>
        </Tooltip>
        <Tooltip className='m-2' color={FACTORY.TOOLTIP_COLOR} title='Làm mới sau khi thêm'>
          <button
            className='btn-ds outline-sec'
            onClick={() => onRefresh()}>
            <RedoOutlined /> Làm tươi
        </button>
        </Tooltip>
      </>
    );
  }

  return (
    <>
      {getButtonStyled()}
      <Modal
        confirmLoading={loading}
        title={<TitleForModel text={isOnEdit ? "Sửa category" : "Thêm categories"} />} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p><Input
          className='form-control'
          name='name'
          autoComplete='off'
          onChange={(e) => onTbChange(e)}
          placeholder="Tên category" /></p>
        <p><Input
          className='form-control'
          accept=".jpg, .png, .jpeg"
          type='file' name='imageBanner' onChange={(e) => onTbChange(e)} /></p>
        {getImageView()}
      </Modal>
    </>
  );
};

export default ButtonAddNewCategoryComponent;