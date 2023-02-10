import { ImageUploadKeys, LocalStorageKeys, MessageKeys, NotificationKeys } from "./utils/keys";
import { DataResponse } from "./entities";
import axios from "axios";
import { Apis } from "./utils/Apis";
import FACTORY from './FACTORY';
import loadable from '@loadable/component';
import * as Dics from './MyDictionary.json';
import moment from 'moment';

const bcrypt = require("bcryptjs");

export class PublicModules {
  static fun_log = (value, file, line) => {
    if (String(process.env.REACT_APP_DEBUG_MODE) === 'TRUE') {
      const logHeader = `======== DEBUG LOG MODE [ File: ${file || 'NULL'} ; Line: ${line || 'NULL'} ] ========`;
      console.log(logHeader);
      console.log(value);
      let logFooter = '';
      const mid = logHeader.length / 2;
      for (let i in logHeader) {
        if (i < mid - 5 || i > mid + 5)
          logFooter += '='
        else
          logFooter += '-'
      }
      console.log(logFooter);
    }
  }

  static fun_trimAddress = (address) => {
    if (!address)
      return 'Load Address Failure!';
    if (address.length > 12)
      return address.substring(0, 6) + '...' + address.substring(address.length - 9, address.length);
    return address;
  }

  static fun_setUserLoginLocalStorage = (userLoginEntity) => {
    localStorage.setItem(LocalStorageKeys.USERID, userLoginEntity.userId);
    localStorage.setItem(LocalStorageKeys.USERNAME, userLoginEntity.userName);
    localStorage.setItem(LocalStorageKeys.ROLE, userLoginEntity.role);
  }

  static fun_setTokenAndRefreshTokenLocalStorage = (gaurd) => {
    localStorage.setItem(LocalStorageKeys.TOKEN, gaurd.token);
    localStorage.setItem(LocalStorageKeys.TOKEN_REFRESH, gaurd.refresh);
  }

  static fun_removeUserLoginLocalStorage = () => {
    localStorage.removeItem(LocalStorageKeys.USERID);
    localStorage.removeItem(LocalStorageKeys.USERNAME);
    localStorage.removeItem(LocalStorageKeys.ROLE);
  }

  static fun_removeTokenAndRefreshTokenLocalStorage = () => {
    localStorage.removeItem(LocalStorageKeys.TOKEN);
    localStorage.removeItem(LocalStorageKeys.TOKEN_REFRESH);
  }

  static fun_getConfigBearerDefault({
    isRefresh = false,
  }) {
    const gaurd = FACTORY.fun_getTokenAndRefreshTokenLocalStorage();
    if (!gaurd)
      return {};
    let token = gaurd.token;
    if (isRefresh)
      token = gaurd.refresh;
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }

  static fun_updateTokenAndRefreshTokenWhenSessionUserExpired = async () => {
    const CoreUI = await FACTORY.GET_CORE_UI();
    // show loading new session
    const keyLoadingNewSession = CoreUI.fun_showNotification({
      type: NotificationKeys.LOADING,
      title: 'Phiên làm việc đã hết hạn',
      message: 'Chúng tôi đang khởi tạo phiên làm việc mới',
    });
    const dataRefreshToken = await PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.AUTH_REFRESH,
      null,
      PublicModules.fun_getConfigBearerDefault({ isRefresh: true }),
    );

    // close loading
    CoreUI.fun_closeNotificationLoading(keyLoadingNewSession);

    // error : [ user needed login again ]
    if (!dataRefreshToken.success) {
      await CoreUI.fun_showConfirm({
        title: 'Your Session Expired',
        message: 'You need login again to use this application',
      });
      PublicModules.fun_removeTokenAndRefreshTokenLocalStorage();
      PublicModules.fun_removeUserLoginLocalStorage();
      window.location.replace('/');
    }

