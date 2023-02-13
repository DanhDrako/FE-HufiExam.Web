import React from "react";
import { Modal, Slider, Switch, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { Form, Input, Checkbox } from "antd";
import { Apis } from "../../../../common/utils/Apis";
import { NotificationKeys } from "../../../../common/utils/keys";
import { GaurdEntity, UserLoginEntity } from "../../../../common/entities";
import { ActionType } from "../../../../common/utils/actions-type";
import {} from "@ant-design/icons";
import FACTORY from "../../../../common/FACTORY";
import TitleForModel from "./TitleForModel";
import ButtonForgotPassComponent from "./ButtonForgotPassComponent";

// import loadable from '@loadable/component';
// const TitleForModel = loadable(() => import('./TitleForModel'));
// const ButtonForgotPassComponent = loadable(() => import('./ButtonForgotPassComponent'));

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const ButtonLoginComponent = (_props) => {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isAcessRule, setIsAcessRule] = React.useState(false);
  const [isAccessRuleNumber, setIsAccessRuleNumber] = React.useState(-1);
  const [isAccessRuleNumberUserChoose, setIsAccessRuleNumberUserChoose] =
    React.useState(-1);
  const [isAccessRuleCount, setIsAccessRuleCount] = React.useState(0);

  const dispatch = useDispatch();

  const tbChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "tbEmail") setUserName(value);
    else if (name === "tbPassword") setPassword(value);
  };

  const showModal = () => {
    setVisible(true);
  };

  //set login 
  const linkLogin = String(process.env.REACT_APP_IS_DISABLE_SOCIAL_LINK_ACOUNT).toLowerCase();

  const callApiLogin = async () => {
    const CoreUI = await FACTORY.GET_CORE_UI();
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    // check isAccessRobot
    if (!isAcessRule) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: "Bạn chưa đồng ý với điều khoản",
        message:
          "Hãy đồng ý với điều khoản của trang web và tiếp tục tác vụ! Thank ^^",
      });
      return;
    }

    // check count try again
    if (isAccessRuleCount === 3) {
      await CoreUI.fun_showConfirm({
        title: "Đã quá mức lượt thử lại",
        message:
          "Chỉ cho phép sai quá 3 lần thôi nhé, lần sau bạn cố gắng lên: Fitting...",
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
        title: "Thanh trược không khớp !",
        message: `Làm ơn hãy kéo thanh trược khớp với số  ${newNumber} đã hiển thị, Thank ^^`,
      });
      return;
    }

    setConfirmLoading(true);
    // login from db
    const dataRes = await PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.AUTH,
      {
        email: userName,
        password: password,
      }
    );
    // error ?
    if (!dataRes.success) {
      // setVisible(false);
      setConfirmLoading(false);
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: "Đăng nhập thất bại",
        message: "Sai tên đăng nhập hoặc mật khẩu",
      });
      return false;
    }

    // setVisible(false);
    setConfirmLoading(false);
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
      title: "Đăng nhập thành công",
      message: `Chào mừng bạn đến với ${process.env.REACT_APP_APP_NAME}`,
    });

    // dispatch state
    dispatch({
      type: ActionType.USER_LOGIN,
      user: {
        ...dataRes.data.user,
        ...user,
      },
    });

    return true;
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const getAccessNotRobotUI = () => {
    if (!isAcessRule) return;
    return (
      <>
        <p className="fw-bold text-uppercase mb-8">
          Kéo thang trược tới mức:
          <span className="_text-sec">&nbsp;[ {isAccessRuleNumber} ]</span>
        </p>
        <Slider
          onChange={(e) => setIsAccessRuleNumberUserChoose(e)}
          defaultValue={0}
        />
      </>
    );
  };

  const accessRuleChange = (e) => {
    if (e) {
      setIsAcessRule(e);
      setIsAccessRuleNumber(FACTORY.fun_random1To100());
    } else {
      setIsAcessRule(e);
      setIsAccessRuleNumber(-1);
    }
  };

  const btnLoginWithClicked = async (e) => {
    if (linkLogin === "on")
    {
      e.preventDefault();
      return;
    }
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (String(process.env.REACT_APP_DEBUG_MODE).toLowerCase() === "true") {
      CoreUI.fun_showNotification({
        type: NotificationKeys.INFO,
        title: "Không khả dụng!",
        message: "Hãy đi đến trang web: www.myhufier.com",
      });
      e.preventDefault();
      return;
    }
  };

  return (
    <>
      <button
        id="btnLogin"
        onClick={showModal}
        type="button"
        className="btn-ds outline-pr me-2 m-1"
      >
        Đăng Nhập
      </button>
      <Modal
        title={<TitleForModel text="Đăng nhập vào ứng dụng" />}
        visible={visible}
        onOk={callApiLogin}
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
            label="Email"
            name="tbEmail"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input
              className="form-control"
              name="tbEmail"
              onChange={tbChange}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              className="form-control _bg-body"
              name="tbPassword"
              onChange={tbChange}
            />
          </Form.Item>
          <div style={{ textAlign: "right" }}>
            <ButtonForgotPassComponent />
          </div>

          {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}
        </Form>
        {/* <div className="row mb-4">
          <div className="col-6" style={{ textAlign: "right" }}>
            <a
              onClick={(e) => btnLoginWithClicked(e)}
              href={linkLogin === "off" ? Apis.API_HOST + Apis.API_TAILER.AUTH_FACEBOOK : ""}
              disabled={linkLogin === "off" ? false : true}
            >
              <Tooltip
                placement="topLeft"
                title={linkLogin === "on" ? "Tính năng đã bị đóng" : ""}
                color={FACTORY.TOOLTIP_COLOR}
              >
                <button className={linkLogin === "off" ? "btn-ds outline-pr" : "btn-ds outline"}>
                  <i className="fab fa-facebook-square"></i> Đ.Nhập Bằng
                  facebook
                </button>
              </Tooltip>
            </a>
          </div>
          <div className="col-6" style={{ textAlign: "left" }}>
            <a
              onClick={(e) => btnLoginWithClicked(e)}
              href={linkLogin === "off" ? Apis.API_HOST + Apis.API_TAILER.AUTH_GOOGLE : ""}
              disabled={linkLogin === "off" ? false : true}
            >
              <Tooltip
                placement="topLeft"
                title={linkLogin === "on" ? "Tính năng đã bị đóng" : ""}
                color={FACTORY.TOOLTIP_COLOR}
              > 
                <button className={linkLogin === "off" ? "btn-ds outline-sec" : "btn-ds outline"}>
                  <i className="fab fa-google-plus-square"></i> Đ.Nhập Bằng
                  Google
                </button>
              </Tooltip>
            </a>
          </div>
        </div> */}
        <div className="m-2 p-2 mt-0 pt-0 mb-0">
          <Switch
            name="isAccessRule"
            onChange={(e) => accessRuleChange(e)}
            checkedChildren="Cám ơn"
            unCheckedChildren="Tôi!... Đồng ý với điều khoản"
          />
        </div>
        <div className="m-2 p-2 mt-0 pt-0 mb-0">{getAccessNotRobotUI()}</div>
      </Modal>
    </>
  );
};

export default ButtonLoginComponent;
