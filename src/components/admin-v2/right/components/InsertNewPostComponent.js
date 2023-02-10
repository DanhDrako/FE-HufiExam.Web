import React, { Component } from 'react';
import { Button, Input, message, Radio, Slider, Switch } from "antd";
import { connect } from 'react-redux';
import { ImageUploadKeys, MessageKeys, NotificationKeys } from "../../../../common/utils/keys";
import { Apis } from '../../../../common/utils/Apis';
import { ActionType, AdminRouterType } from '../../../../common/utils/actions-type';
import TextArea from 'antd/lib/input/TextArea';
import { DeleteOutlined } from '@ant-design/icons';
import FACTORY from '../../../../common/FACTORY';
import SelectCategoryComponent from './components/SelectCategoryComponent';
import SelectTagsComponents from './components/SelectTagNameComponent';
import LoadingComponent from '../../../common/LoadingComponent';
import ButtonDownload from '../../../common/ButtonDownload';
import ButtonInsertLinkDownload from '../../../common/ButtonInsertLinkDonload';
import ButtonAddNewCategoryComponent from './components/ButtonAddNewCategoryComponent';
import ButtonAddNewTagsComponent from './components/ButtonAddNewTagsComponent';
import QuestionAnserComponent from './components/QuestionAnserComponent';
import CkeditorComponent from '../../../common/CkeditorComponent';
import RoleUser from '../../../../common/utils/keys/RoleUserKey';

// import loadable from '@loadable/component';
// const CkeditorComponent = loadable(() => import('../../../common/CkeditorComponent'));
// const SelectCategoryComponent = loadable(() => import('./components/SelectCategoryComponent'))
// const SelectTagsComponents = loadable(() => import('./components/SelectTagNameComponent'));
// const LoadingComponent = loadable(() => import('../../../common/LoadingComponent'));
// const ButtonDownload = loadable(() => import('../../../common/ButtonDownload'));
// const ButtonInsertLinkDownload = loadable(() => import('../../../common/ButtonInsertLinkDonload'));
// const ButtonAddNewCategoryComponent = loadable(() => import('./components/ButtonAddNewCategoryComponent'));
// const ButtonAddNewTagsComponent = loadable(() => import('./components/ButtonAddNewTagsComponent'));
// const QuestionAnserComponent = loadable(() => import('./components/QuestionAnserComponent'));

const KEY_LOADING_LOAD_ALL_CATE = 'KEY_LOADING_LOAD_ALL_CATE';
const KEY_LOADING_LOAD_ALL_TAGS = 'KEY_LOADING_LOAD_ALL_TAGS';