    // success
    CoreUI.fun_showNotification({
      type: NotificationKeys.WARNING,
      title: 'Hãy thao tác lại hành động vừa rồi nhé!',
      message: 'Bạn đã hết thời hạn đăng nhập, chúng tôi đã khởi tạo lại mới, vì vậy hãy thao tác lại hành động vừa rồi nhé.',
    });
    const gaurd = dataRefreshToken.data.gaurd;
    // remove old token
    PublicModules.fun_removeTokenAndRefreshTokenLocalStorage()
    // add new token
    PublicModules.fun_setTokenAndRefreshTokenLocalStorage(gaurd);
  }

  static fun_getCurrentTimestampUTC_Moment() {
    var current = moment().utc().valueOf();
    return (current - current % 1000) / 1000;
  }

  static fun_getOauthClient = () => {
    // const current = PublicModules.fun_getCurrentTimestampUTC_Moment();
    // const time1 = current.toString();
    // const time2 = (current + 30).toString();
    // const APP_NAME = 'MY-HUFIER_';
    // const data = `*100*${time2}|${APP_NAME}_${time1}_${Apis.REACT_APP_DATA_TYPE_MY_HUFIER}|${time1}#`;
    // let hash = bcrypt.hashSync(data);
    // hash = hash.replace('$2a$10$', APP_NAME);

    const time1 = 2;
    const time2 = 3;
    const hash = 'MY-HUFIER_';

    return {
      "request_name": hash,
      "request_time_from": time1,
      "request_time_to": time2,
    };
  }

  static fun_getOauthClientV2 = () => {
    const current = PublicModules.fun_getCurrentTimestampUTC_Moment();
    const time1 = current.toString();
    const time2 = (current + 30).toString();
    const APP_NAME = 'MY-HUFIER_';
    const data = `*100*${time2}|${APP_NAME}_${time1}_${Apis.REACT_APP_DATA_TYPE_MY_HUFIER}|${time1}#`;
    let hash = bcrypt.hashSync(data);
    hash = hash.replace('$2a$10$', APP_NAME);

    return {
      "request_name": hash,
      "request_time_from": time1,
      "request_time_to": time2,
    };
  }

  static fun_makeNewConf = (conf) => {
    const authClient = PublicModules.fun_getOauthClient();
    if (!conf) conf = {
      headers: {},
    };
    conf.headers['request_name'] = authClient.request_name;
    conf.headers['request_time_from'] = authClient.request_time_from;
    conf.headers['request_time_to'] = authClient.request_time_to;

    return conf;
  }

  static fun_get = async (url, conf) => {
    const dataRes = new DataResponse();
    conf = PublicModules.fun_makeNewConf(conf);
    await axios.get(url, conf)
      .catch(async (e) => {
        dataRes.success = false;
        dataRes.message = "ERROR_FETCH_URL";
        PublicModules.fun_log(e, 'PublicModule', 64);
        // started update token & refresh token.
        await PublicModules.fun_updateTokenAndRefreshTokenWhenSessionUserExpired();
      })
      .then((dataServer) => {
        if (dataServer) {
          dataServer = dataServer.data;
          dataRes.success = dataServer.success;
          dataRes.data = dataServer.result;
          dataRes.message = dataServer.message;
          dataRes.total = dataServer.total;
        } else {
          dataRes.success = false;
          dataRes.message = "ERROR_SERVER_500";
        }
      });
    return dataRes;
  }

  static fun_post = async (url, data, conf) => {
    const CoreUI = await FACTORY.GET_CORE_UI();
    const dataRes = new DataResponse();
    conf = PublicModules.fun_makeNewConf(conf);
    await axios.post(url, data, conf)
      .catch(async (e) => {
        dataRes.success = false;
        dataRes.message = "ERROR_FETCH_URL";
        PublicModules.fun_log(e, 'PublicModule', 87);
        // started update token & refresh token.
        try {
          const dataRefreshToken = await axios.post(
            Apis.API_HOST + Apis.API_TAILER.AUTH_REFRESH,
            null,
            Object.assign({}, {
              ...conf.headers,
              ...PublicModules.fun_getConfigBearerDefault({ isRefresh: true }).headers,
            }),
          );
          // error : [ user needed login again ]
          if (!dataRefreshToken.data.success) {
            await CoreUI.fun_showConfirm({
              title: 'Your Session Expired',
              message: 'You need login again to use this application',
            });
            PublicModules.fun_removeTokenAndRefreshTokenLocalStorage();
            PublicModules.fun_removeUserLoginLocalStorage();
            window.location.replace('/');
          }

          // success
          CoreUI.fun_showNotification({
            type: NotificationKeys.WARNING,
            title: 'Hãy thao tác lại hành động vừa rồi nhé!',
            message: 'Bạn đã hết thời hạn đăng nhập, chúng tôi đã khởi tạo lại mới, vì vậy hãy thao tác lại hành động vừa rồi nhé.',
          });
          const gaurd = dataRefreshToken.data.result.gaurd;
          // remove old token
          PublicModules.fun_removeTokenAndRefreshTokenLocalStorage()
          // add new token
          PublicModules.fun_setTokenAndRefreshTokenLocalStorage(gaurd);
        } catch (e) {
          PublicModules.fun_log(e, 'PublicModule', 180);
          await CoreUI.fun_showConfirm({
            title: 'Your Session Expired',
            message: 'You need login again to use this application',
          });
          PublicModules.fun_removeTokenAndRefreshTokenLocalStorage();
          PublicModules.fun_removeUserLoginLocalStorage();
          window.location.replace('/');
        }
      })
      .then((dataServer) => {
        if (dataServer) {
          dataServer = dataServer.data;
          dataRes.success = dataServer.success;
          dataRes.data = dataServer.result;
          dataRes.total = dataServer.total;
          dataRes.message = dataServer.message;
        } else {
          dataRes.success = false;
          dataRes.message = "ERROR_SERVER_500";
        }
      });
    return dataRes;
  }

  static fun_put = async (url, data, conf) => {
    const dataRes = new DataResponse();
    conf = PublicModules.fun_makeNewConf(conf);
    await axios.put(url, data, conf)
      .catch(async (e) => {
        dataRes.success = false;
        dataRes.message = "ERROR_FETCH_URL";
        PublicModules.fun_log(e, 'PublicModule', 220);
        // started update token & refresh token.
        await PublicModules.fun_updateTokenAndRefreshTokenWhenSessionUserExpired();
      })
      .then((dataServer) => {
        if (dataServer) {
          dataServer = dataServer.data;
          dataRes.success = dataServer.success;
          dataRes.data = dataServer.result;
          dataRes.message = dataServer.message;
        } else {
          dataRes.success = false;
          dataRes.message = "ERROR_SERVER_500";
        }
      });
    return dataRes;
  }

  static fun_delete = async (url, conf) => {
    const dataRes = new DataResponse();
    conf = PublicModules.fun_makeNewConf(conf);
    await axios.delete(url, conf)
      .catch(async (e) => {
        dataRes.success = false;
        dataRes.message = "ERROR_FETCH_URL";
        PublicModules.fun_log(e, 'PublicModule', 137);
        // started update token & refresh token.
        await PublicModules.fun_updateTokenAndRefreshTokenWhenSessionUserExpired();
      })
      .then((dataServer) => {
        if (dataServer) {
          dataServer = dataServer.data;
          dataRes.success = dataServer.success;
          dataRes.data = dataServer.result;
          dataRes.message = dataServer.message;
        } else {
          dataRes.success = false;
          dataRes.message = "ERROR_SERVER_500";
        }
      });
    return dataRes;
  }

  static fun_getTimeStamp = () => {
    return new Date().getTime().toString();
  }

  static fun_requireLogin = ({
    isRedirectToHome = true,
  }) => {
    const user = PublicModules.fun_getUserLoginLocalStorage();
    const gaurd = PublicModules.fun_getTokenAndRefreshTokenLocalStorage();
    if ((!user || !gaurd) && isRedirectToHome)
      window.location.replace('/');

    return {
      user: user,
      gaurd: gaurd,
    }
  }

  static fun_scrollInto(ref) {
    if (ref && ref.current) {
      ref.current.scrollIntoView();
    }
  }

  static fun_mapErrorToMessage(error) {
    if (!error) return 'UNKNOWN';
    let message = error;
    const strs = message.split(' ');
    let keySearch = strs[0];
    if (strs.length === 2)
      keySearch = strs[1];
    const values = Dics.default;
    const keys = Object.keys(values);
    for (let i = 0; i < keys.length; i++)
      if (String(keys[i]) === keySearch)
        return strs.length === 2 ? strs[0] + ' ' + values[keys[i]] : values[keys[i]];
    return message;
  }

  static fun_ComingSoon = async () => {
    const CoreUI = await FACTORY.GET_CORE_UI();
    CoreUI.fun_showNotification({
      type: NotificationKeys.INFO,
      title: 'Coming soon!',
      message: MessageKeys.COMING_SOON,
    });
  }

  static fun_uploadAnImageToServer = async (image, imageUploadType) => {
    const CoreUI = await FACTORY.GET_CORE_UI();
    let urlUpload = null;
    switch (imageUploadType) {
      case ImageUploadKeys.SERVER:
        urlUpload = Apis.API_HOST + Apis.API_TAILER.UPLOAD_IMAGE_SERVER;
        break;
      case ImageUploadKeys.IMGUR_COM:
        urlUpload = Apis.API_HOST + Apis.API_TAILER.UPLOAD_IMAGE_IMGUR;
        break;

      default:
        urlUpload = Apis.API_HOST + Apis.API_TAILER.UPLOAD_IMAGE_IPFS;
        break;
    }
    const file = image;
    const formData = new FormData();
    formData.append('file', file);
    const configBearer = PublicModules.fun_getConfigBearerDefault({});
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        ...configBearer.headers
      }
    }

    // show loading
    const keyUploadImgLoding = CoreUI.fun_showNotification({
      type: NotificationKeys.LOADING,
      message: `Đang tải [${file.name}] lên server...`,
    });
    // uploading
    const dataRest = await PublicModules.fun_post(
      urlUpload,
      formData,
      config
    );
    // close loading
    CoreUI.fun_closeNotificationLoading(keyUploadImgLoding);
    // error ?
    if (!dataRest.success) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: `Tải [${file.name}] lên server bị lỗi`,
        message: MessageKeys.CHECK_CONNECTION,
      });
      PublicModules.fun_log(`Error Upload: ${dataRest.message}`, 'upload Image')
      return null;
    }

    const data = dataRest.data;
    // upload server success
    CoreUI.fun_showNotification({
      type: NotificationKeys.SUCCESS,
      title: `Tải [${file.name}] lên server thành công`,
      message: 'Upload to server successfully!',
    });

    return data;
  }

  static fun_getColor = (isBlackMarket) => {
    if (isBlackMarket)
      return '#ececec';
    return '#fff';
  }

  static fun_resizeImage = async (imageFile) => {
    const CoreUI = await FACTORY.GET_CORE_UI();
    // check size: < ,,
    const maxSize = process.env.REACT_APP_MAX_SIZE_UPLOAD_MARKET;
    const size = imageFile.size / 1024 / 1024;
    if (size > maxSize) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'File Quá lớn !',
        message: `Hiện tại chỉ cho phép tối đa hình < ${maxSize} MB`,
      });
      return null;
    }
    const keyLoading = CoreUI.fun_showNotification({
      type: NotificationKeys.LOADING,
      message: 'Resize Image Loading...',
    });
    try {
      const optionsResize = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 600,
        useWebWorker: true
      }
      var imageCompression = await loadable.lib(() => import('browser-image-compression')).load();
      imageCompression = imageCompression.default;
      const compressedFile = await imageCompression(imageFile, optionsResize);
      PublicModules.fun_log('before: ' + imageFile.size / 1024 / 1024 + ' | after: ' + compressedFile.size / 1024 / 1024, 'Resize Image: ', imageFile.name)
      const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
      CoreUI.fun_closeNotificationLoading(keyLoading);
      return {
        origin: compressedFile,
        base64: base64,
      }
    } catch (_error) {
      CoreUI.fun_closeNotificationLoading(keyLoading);
      return null;
    }
  }

  static fun_buildAnswer(array) {
    let result = '';
    for (let i = 0; i < array.length; i++) {
      result += array[i];
      if (i !== array.length - 1)
        result += ';vsl;';
    }
    return result;
  }

  static fun_getTimeRemaining = (endtime, totalInput) => {
    let total = 0;
    if (totalInput) total = totalInput;
    else total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }
}