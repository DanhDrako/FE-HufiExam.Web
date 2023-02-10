import loadable from '@loadable/component';
import { GaurdEntity, UserLoginEntity } from './entities';
import { Apis } from './utils/Apis';
import { ImageUploadKeys, LocalStorageKeys } from './utils/keys';
import { Tag } from 'antd';
import { CheckCircleOutlined, FireOutlined, MehOutlined } from '@ant-design/icons';
import RoleUser from './utils/keys/RoleUserKey';
import LoadingComponent from '../components/common/LoadingComponent';

// PUBLIC MODULE
const PublicModulesLoad = loadable.lib(() => import('./PublicModules'));

// COREUI MODULE
const CoreUILoad = loadable.lib(() => import('./CoreUI'));

class FACTORY {
  static IMAGE_LOADING = '/image/gif/img-loading.svg';
  static PRIMARY_COLOR = '#48ff00';
  static TOOLTIP_COLOR = 'purple';
  static COLOR_DAY_SEC = '#077300';
  static COLOR_NIGHT_SEC = '#e59ef3';

  // GET PUBLIC MODULE
  static GET_PUBLIC_MODULES = async () => {
    var PublicModules = await PublicModulesLoad.load();
    PublicModules = PublicModules.PublicModules;
    return PublicModules;
  };

  // GET COREUI
  static GET_CORE_UI = async () => {
    var CoreUI = await CoreUILoad.load();
    CoreUI = CoreUI.CoreUI;
    return CoreUI;
  };

  static fun_getUserLoginLocalStorage = () => {
    const userName = localStorage.getItem(LocalStorageKeys.USERNAME);
    if (!userName)
      return null;
    const role = localStorage.getItem(LocalStorageKeys.ROLE);
    const userId = localStorage.getItem(LocalStorageKeys.USERID);
    const token = localStorage.getItem(LocalStorageKeys.TOKEN);
    const user = new UserLoginEntity();
    user.userName = userName;
    user.role = role;
    user.userId = userId;
    user.token = token;

    return user;
  }

  static fun_getImageViewFromServer = (imageName, uploadType) => {
    let host = Apis.API_HOST + Apis.API_TAILER.IMG_VIEW;
    if (Apis.NODE_ENV_PROD)
      host = `${Apis.API_HOST.substring(0, Apis.API_HOST.indexOf('/api'))}/images/`;
    switch (uploadType) {
      case ImageUploadKeys.SERVER:
        return host + imageName;
      case ImageUploadKeys.IMGUR_COM:
        return Apis.API_IMGUR_VIEW + imageName;
      case ImageUploadKeys.IPFS:
        return Apis.APT_IPFS_HEAD + imageName;
      case ImageUploadKeys.FACEBOOK_AVATAR:
      case ImageUploadKeys.GOOGLE_AVATAR:
        return imageName;

      default:
        return host + imageName;
    }
  }

  static fun_getTokenAndRefreshTokenLocalStorage = () => {
    const token = localStorage.getItem(LocalStorageKeys.TOKEN);
    const refresh = localStorage.getItem(LocalStorageKeys.TOKEN_REFRESH);
    if (!token || !refresh)
      return null;
    const result = new GaurdEntity();
    result.token = token;
    result.refresh = refresh;
    return result;
  }

  static fun_getGl_loading(isLoading) {
    if (isLoading)
      return (
        <LoadingComponent />
      );
  }

  static fun_tryParseJSON(input) {
    try {
      return JSON.parse(input);
    } catch (_e) {
      return null;
    }
  }

  static fun_parseNumberOrZero(strNum) {
    try {
      const num = Number.parseFloat(strNum);
      if (String(num) === 'NaN')
        return 0;
      return num;
    } catch (_e) {
      return 0;
    }
  }

  static fun_formatCurrency(number) {
    const nb = FACTORY.fun_parseNumberOrZero(number);
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND',
    });

    return formatter.format(nb);
  }

  static fun_random1To100 = () => {
    return Math.floor(Math.random() * 100) + 1;
  }

  static fun_randomBetwent(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static fun_mapNumberToLetter = (number) => {
    switch (number) {
      case 0:
        return 'A. ';
      case 1:
        return 'B. ';
      case 2:
        return 'C. ';
      case 3:
        return 'D. ';
      case 4:
        return 'E. ';
      case 5:
        return 'F. ';
      case 6:
        return 'G. ';

      default:
        return 'Z. ';
    }
  };

  static fun_getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  static fun_getAvatarImageView = (avatar, avatarUploadType) => {
    let src = avatar;
    if (!src)
      return '/image/authors/author1.png';
    return FACTORY.fun_getImageViewFromServer(src, avatarUploadType);
  }

  static fun_getRoleUI(role) {
    switch (role) {
      case RoleUser.ADMIN:
        return <Tag className='tag-sec'><FireOutlined /> ADM</Tag>
      case RoleUser.MOD:
        return <Tag className='tag-sec'><CheckCircleOutlined /> MOD</Tag>
      default:
        return <Tag className='tag-pr'><MehOutlined /> MBR</Tag>
    }
  }

  static fun_getPercent(number, isLoading, max) {
    if (number === 0 && !isLoading) return 100;
    return number * 100 / max;
  }

  static fun_getDateString = (date) => {
    try {
      let dateString = new Date(date).toUTCString();
      dateString = dateString.substring(0, dateString.indexOf(':') - 2)
      return dateString;
    } catch (e) {
      return 'ERROR: getDateString';
    }
  }

  static fun_trimString = (strTrim, trimLength) => {
    if (!strTrim)
      return 'Load strTrim Failure!';
    if (strTrim.length > 12) {
      if (trimLength)
        return strTrim.substring(0, trimLength) + '...' + strTrim.substring(strTrim.length - trimLength, strTrim.length);
      return strTrim.substring(0, 6) + '...' + strTrim.substring(strTrim.length - 9, strTrim.length);
    }
    return strTrim;
  }

  static fun_changeToSlug = (title) => {
    var slug = '';
    slug = title.toLowerCase();
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    // eslint-disable-next-line 
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    slug = slug.replace(/ /gi, "-");
    // eslint-disable-next-line 
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    // eslint-disable-next-line 
    slug = slug.replace(/\-\-\-\-/gi, '-');
    // eslint-disable-next-line 
    slug = slug.replace(/\-\-\-/gi, '-');
    // eslint-disable-next-line 
    slug = slug.replace(/\-\-/gi, '-');
    slug = '@' + slug + '@';
    // eslint-disable-next-line 
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    return slug;
  }
}

export default FACTORY;