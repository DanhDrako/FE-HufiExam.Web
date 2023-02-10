import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FACTORY from '../../../common/FACTORY';
import { Apis } from '../../../common/utils/Apis';
import { MessageKeys, NotificationKeys } from '../../../common/utils/keys';
// import AdsGoogleFixed from '../../common/AdsGoogle/AdsGoogleFixed';
import SliderComponent from '../../common/SliderComponent';

// import loadable from '@loadable/component';
// const SliderComponent = loadable(() => import('../../common/SliderComponent'));

class LatestPostsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listLatest: [],
    };
    this.loadLatestPost();
  }

  async loadLatestPost() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    PublicModules.fun_get(
      Apis.API_HOST + Apis.API_TAILER.POST_FILTER + '?limit=5',
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Lỗi tải bài viết mới nhất',
          message: MessageKeys.CHECK_CONNECTION,
        });
        return;
      }
      this.setState({
        listLatest: dataRes.data,
      });
    });
  }

  getItemLatestPosts() {
    const list = this.state.listLatest;
    const newList = list.map((v) => {
      return (
        <div key={v.id} className="item p-1">
          <div style={{ height: '200px', overflowY: 'auto' }}>
            <Link to={"/post/" + v.slug + '.' + v.id} className="mb-3 d-block m-2 mt-0 mb-0 ml-0">
              <img
                src={FACTORY.fun_getImageViewFromServer(v.imageBanner, v.imageUploadType)}
                alt="" className="w-100" />
            </Link>
          </div>
          <h5 className='mt-2 text-capitalize'><Link to={"/post/" + v.slug + '.' + v.id} className="font-24">
            {v.title}
          </Link></h5>
        </div>
      );
    });

    // newList.splice(1, 0, <AdsGoogleFixed key='1_3842021678' slot="3842021678" />);
    // newList.splice(5, 0, <AdsGoogleFixed key='1_3842021678' slot="6066512727" />);
    return newList;
  }

  render() {
    return (
      <div id="latest-owl" className="lpost-owl owl-theme mb-3">
        <SliderComponent
          numDisplay={1}
          datas={this.getItemLatestPosts()}
        />
      </div>
    );
  }
}

export default LatestPostsComponent;