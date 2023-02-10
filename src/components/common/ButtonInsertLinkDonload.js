import React, { useState } from 'react';
import { Modal, Tooltip, Input } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { NotificationKeys } from '../../common/utils/keys';
import FACTORY from '../../common/FACTORY';
import TitleForModel from '../home/header/components/TitleForModel';

// import loadable from '@loadable/component';
// const TitleForModel = loadable(() => import('../home/header/components/TitleForModel'));

const ButtonInsertLinkDownload = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputs, setInputs] = useState({});

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (!inputs['title'] || inputs['title'] === ''
      || !inputs['link'] || inputs['link'] === ''
    ) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Không hợp lệ',
        message: 'Dữ liệu nhập không hợp lệ, hãy thử lại.'
      });
      return;
    }
    props.onOk({
      title: inputs['title'],
      link: inputs['link'],
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onTbChange = (e) => {
    const name = e.target.name;
    const value = e.target.value.trim();
    setInputs({ ...inputs, [name]: value });
  }

  return (
    <>
      <Tooltip color={FACTORY.TOOLTIP_COLOR} title='Là người cống hiến, bạn cần phải thêm link download'>
        <button
          className='btn-ds outline-pr block'
          onClick={showModal} >
          <PlusCircleOutlined /> Thêm Link Download
        </button>
      </Tooltip>
      <Modal title={<TitleForModel text="Thêm Link Download" />} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p><Input name='title'
          autoComplete='off'
          onChange={onTbChange} placeholder="Tên hiển thị" /></p>
        <p><Input name='link' onChange={onTbChange}
          autoComplete='off'
          placeholder="Link (URL Download)" /></p>
      </Modal>
    </>
  );
};

export default ButtonInsertLinkDownload;