import React, { Component } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  Radio,
  Select,
  Tag,
  Tooltip,
} from "antd";
import { Table } from "antd";
import { Apis } from "../../../../common/utils/Apis";
import {
  ImageUploadKeys,
  MessageKeys,
  NotificationKeys,
} from "../../../../common/utils/keys";
import { connect } from "react-redux";
import {
  ActionType,
  AdminRouterType,
} from "../../../../common/utils/actions-type";
import {
  CheckCircleOutlined,
  DeleteTwoTone,
  EditTwoTone,
  RedoOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import RoleUser from "../../../../common/utils/keys/RoleUserKey";
import FACTORY from "../../../../common/FACTORY";
import { PublicModules } from "../../../../common/PublicModules";
import { CoreUI } from "../../../../common/CoreUI";
import PagingComponent from "../../../common/PagingComponent";
import MyImageView from "../../../common/MyImageView";

// import loadable from '@loadable/component';
// const PagingComponent = loadable(() => import('../../../common/PagingComponent'));
// const MyImageView = loadable(() => import('../../../common/MyImageView'));

class AllPostComponent extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    this.user = FACTORY.fun_getUserLoginLocalStorage();
    this.isAdmin = this.user && this.user.role === RoleUser.ADMIN;
    this.state = {
      data: [],
      listCate: [],
      loadingBtnEdit: false,
      total: 0,
      valueRadioUserPost: 1, // 1 post; 0 black-market
      cateSlected: -1,
    };
  }

  async btnCommitWattingClicked(post) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (!this.isAdmin) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.INFO,
        title: "Đang đợi xác nhận bài viết",
        message:
          "Sau khi bài viết của bạn được duyệt thì mới hiển thị trên website",
      });
      return;
    }
    const ok = await CoreUI.fun_showConfirm({
      title: "Xác nhận bài viết này",
      message: post.title,
    });
    if (!ok) return;
    // commit
    const dataRes = await PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.POST_COMMIT + post.id,
      null,
      PublicModules.fun_getConfigBearerDefault({})
    );
    // error ?
    if (!dataRes.success) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: "Commit bài viết bị lỗi",
        message: MessageKeys.CHECK_CONNECTION,
      });
      return;
    }
    // ok
    const newList = this.state.data.map((v) => {
      if (v.id === post.id) {
        v.commited = true;
        return v;
      }
      return v;
    });
    this.setState({
      data: newList,
    });
  }

  columns = [
    {
      title: "Title",
      key: "1",
      width: 150,
      render: (obj) => {
        return <div className="text-capitalize">{obj.title}</div>;
      },
    },
    {
      title: "Status",
      width: 100,
      key: "id",
      render: (_obj) => {
        if (_obj.commited)
          return (
            <div className="text-center">
              <Tag className="tag-pr" icon={<CheckCircleOutlined />}>
                Đã Hiển thị
              </Tag>
            </div>
          );
        return (
          <div className="text-center">
            <span
              role="link"
              onClick={() => this.btnCommitWattingClicked(_obj)}
            >
              <Tag className="tag-sec" icon={<SyncOutlined spin />}>
                Đợi duyệt
              </Tag>
            </span>
          </div>
        );
      },
    },
    {
      title: "Image Banner",
      key: "2",
      width: 110,
      render: (obj) => {
        return (
          <div className="w-100 text-center">
            <MyImageView
              src={FACTORY.fun_getImageViewFromServer(
                obj.imageBanner,
                obj.imageUploadType
              )}
              width={50}
            />
          </div>
        );
      },
    },
    {
      title: "Upload Type",
      key: "3",
      width: 100,
      render: (obj) => {
        switch (obj.imageUploadType) {
          case ImageUploadKeys.SERVER:
            return (
              <div className="text-center">
                <Tag className="tag-sec">{obj.imageUploadType}</Tag>
              </div>
            );
          case ImageUploadKeys.IMGUR_COM:
            return (
              <div className="text-center">
                <Tag className="tag-sec">{obj.imageUploadType}</Tag>
              </div>
            );
          default:
            return (
              <div className="text-center">
                <Tag className="tag-sec">{obj.imageUploadType}</Tag>
              </div>
            );
        }
      },
    },
    {
      title: "Create At",
      key: "4",
      width: 100,
      render: (obj) => {
        const date = new Date(obj.createAt);
        return <div className="text-center">{date.toUTCString()}</div>;
      },
    },
    { title: "Category", dataIndex: "cate", key: "5", width: 150 },
    {
      title: "AC",
      key: "operation",
      fixed: "right",
      width: 30,
      render: (obj) => {
        return (
          <>
            <Button
              icon={<EditTwoTone />}
              loading={this.state.loadingBtnEdit}
              onClick={() => this.btnEditClicked(obj)}
              style={{ marginBottom: "5px" }}
              type="link"
              block
            ></Button>
            <Button
              icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
              onClick={() => this.btnDeleteClicked(obj)}
              type="link"
              block
              danger
            ></Button>
          </>
        );
      },
    },
    {
      title: "SHOW RANK",
      key: "6",
      width: 50,
      fixed: "right",
      render: (obj) => {
        if (!obj.isShowRank)
          return (
            <Checkbox onChange={(e) => this.checkBoxShowRank(e.target.checked,obj.id)}>
              Show rank
            </Checkbox>
          );
      },
    },
  ];

  componentDidMount() {
    window.scrollTo(0, 0);
    const tokens = FACTORY.fun_getTokenAndRefreshTokenLocalStorage();
    if (!this.user || !tokens) return;
    this.loadListCates();
    this.loadAllPost(this.props.managePost);
  }

  async btnEditClicked(obj) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    this.setState({
      loadingBtnEdit: true,
    });
    // get detail post
    const dataRes = await PublicModules.fun_get(
      Apis.API_HOST + Apis.API_TAILER.POST + obj.id
    );
    // error ?
    if (!dataRes.success) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: "Load detail post error",
        message: MessageKeys.CHECK_CONNECTION,
      });
      this.setState({
        loadingBtnEdit: false,
      });
      return;
    }

    this.setState({
      loadingBtnEdit: false,
    });
    this.dispatch({
      type: ActionType.ADMIN_ROUTER_UPDATE_UPDATE_POST,
      router: AdminRouterType.EDIT_POST,
      data: dataRes.data,
    });
  }

  async checkBoxShowRank(checked, postId) {
    if (!checked) return;
    const isConfirm = await CoreUI.fun_showConfirm({
      title: "Xác nhận: Hiển thị xếp hạng này ?",
      message:
        "Sau khi hành động này được xác nhận, bảng xếp hạng này sẽ được hiển thị",
    });
    if (!isConfirm) return;
    if (this.state.isLoading) return;
    this.setState({ isLoading: true }, async () => {
      const dataRes = await PublicModules.fun_put(
        Apis.API_HOST + Apis.API_TAILER.POST_SHOWRANK + postId,
        {
          isShowRank: true,
        },
        PublicModules.fun_getConfigBearerDefault({})
      );
      this.setState({ isLoading: false }, () => {
        if (!dataRes.success) {
          CoreUI.fun_showNotification({
            message: "Hiển thị bảng xếp hạng bị lỗi, hãy thử lại.",
          });
          return;
        }
        this.loadAllPost(this.props.managePost);
      });
    });
  }

  async btnDeleteClicked(obj) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    // show confirm
    const okDelete = await CoreUI.fun_showConfirm({
      title: `Xóa bài viết [ ${obj.title} ]`,
      message: "Hành đồng xóa bạn có chắc chứ ?",
    });
    if (!okDelete) return;

    // show loading
    const keyDelLoading = CoreUI.fun_showNotification({
      type: NotificationKeys.LOADING,
      title: "Đang xóa bài viết",
      message: `Đang thực hiện xóa bài viết [ ${obj.title} ]`,
    });

    // delete on db
    const dataRes = await PublicModules.fun_delete(
      Apis.API_HOST + Apis.API_TAILER.POST + obj.id,
      PublicModules.fun_getConfigBearerDefault({})
    );

    // close loading
    CoreUI.fun_closeNotificationLoading(keyDelLoading);

    // error ?
    if (!dataRes.success) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: "Không thành công !",
        message:
          `Thực hiện xóa bài viết [ ${obj.title} ] không thành công. ` +
          MessageKeys.CHECK_CONNECTION,
      });
      return;
    }

    // success
    // remove in state
    if (!this.state.data || this.state.data.lenght === 0) return;
    this.setState({
      data: this.state.data.filter((e) => e.id !== obj.id),
      total: this.state.total - 1,
    });

    CoreUI.fun_showNotification({
      type: NotificationKeys.SUCCESS,
      title: "Xóa thành công",
      message: `Thực hiện xóa bài viết [ ${obj.title} ] thành công.`,
    });
  }

  loadListCates() {
    let url = Apis.API_HOST + Apis.API_TAILER.CATE;
    url = url.substring(0, url.length - 1);
    url += `?isBlackMarket=${this.state.valueRadioUserPost === 0}`;
    PublicModules.fun_get(url).then((dataRes) => {
      if (!dataRes.success) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: "Tải thể loại lỗi!",
          message: MessageKeys.CHECK_CONNECTION,
        });
        return;
      }
      this.setState({
        listCate: dataRes.data,
      });
    });
  }

  loadAllPost(filter) {
    // need login !
    const userLoged = FACTORY.fun_getUserLoginLocalStorage();
    if (!userLoged) {
      message.info("Bạn cần phải đăng nhập!");
      return;
    }
    this.setState(
      {
        isLoading: true,
      },
      () => {
        let api =
          Apis.API_HOST +
          Apis.API_TAILER.POST_MANAGE +
          `?cate=${filter.cate}&unCommited=${filter.unCommited}&keyWord=${
            filter.keyWord
          }&page=${filter.page}&limit=${filter.limit}&isBlackMarket=${
            this.state.valueRadioUserPost === 0
          }`;
        FACTORY.GET_PUBLIC_MODULES().then((PublicModules) => {
          PublicModules.fun_get(
            api,
            PublicModules.fun_getConfigBearerDefault({})
          ).then(async (dataRes) => {
            const CoreUI = await FACTORY.GET_CORE_UI();
            // error ?
            if (!dataRes.success) {
              CoreUI.fun_showNotification({
                type: NotificationKeys.ERROR,
                title: "Tải bài viết bị lỗi",
                message: MessageKeys.CHECK_CONNECTION,
              });
              this.setState({
                isLoading: false,
              });
              return;
            }

            //set state
            this.setState({
              data: dataRes.data.map((v, k) => {
                v["key"] = k;
                return v;
              }),
              total: dataRes.total,
              isLoading: false,
            });
          });
        });
      }
    );
  }

  onPageChange = (page, pageSize) => {
    this.dispatch({
      type: ActionType.POST_MANAGE_UPDATE,
      value: { ...this.props.managePost, page: page, limit: pageSize },
    });
    window.scrollTo(0, 0);
  };

  componentWillReceiveProps(nextProps) {
    this.loadAllPost(nextProps.managePost);
  }

  async btnAddNewClicked() {
    const userLocal = FACTORY.fun_getUserLoginLocalStorage();
    const tokens = FACTORY.fun_getTokenAndRefreshTokenLocalStorage();
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (!userLocal || !tokens) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.INFO,
        title: "Cần phải đăng nhập trước.",
        message:
          "Để đăng bài viết, bạn cần phải đăng nhập vào hệ thống, nhấn vào nút đăng nhập trên thanh menu",
      });
      return;
    }

    this.dispatch({
      type: ActionType.ADMIN_ROUTER_UPDATE,
      router: AdminRouterType.INSERR_NEW_POST,
    });
  }

  valueRadioUserPostChange(e) {
    const value = e.target.value;
    this.setState({ valueRadioUserPost: value }, () => {
      this.loadListCates();
      this.loadAllPost(this.props.managePost);
    });
  }

  getOptionCate() {
    return this.state.listCate.map((v) => {
      return (
        <Select.Option key={v.id} value={v.id}>
          {v.name}
        </Select.Option>
      );
    });
  }

  selectCateChange(value) {
    this.setState(
      {
        cateSlected: value,
      },
      () => {
        this.dispatch({
          type: ActionType.POST_MANAGE_UPDATE,
          value: { ...this.props.managePost, cate: value },
        });
      }
    );
  }

  checkBoxUnCommitedChange(e) {
    const unCommited = e.target.checked;
    this.dispatch({
      type: ActionType.POST_MANAGE_UPDATE,
      value: { ...this.props.managePost, unCommited: unCommited },
    });
  }

  tbKeyWordChange(e) {
    let keyWord = e.target.value || "";
    // let keyWord = e;

    keyWord = keyWord.trim();
    if (keyWord === this.props.managePost.keyWord) return;
    this.dispatch({
      type: ActionType.POST_MANAGE_UPDATE,
      value: { ...this.props.managePost, keyWord: keyWord },
    });
  }

  

  render() {
    return (
      <div className="h-100 mt-2">
        {FACTORY.fun_getGl_loading(this.state.isLoading)}
        <div className="float-start">
          <button
            onClick={() => this.btnAddNewClicked()}
            className="btn-ds outline-pr"
          >
            Thêm bài viết
          </button>
          <Tooltip
            className="m-2"
            color={FACTORY.TOOLTIP_COLOR}
            title="Làm mới sau khi thêm"
          >
            <button
              onClick={() => this.loadAllPost(this.props.managePost)}
              className="mb-2 btn-ds outline-sec"
            >
              <RedoOutlined />
              Làm tươi
            </button>
          </Tooltip>
        </div>
        <div className="float-end p-3 bg-border hover mb-2">
          <Radio.Group
            onChange={(e) => this.valueRadioUserPostChange(e)}
            value={this.state.valueRadioUserPost}
          >
            <Radio value={1}>Bài viết</Radio>
            <Radio value={0}>Bán sách</Radio>
          </Radio.Group>
        </div>
        <div className="float-end p-3 m-2 mt-0">
          <Form layout="inline">
            <Form.Item>
              <Input.Search
                type="text"
                placeholder="search"
                onChange={(e) => this.tbKeyWordChange(e)}
                // onSearch={(value) => this.tbKeyWordChange(value)}
                className="mb-2"
              />
            </Form.Item>
            <Form.Item>
              <Select
                onChange={(e) => this.selectCateChange(e)}
                value={this.state.cateSlected}
                style={{ minWidth: "70px" }}
              >
                <Select.Option value={-1}>Tất cả thể loại</Select.Option>
                {this.getOptionCate()}
              </Select>
            </Form.Item>
            <Form.Item>
              <Checkbox onChange={(e) => this.checkBoxUnCommitedChange(e)}>
                Chưa duyệt
              </Checkbox>
            </Form.Item>
          </Form>
        </div>
        <br />
        <Table
          pagination={false}
          columns={this.columns}
          dataSource={this.state.data}
          scroll={{ x: 1300 }}
        />

        <div className="w-100 mt-3 mb-3 p-3">
          <PagingComponent
            total={this.state.total}
            onPageChange={(page, pageSize) => this.onPageChange(page, pageSize)}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    adminRouter: state.adminRouter.router,
    managePost: state.managePost,
  };
};

export default connect(mapStateToProps)(AllPostComponent);