class InsertNewPostComponent extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    const post = this.props.dataUpdate;
    this.state = {
      imageUploadType: ImageUploadKeys.SERVER,
      listCate: null,
      listTags: null,
      cateSelected: null,
      tagSelected: null,
      imageBannerUserSelected: null,
      isUpdate: post != null,
      cateUpdated: null,
      tagsUpdated: null,
      isCleanUp: false,
      title: post != null ? post.title : null,
      isTitled: post != null,
      loadingButtonSave: false,
      contentPost: post != null ? post.content : null,
      isSelectedMarket: post != null ? post.isBlackMarket : false,
      insertImageProducts: post == null ? [] : post.images.map((v) => {
        return {
          origin: { name: v },
          base64: null,
        };
      }),
      isAccessRule: false,
      isAccessNotRobot: -1,
      valueAcessNotRobotByUser: 0,
      countTryAgain: 0,
      descriptionSelected: post != null ? post.description : null,
      links: post != null ? FACTORY.fun_tryParseJSON(post.linksDownload) : [],
      tbBuy: post != null ? post.priceBuy : null,
      tbSell: post != null ? post.priceSell : null,
      valueRadioUserPost: 1,
    }
    this.userLoged = FACTORY.fun_getUserLoginLocalStorage();
    this.loadListCategory();
    this.loadListTags();
  }

  componentWillUnmount() {
    this.setState({
      isCleanUp: true,
    });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  getDataContentDefault() {
    if (this.state.isUpdate)
      return this.props.dataUpdate.content;
    return null;
  }

  tbTitleChange(e) {
    const value = e.target.value;
    if (value) {
      this.setState({
        isTitled: true,
        title: value,
      });
    }
    else {
      this.setState({
        isTitled: false,
        title: null,
      })
    }
  }

  async uploadImagesForBlackMarket() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    let images = '';
    const end = ';vsl;';
    const list = this.state.insertImageProducts;
    for (let i = 0; i < list.length; i++) {
      let data = '';
      if (list[i].base64 == null)
        data = { fileName: list[i].origin.name };
      else
        data = await PublicModules.fun_uploadAnImageToServer(list[i].origin, this.state.imageUploadType);
      if (data) {
        images += data.fileName;
        if (i !== list.length - 1)
          images += end;
      }
    }
    return images;
  }

  async handleInsert(cate, contentPost, linksDownload) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    // is user selected image banner ?
    let imageUrl = cate.imageBanner;
    let imageUploadType = ImageUploadKeys.SERVER;
    const imageUserSelected = this.state.imageBannerUserSelected;
    if (!imageUserSelected) {
      const ok = await CoreUI.fun_showConfirm({
        title: 'Bạn chưa chọn hình đại diện cho bài viết',
        message: 'Bạn có muốn dùng hình đại diện hiện tại không ?',
      });
      if (!ok) {
        this.setState({
          loadingButtonSave: false,
        });
        return;
      }
    }

    // upload image to imgur
    if (imageUserSelected) {
      const data = await PublicModules.fun_uploadAnImageToServer(imageUserSelected.origin, this.state.imageUploadType);
      if (!data) {
        this.setState({
          loadingButtonSave: false,
        });
        return;
      }
      imageUrl = data.fileName;
      imageUploadType = this.state.imageUploadType;
    }

    // black market ?
    const imagesString = await this.uploadImagesForBlackMarket();

    // posting to server
    // show loading
    const keyPostLoading = CoreUI.fun_showNotification({
      type: NotificationKeys.LOADING,
      message: 'Đang đăng bài viết của bạn, xin hãy chờ trong giây lát.',
    });

    // post
    const dataPostRes = await PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.POST,
      {
        title: this.state.title,
        imageBanner: imageUrl,
        content: contentPost,
        imageUploadType: imageUploadType,
        category: cate.id,
        tags: this.state.tagSelected,
        images: imagesString,
        description: this.state.descriptionSelected,
        linksDownload: linksDownload,
        isBlackMarket: this.state.isSelectedMarket,
        priceBuy: FACTORY.fun_parseNumberOrZero(this.state.tbBuy),
        priceSell: FACTORY.fun_parseNumberOrZero(this.state.tbSell),
      },
      PublicModules.fun_getConfigBearerDefault({}),
    );

    // close loading
    CoreUI.fun_closeNotificationLoading(keyPostLoading);

    // error ?
    if (!dataPostRes.success) {
      const message = PublicModules.fun_mapErrorToMessage(dataPostRes.message);
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Đăng bài viết bị lỗi',
        message: message,
      });
      this.setState({
        loadingButtonSave: false,
      });
      return;
    }

    // success
    CoreUI.fun_showNotification({
      type: NotificationKeys.SUCCESS,
      title: 'Đăng bài viết thành công',
      message: 'Bài viết của bạn được đăng lên thành công',
    });

    this.dispatch({
      type: ActionType.ADMIN_ROUTER_UPDATE,
      router: AdminRouterType.ALL_POST,
    });
  }

  async handleUpdate(obj, contentPost, linksDownload) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    // is user selected image banner ?
    let imageUrl = obj.imageBanner;
    let imageUploadType = obj.imageUploadType;
    const imageUserSelected = this.state.imageBannerUserSelected;

    // upload image to imgur
    if (imageUserSelected) {
      const data = await PublicModules.fun_uploadAnImageToServer(imageUserSelected.origin, this.state.imageUploadType);
      if (!data) {
        this.setState({
          loadingButtonSave: false,
        });
        return;
      }
      imageUrl = data.fileName;
      imageUploadType = this.state.imageUploadType;
    }

    // black market ?
    const imagesString = await this.uploadImagesForBlackMarket();

    // posting to server
    // show loading
    const keyPostLoading = CoreUI.fun_showNotification({
      type: NotificationKeys.LOADING,
      message: 'Đang đăng bài viết của bạn, xin hãy chờ trong giây lát.',
    });

    // post
    const dataPostRes = await PublicModules.fun_put(
      Apis.API_HOST + Apis.API_TAILER.POST + obj.id,
      {
        title: this.state.title,
        imageBanner: imageUrl,
        content: contentPost,
        imageUploadType: imageUploadType,
        category: this.state.cateSelected.id,
        tags: this.state.tagSelected,
        images: imagesString,
        description: this.state.descriptionSelected,
        linksDownload: linksDownload,
        isBlackMarket: this.state.isSelectedMarket,
        priceBuy: FACTORY.fun_parseNumberOrZero(this.state.tbBuy),
        priceSell: FACTORY.fun_parseNumberOrZero(this.state.tbSell),
      },
      PublicModules.fun_getConfigBearerDefault({}),
    );

    // close loading
    CoreUI.fun_closeNotificationLoading(keyPostLoading);

    // error ?
    if (!dataPostRes.success) {
      const message = PublicModules.fun_mapErrorToMessage(dataPostRes.message);
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Đăng bài viết bị lỗi',
        message: message,
      });
      this.setState({
        loadingButtonSave: false,
      });
      return;
    }

    // success
    CoreUI.fun_showNotification({
      type: NotificationKeys.SUCCESS,
      title: 'Cập nhật bài viết thành công',
      message: 'Bài viết của bạn được cập nhật thành công',
    });

    this.dispatch({
      type: ActionType.ADMIN_ROUTER_UPDATE,
      router: AdminRouterType.ALL_POST,
    });
  }

  async btnSaveClicked() {
    const CoreUI = await FACTORY.GET_CORE_UI();
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    // check access rule
    if (this.userLoged.role === RoleUser.MEM) {
      if (!this.state.isAccessRule) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Bạn chưa đồng ý với điều khoản',
          message: 'Hãy đồng ý với điều khoản của trang web và tiếp tục tác vụ! Thank ^^'
        });
        return;
      }

      // check count try again
      if (this.state.countTryAgain === 3) {
        await CoreUI.fun_showConfirm({
          title: 'Đã quá mức lượt thử lại',
          message: 'Chỉ cho phép sai quá 3 lần thôi nhé, lần sau bạn cố gắng lên: Fitting...',
        });
        this.dispatch({
          type: ActionType.ADMIN_ROUTER_UPDATE,
          router: AdminRouterType.ALL_POST,
        });
        return;
      }

      // check access not robot.
      if (this.state.isAccessNotRobot !== this.state.valueAcessNotRobotByUser) {
        const newNumber = FACTORY.fun_random1To100();
        this.setState({
          isAccessNotRobot: newNumber,
          countTryAgain: this.state.countTryAgain += 1,
        });
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Thanh trược không khớp !',
          message: `Làm ơn hãy kéo thanh trược khớp với số  ${newNumber} đã hiển thị, Thank ^^`
        });
        return;
      }
    }

    // button download
    if (!this.state.isSelectedMarket && this.state.links.length === 0) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Chưa có link download cho bài viết',
        message: 'Hãy nhập link download cho bài viết nhé'
      });
      return;
    }
    const list = this.state.links;
    let linksDownload = '[';
    for (let i = 0; i < list.length; i++) {
      const v = list[i];
      linksDownload += `{
        "title": "${v.title}",
        "link": "${v.link}"
      }`
      if (i !== list.length - 1)
        linksDownload += ',';
    }
    linksDownload += ']';

    // user slected cate ?
    const cate = this.state.cateSelected;
    if (!cate) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Chưa có thể loại cho bài viết',
        message: 'Hãy chọn thể loại cho bài viết nhé'
      });
      return;
    }

    // user title ?
    let title = this.state.title || '';
    title = title.trim();
    if (!this.state.isTitled || title === '') {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Chưa có Title cho bài viết',
        message: 'Hãy chọn Title cho bài viết nhé'
      });
      return;
    }
    if (title.length > 100) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Title quá dài',
        message: 'Hãy nhập ít hơn 100 ký tự.'
      });
      return;
    }

    // user description ?
    let descriptionSelected = this.state.descriptionSelected || '';
    descriptionSelected = descriptionSelected.trim();
    if (!descriptionSelected || descriptionSelected === '') {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Chưa có mô tả ngắn cho bài viết',
        message: 'Hãy viêt mô tả ngắn cho bài viết nhé'
      });
      return;
    }
    if (descriptionSelected.length > 190) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Mô tả ngắn quá dài',
        message: 'Hãy nhập ít hơn 190 ký tự.'
      });
      return;
    }

    // user content ?
    // content post
    const contentPost = this.state.isSelectedMarket ? '' : this.state.contentPost;
    if (!this.state.isSelectedMarket && !contentPost) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Chưa có nhập nội dung cho bài viết',
        message: 'Hãy nhập nội dung cho bài viết nhé'
      });
      return;
    }

    // check length content
    const lengthPost = contentPost.length;
    if (lengthPost > 10000) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Nội dung bài viết quá dài !',
        message: 'Hiện tại chỉ hổ trợ bài viết < 10.000 từ.'
      });
      return;
    }

    // show confirm
    const ok = await CoreUI.fun_showConfirm({
      title: this.state.isUpdate ? 'Hành động cập nhật bài viết' : 'Hành động đăng bài viết',
      message: 'Nhấn OK để xác nhận cập nhật bài viết này',
    });
    if (!ok) return;

    // loading button -> disable user clicked
    this.setState({
      loadingButtonSave: true,
    });

    // check auth
    const isAuth = await PublicModules.fun_get(
      Apis.API_HOST + Apis.API_TAILER.AUTH,
      PublicModules.fun_getConfigBearerDefault({}),
    );
    if (!isAuth.success) {
      this.setState({
        loadingButtonSave: false,
      });
      return;
    }

    // Upload image banner first.
    if (this.state.isUpdate)
      await this.handleUpdate(this.props.dataUpdate, contentPost, linksDownload);
    else
      await this.handleInsert(cate, contentPost, linksDownload);
  }

  async loadListTags() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    // load list tags from db
    let url = Apis.API_HOST + Apis.API_TAILER.TAG_NAME;
    url = url.substring(0, url.length - 1);
    url += `?isBlackMarket=${this.state.isSelectedMarket || false}`;
    PublicModules.fun_get(
      url,
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Tải thẻ cho bài viết bị lỗi!',
          message: MessageKeys.CHECK_CONNECTION,
        });
        message.error({ content: 'Tags Load Faild!', key: KEY_LOADING_LOAD_ALL_TAGS, duration: 1 });
        return;
      }

      // update state
      // is action edit this post ?
      if (this.state.isUpdate) {
        const tags = this.props.dataUpdate.tags.map((v) => {
          return v.id.toString();
        });
        this.setState({
          listTags: dataRes.data,
          tagsUpdated: tags,
          tagSelected: tags,
        });
      }
      else
        this.setState({
          listTags: dataRes.data,
          tagsUpdated: [],
        });
    });
  }

  async loadListCategory() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    // load cate from db
    let url = Apis.API_HOST + Apis.API_TAILER.CATE;
    url = url.substring(0, url.length - 1);
    url += `?isBlackMarket=${this.state.isSelectedMarket || false}`;
    PublicModules.fun_get(
      url,
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Tải thể loại bài viết bị lỗi',
          message: MessageKeys.CHECK_CONNECTION,
        });
        message.error({ content: 'Cates Load Faild!', key: KEY_LOADING_LOAD_ALL_CATE, duration: 1 });
        return;
      }

      // update state
      // is action edit this post ?
      if (this.state.isUpdate)
        this.setState({
          listCate: dataRes.data,
          cateUpdated: this.props.dataUpdate.cate.name,
          cateSelected: this.props.dataUpdate.cate,
        });
      else
        this.setState({
          listCate: dataRes.data,
        });
    });
  }

  selectCateChange(cateId) {
    if (!cateId) return;
    const cateSelected = this.state.listCate.find((e) => String(e.id) === String(cateId));
    this.setState({
      cateSelected: cateSelected,
      cateUpdated: cateSelected.name,
    });
  }

  selectTagsChange(tagId) {
    if (!tagId) return;
    if (this.state.isUpdate)
      this.setState({
        tagSelected: tagId,
        tagsUpdated: tagId,
      });
    else
      this.setState({
        tagSelected: tagId,
        tagsUpdated: tagId,
      });
  }

  getImageBanner() {
    if (this.state.imageBannerUserSelected)
      return (
        <img
          alt='banner'
          className="img-fluid w-50"
          src={this.state.imageBannerUserSelected.base64}
        />
      );
    // is update ?
    if (this.state.isUpdate) {
      const obj = this.props.dataUpdate;
      return (
        <img
          src={FACTORY.fun_getImageViewFromServer(obj.imageBanner, obj.imageUploadType)}
          className="img-fluid w-50"
          alt='img update'
        />
      );
    }
    if (this.state.cateSelected) {
      const cate = this.state.cateSelected;
      return (
        <img
          src={FACTORY.fun_getImageViewFromServer(cate.imageBanner, cate.imageUploadType)}
          className="img-fluid w-50"
          alt='cate default'
        />
      );
    }
  }

  async btnChooseBannerClicked(event) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    // check size: < 4 MB
    const maxSize = process.env.REACT_APP_MAX_SIZE_UPLOAD_MARKET;
    const size = file.size / 1024 / 1024;
    if (size > maxSize) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'File Quá lớn !',
        message: 'Hiện tại chỉ cho phép tối đa hình < 4 MB',
      });
      return;
    }
    const fileResize = await PublicModules.fun_resizeImage(file);
    if (!fileResize) return;
    // set state
    this.setState({
      imageBannerUserSelected: {
        origin: fileResize.origin,
        base64: fileResize.base64,
      },
    });
  }

  ckEditorChange(data) {
    this.setState({
      contentPost: data,
    })
  }

  async btnCancleUpdate() {
    const CoreUI = await FACTORY.GET_CORE_UI();
    // show cofirm
    const ok = await CoreUI.fun_showConfirm({
      title: 'Bạn có chắc hủy ?',
      message: `Hủy bỏ tác vụ này ngay bây giờ ?`
    });
    if (!ok) return;

    // go all post
    this.dispatch({
      type: ActionType.ADMIN_ROUTER_UPDATE,
      router: AdminRouterType.ALL_POST,
    });
  }

  getButtonInserOrUpdate(dislayText) {
    return (
      <div className='row'>
        <div className='col-6'>
          <button
            className='btn-ds outline-sec block'
            onClick={() => this.btnCancleUpdate()}>Hủy Bỏ
          </button>
        </div>
        <div className='col-6'>
          <button
            className='btn-ds outline-pr block'
            onClick={() => this.btnSaveClicked()}>
            {dislayText}
          </button>
        </div>
      </div>
    );
  }

  async btnAddNewCateClicked() {
    const CoreUI = await FACTORY.GET_CORE_UI();
    CoreUI.fun_showNotification({
      type: NotificationKeys.INFO,
      title: 'Coming soon!',
      message: MessageKeys.COMING_SOON,
    });
  }

  async btnAddNewTagClicked() {
    const CoreUI = await FACTORY.GET_CORE_UI();
    CoreUI.fun_showNotification({
      type: NotificationKeys.INFO,
      title: 'Coming soon!',
      message: MessageKeys.COMING_SOON,
    });
  }

  getGl_loading() {
    if (this.state.loadingButtonSave)
      return (
        <LoadingComponent />
      );
  }

  async imgBannerClicked() {
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (!this.state.imageBannerUserSelected) return;
    // show confirm
    const ok = await CoreUI.fun_showConfirm({
      title: 'Xóa hình đại diện này ?',
      message: 'Bạn có chắc muốn xóa hình đại diện này, hãy nhớ chọn hình đại diện cho bài đăng bắt mắt nhé.'
    });
    if (!ok) return;
    this.setState({
      imageBannerUserSelected: null,
    })
  }

  async insertImageProductChange(event) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    // set length
    const maxLength = process.env.REACT_APP_MAX_LENGTH_UPLOAD_MARKET;
    if (this.state.insertImageProducts.length > maxLength - 1) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Không được phép !',
        message: `Hiện tại chỉ cho upload tối đa ${maxLength} hình.`,
      });
      return;
    }

    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    // check size: < 4 MB
    const maxSize = process.env.REACT_APP_MAX_SIZE_UPLOAD_MARKET;
    const size = file.size / 1024 / 1024;
    if (size > maxSize) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'File Quá lớn !',
        message: 'Hiện tại chỉ cho phép tối đa hình < 4 MB',
      });
      return;
    }
    const fileResize = await PublicModules.fun_resizeImage(file);
    if (!fileResize) return;
    // set state
    this.setState({
      insertImageProducts: [...this.state.insertImageProducts, {
        origin: fileResize.origin,
        base64: fileResize.base64,
      }]
    });
  }

  async insertImageProductPreviewClicked(name) {
    const CoreUI = await FACTORY.GET_CORE_UI();
    const ok = await CoreUI.fun_showConfirm({
      title: 'Xóa hình này ?',
      message: 'Xóa hình mô tả này ?',
    });
    if (!ok) return;
    this.setState({
      insertImageProducts: this.state.insertImageProducts.filter((v) => {
        return String(v.origin.name) !== String(name);
      }),
    });
  }

  getInsertImageProductPreview() {
    const post = this.props.dataUpdate;
    return this.state.insertImageProducts.map((v, k) => {
      if (v.base64)
        return (
          <span role="link" key={k} onClick={() => this.insertImageProductPreviewClicked(v.origin.name)}>
            <img alt='Images Products' className="img-fluid w-25 m-2" src={v.base64} />
          </span>
        );
      return (
        <span role="link" key={k} onClick={() => this.insertImageProductPreviewClicked(v.origin.name)}>
          <img alt='Images Products' className="img-fluid w-25 m-2"
            src={FACTORY.fun_getImageViewFromServer(v.origin.name, post.imageUploadType)}
          />
        </span>
      );
    });
  }

  getInsertImageProduct() {
    if (!this.state.isSelectedMarket) return;
    return (
      <div className='insert-image-market mt-3'>
        <div className='row'>
          <div className='col-xxl-4 col-xl-4 col-md-4 col-sm-12 col-12 text-center'>
            <p>
              <Input
                onChange={(e) => this.handleInputChange(e)}
                name='tbBuy'
                autoComplete='off'
                className='text-danger form-control' placeholder='Giá gốc bạn mua' type='number' />
            </p>
            <p>
              <Input
                value={FACTORY.fun_formatCurrency(this.state.tbBuy)}
                readOnly={true}
                addonBefore={<span className='fw-bold _text-thr'>B</span>}
                addonAfter='VND'
                autoComplete='off'
                className='text-danger' type='text' />
            </p>
          </div>
          <div className='col-xxl-4 col-xl-4 col-md-4 col-sm-12 col-12 text-center'>
            <p>
              <Input
                onChange={(e) => this.handleInputChange(e)}
                name='tbSell'
                autoComplete='off'
                className='text-success form-control' placeholder='Giá bạn bán' type='number' />
            </p>
            <p>
              <Input
                value={FACTORY.fun_formatCurrency(this.state.tbSell)}
                readOnly={true}
                addonBefore={<span className='fw-bold _text-sec'>S</span>}
                addonAfter='VND'
                autoComplete='off'
                type='text' />
            </p>
          </div>
          {/* <div className='col-xxl-4 col-xl-4 col-md-4 col-sm-12 col-12 text-center'>
            <input id="selectImageProduct" onChange={(e) => this.insertImageProductChange(e)} className="form-control d-none" type="file" accept=".jpg, .png, .jpeg" />
            <label className='btn-upload-file' htmlFor='selectImageProduct' role='button'>+ Upload</label>
          </div> */}
        </div>
        {/* <div className='mt-4'>
          {this.getInsertImageProductPreview()}
        </div> */}
      </div>
    );
  }

  accessRuleChange(e) {
    this.setState({
      isAccessRule: e,
      isAccessNotRobot: FACTORY.fun_random1To100(),
    });
  }

  accessNotRobotChange(e) {
    this.setState({
      valueAcessNotRobotByUser: e,
    });
  }

  getAccessNotRobotUI() {
    if (!this.state.isAccessRule) return;
    return (
      <>
        <p className='fw-bold text-uppercase mb-8'>Kéo thang trược tới mức:
        <span className='_text-sec'>
            &nbsp;[ {this.state.isAccessNotRobot} ]
          </span>
        </p>
        <Slider onChange={(e) => this.accessNotRobotChange(e)} defaultValue={0} />
      </>
    );
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value.trim();
    this.setState({
      [name]: value,
    });
  }

  btnInsertLinkClicked(data) {
    this.setState({
      links: [...this.state.links, data],
    });
  }

  btnDeleteButtonDownloadClicked() {
    this.state.links.pop();
    this.setState({
      links: [...this.state.links],
    });
  }

  getButtonDownloadUI() {
    let list = this.state.links;
    if (!list) return;
    list = list.map((v, k) => {
      return (
        <ButtonDownload
          key={k}
          href={v.link}
          title={v.title}
        />
      );
    });
    if (list.length > 0) {
      list.push(
        <Button onClick={() => this.btnDeleteButtonDownloadClicked()} key='999999999' icon={<DeleteOutlined />} type='primary' danger ghost></Button>
      );
      return list;
    }
  }

  getCkEditor() {
    if (!this.state.isSelectedMarket)
      return (
        <>
          <div className='insert-btn-download mt-3'>
            <ButtonInsertLinkDownload onOk={(data) => this.btnInsertLinkClicked(data)} />
          </div>
          <div className='ckeditor-component'>
            <CkeditorComponent defaultValue={this.getDataContentDefault()} onChange={(data) => this.ckEditorChange(data)} />
          </div>
          <div className='insert-btn-download mt-3'>
            {this.getButtonDownloadUI()}
          </div>
        </>
      );
  }

  getSelectTagsUI() {
    return (
      <div className='p-3 bg-border mb-3'>
        <p className='h5 fw-bold'>Gắn thẻ</p>
        <SelectTagsComponents
          defaultValue={this.state.tagSelected} onChange={(e) => this.selectTagsChange(e)} listTags={this.state.listTags} />
        <div className='text-right mt-2'>
          <ButtonAddNewTagsComponent
            styled={true}
            onRefresh={() => this.loadListTags()}
            isBlackMarket={this.state.isSelectedMarket || false}
          />
        </div>
      </div>
    )
  }

  valueRadioUserPostChange(e) {
    const value = e.target.value;
    this.setState({
      valueRadioUserPost: value,
      isSelectedMarket: value === 0
    }, () => {
      this.loadListCategory();
      this.loadListTags();
    });
  }

  render() {
    if (this.state.isCleanUp) return (<></>);
    const textInsertOrUp = this.state.isUpdate ? 'Cập Nhật' : 'Đăng bài viết';
    return (
      <>
        {this.getGl_loading()}
        <div className="row pb-5" style={{ minHeight: '200px' }}>
          <div className="col-xxl-8 col-xl-8 col-md-8 col-sm-12 col-12" style={{ minHeight: '200px' }}>
            <div id='insert-post-col-left' className='p-3 mt-4 bg-border'>
              <div className='insert-title'>
                <input placeholder='Đặt tiêu đề cho bài viết'
                autoComplete='off'
                 defaultValue={this.state.title} onChange={(e) => this.tbTitleChange(e)} type='text' className='form-control w-100 fw-bold' />
              </div>
              {this.getInsertImageProduct()}
              <div className='insert-title mt-3'>
                <TextArea defaultValue={this.state.descriptionSelected} placeholder='Viết đoạn mô tả ngắn' className='form-control w-100' name='descriptionSelected' onChange={(e) => this.handleInputChange(e)} rows={3} />
              </div>
              {this.getCkEditor()}
            </div>

            {this.state.isUpdate ?
              <div className='p-3 mt-4 pb-3 bg-border'>
                <QuestionAnserComponent post={this.props.dataUpdate} />
              </div> :
              <></>
            }
          </div>
          <div className="col-xxl-4 col-xl-4 col-md-4 col-sm-12 col-12 mt-4" style={{ minHeight: '200px' }}>
            {!this.state.isUpdate ?
              <div className='p-3 bg-border mb-3'>
                <p className='h5 fw-bold'>Bạn đăng gì ?</p>
                <Radio.Group onChange={(e) => this.valueRadioUserPostChange(e)} value={this.state.valueRadioUserPost} >
                  <Radio value={1}>Bài viết</Radio>
                  <Radio value={0}>Bán sách</Radio>
                </Radio.Group>
              </div> : ''}

            <div className='p-3 bg-border mb-3'>
              <p className='h5 fw-bold'>Chọn thể loại</p>
              <SelectCategoryComponent defaultValue={this.state.cateSelected} onChange={(e) => this.selectCateChange(e)} listCate={this.state.listCate} />
              <div className='text-right mt-2'>
                <ButtonAddNewCategoryComponent
                  onRefresh={() => this.loadListCategory()}
                  isBlackMarket={this.state.isSelectedMarket || false}
                  styled={true} />
              </div>
            </div>

            {this.getSelectTagsUI()}

            <div className='p-3 bg-border mb-3'>
              <p className='h5 fw-bold'>Chọn hình đại diện</p>
              <div className='text-right mt-2'>
                <input onChange={(e) => this.btnChooseBannerClicked(e)} className="form-control" type="file" accept=".jpg, .png, .jpeg" id="formFile" />
                <div className='w-100 text-center mt-2'>
                  <span role="link" onClick={() => this.imgBannerClicked()} >
                    {this.getImageBanner()}
                  </span>
                </div>
              </div>
            </div>

            <div className='p-3 bg-border'>
              {this.userLoged.role === RoleUser.MEM ?
                <>
                  <div className='m-2 p-2 mt-0 pt-0'>
                    <Switch name='isAccessRule' onChange={(e) => this.accessRuleChange(e)} checkedChildren="Cám ơn" unCheckedChildren="Tôi!... Đồng ý với điều khoản" />
                  </div>
                  <div className='m-2 p-2 mt-0 pt-0'>
                    {this.getAccessNotRobotUI()}
                  </div>
                </> : ''}
              {this.getButtonInserOrUpdate(textInsertOrUp)}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    adminRouter: state.adminRouter
  }
}

export default connect(mapStateToProps)(InsertNewPostComponent);