import React, { Component } from 'react';
import {
  Modal,
  notification,
} from "antd";
import { NotificationKeys } from "./utils/keys";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DoubleLeftOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons';

export class CoreUI {
  static _showConfirm = ({
    title = "Are you sure ?",
    message = "Message confirm",
  }) => {
    return new Promise((resole, reject) => {
      Modal.confirm({
        title: title,
        icon: <QuestionCircleOutlined />,
        content: message,
        onOk() {
          resole('OK');
        },
        onCancel() {
          reject('Cancel');
        },
      });
    });
  }

  static fun_showConfirm = async ({
    title = "Bạn có chắc thực hiện hành động này ?",
    message = "Message confirm",
  }) => {
    let ok = true;
    await CoreUI._showConfirm({
      title: title,
      message: message,
    })
      .catch((_e) => {
        ok = false;
      });
    return ok;
  };

  static fun_showNotification = ({
    placement = 'bottomLeft',
    title = null,
    message = 'Message Notification',
    type = NotificationKeys.INFO,
  }) => {
    const key = new Date().getTime();
    switch (type) {
      case NotificationKeys.INFO: {
        notification.info({
          key: key,
          message: <span className='_text-pr fw-bold text-uppercase'>{title || 'Info!'}</span>,
          className: '_bg-body _text-pr',
          closeIcon: <DoubleLeftOutlined className='_text-pr' />,
          icon: <InfoCircleOutlined className='_text-pr' />,
          onClick: () => notification.close(key),
          description: <div>
            <hr className='m-0 p-0' />
            <p className='mt-2 mb-0 _text-pr'>{message}</p>
          </div>,
          placement,
        });
        break;
      }
      case NotificationKeys.SUCCESS: {
        notification.success({
          key: key,
          message: <span className='_text-pr fw-bold text-uppercase'>{title || 'Successfully!'}</span>,
          className: '_text-pr _bg-body',
          closeIcon: <DoubleLeftOutlined className='_text-pr' />,
          icon: <CheckCircleOutlined className='_text-pr' />,
          onClick: () => notification.close(key),
          description: <div>
            <hr className='m-0 p-0' />
            <p className='mt-2 mb-0 _text-pr'>{message}</p>
          </div>,
          placement,
        });
        break;
      }
      case NotificationKeys.WARM: {
        notification.warn({
          key: key,
          message: <span className='_text-pr fw-bold text-uppercase'>{title || 'Warn!'}</span>,
          className: '_text-pr _bg-body',
          closeIcon: <DoubleLeftOutlined className='_text-pr' />,
          icon: <ExclamationCircleOutlined className='_text-pr' />,
          onClick: () => notification.close(key),
          description: <div>
            <hr className='m-0 p-0' />
            <p className='mt-2 mb-0 _text-pr'>{message}</p>
          </div>,
          placement,
        });
        break;
      }
      case NotificationKeys.WARNING: {
        notification.warning({
          key: key,
          message: <span className='_text-pr fw-bold text-uppercase'>{title || 'Warning!'}</span>,
          className: '_text-pr _bg-body',
          closeIcon: <DoubleLeftOutlined className='_text-pr' />,
          icon: <ExclamationCircleOutlined className='_text-pr' />,
          onClick: () => notification.close(key),
          description: <div>
            <hr className='m-0 p-0' />
            <p className='mt-2 mb-0 _text-pr'>{message}</p>
          </div>,
          placement,
        });
        break;
      }
      case NotificationKeys.ERROR: {
        notification.error({
          key: key,
          message: <span className='_text-pr fw-bold text-uppercase'>{title || 'Error!'}</span>,
          className: '_text-pr _bg-body',
          closeIcon: <DoubleLeftOutlined className='_text-pr' />,
          icon: <CloseCircleOutlined className='_text-pr' />,
          onClick: () => notification.close(key),
          description: <div>
            <hr className='m-0 p-0' />
            <p className='mt-2 mb-0 _text-pr'>{message}</p>
          </div>,
          placement,
        });
        break;
      }
      case NotificationKeys.LOADING: {
        notification.info({
          key: key,
          className: '_text-pr _bg-body',
          closeIcon: <DoubleLeftOutlined className='_text-pr' />,
          icon: <RocketOutlined className='_text-pr' />,
          message: <LoadingRaw message={message} />,
          placement,
          duration: 60,
        });
        break;
      }

      default: {
        notification.info({
          key: key,
          message: <span className='_text-pr fw-bold text-uppercase'>{title || 'Info!'}</span>,
          className: '_text-pr _bg-body',
          closeIcon: <DoubleLeftOutlined className='_text-pr' />,
          icon: <InfoCircleOutlined className='_text-pr' />,
          onClick: () => notification.close(key),
          description: <div>
            <hr className='m-0 p-0' />
            <p className='mt-2 mb-0 _text-pr'>{message}</p>
          </div>,
          placement,
        });
        break;
      }
    }

    return key;
  }

  static fun_closeNotificationLoading = (keyLoading) => {
    notification.close(keyLoading);
  }
}

class LoadingRaw extends Component {
  render() {
    return (
      <div className="w-100 text-center m-0 p-0">
        <div className="spinner-border _text-pr" role="status"></div>
        <p className="_text-pr text-uppercase fw-bold m-0 p-0 mt-2">
          {this.props.message}
        </p>
      </div>
    );
  }
}