import React, { useEffect, useState } from 'react';
import { Modal, Button, Tooltip, Input, message } from 'antd';
import { PlusCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { NotificationKeys } from '../../../../../common/utils/keys';
import { Apis } from '../../../../../common/utils/Apis';
import RoleUser from '../../../../../common/utils/keys/RoleUserKey';
import FACTORY from '../../../../../common/FACTORY';
import TitleForModel from '../../../../home/header/components/TitleForModel';

// import loadable from '@loadable/component';
// const TitleForModel = loadable(() => import('../../../../home/header/components/TitleForModel'));

const ButtonAddNewTagsComponent = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
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
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (!name || name === '') {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Không hợp lệ',
        message: 'Dữ liệu nhập không hợp lệ, hãy thử lại.'
      });
      return;
    }
    setLoading(true);

    // call api insert new tags
    let dataRes = null;
    if (!isOnEdit) {
      dataRes = await PublicModules.fun_post(
        Apis.API_HOST + Apis.API_TAILER.TAG_NAME,
        {
          "name": name,
          "isBlackMarket": props.isBlackMarket || false,
        },
        PublicModules.fun_getConfigBearerDefault({}),
      );
    } else {
      dataRes = await PublicModules.fun_put(
        Apis.API_HOST + Apis.API_TAILER.TAG_NAME + props.onEdit.id,
        {
          "name": name,
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

  const onTbChange = async (e) => {
    const value = e.target;

    setName(value.value);
  }

  const onRefresh = () => {
    if (!props.onRefresh) return;
    props.onRefresh().then((_) => {
      message.success('tags loaded!');
    });
  }

  useEffect(() => {
    if (!props.onEdit) return;
    const data = props.onEdit;
    setName(data.name);
    setIsModalVisible(true);
    setIsOnEdit(true);
  }, [props.onEdit]);

  const getButtonStyled = () => {
    if (props.styled)
      return (
        <>
          <Tooltip color={FACTORY.TOOLTIP_COLOR} title='thêm nhanh thẻ'>
            <Button className='mb-2' onClick={showModal} icon={<PlusCircleOutlined />} type='link' >
              Thêm thẻ
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
        <Tooltip color={FACTORY.TOOLTIP_COLOR} title='thêm nhanh thẻ'>
          <button
            className='btn-ds outline-pr'
            onClick={showModal}>
            <PlusCircleOutlined /> Thêm thẻ
        </button>
        </Tooltip>
        <Tooltip className='m-2' color={FACTORY.TOOLTIP_COLOR} title='Làm mới sau khi thêm'>
          <button
            className='btn-ds outline-sec'
            onClick={() => onRefresh()} >
            <RedoOutlined /> Làm tươi
        </button>
        </Tooltip>
      </>
    );
  };

  return (
    <>
      {getButtonStyled()}
      <Modal
        confirmLoading={loading}
        title={<TitleForModel text={isOnEdit ? "Sửa thẻ" : "Thêm thẻ"} />} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p><Input
          autoComplete='off'
          className='form-control'
          value={name} name='name' onChange={onTbChange} placeholder="Tên thẻ" /></p>
      </Modal>
    </>
  );
};

export default ButtonAddNewTagsComponent;