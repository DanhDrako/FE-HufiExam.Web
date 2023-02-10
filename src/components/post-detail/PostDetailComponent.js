import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import FACTORY from '../../common/FACTORY';
import { Apis } from '../../common/utils/Apis';
import { MessageKeys, NotificationKeys } from '../../common/utils/keys';
import AdsGoogleFixed from '../common/AdsGoogle/AdsGoogleFixed';
import LoadingComponent from '../common/LoadingComponent';
import ContentLeftComponent from './components/ContentLeftComponent';
import LatestPostsComponent from './components/LatestPostsComponent';

// import loadable from '@loadable/component';
// import { LoadingOutlined } from '@ant-design/icons';
// const LoadingComponent = loadable(() => import('../common/LoadingComponent'));
// const ContentLeftComponent = loadable(() => import('./components/ContentLeftComponent'), {
//   fallback: <LoadingOutlined />
// });
// const LatestPostsComponent = loadable(() => import('./components/LatestPostsComponent'));

// const dom = `
//   <div class="ns-546iv-e-13" x-ns-546iv-e="13" x-overflow-forbidden="xy" x-remove="false"><a class="ns-546iv-e-14 cta-outer cta-outer-animated common-animation-pattern" data-asoch-targets="ad0,btnClk" href="https://www.googleadservices.com/pagead/aclk?sa=L&amp;ai=C5if7ZGQ9Yr35DYrGqQGKsICAB8yNjdxnm-bz74UMuba_-_EaEAEg3oH7SmDBtfoNoAHLm_bhA8gBAagDAcgDwwSqBNIBT9CoojgM6AOh4SIIiXDhKvL7ZxpZoyQguewc5bwC_UrUFMSm9ybdBEBUyfmSP18Ek16ifPrlUc-k9hG9SuccYLJvTdCfK4aeVtVAh28XPEiSaGqacdCCAypLcY5mf4ZumFlsuUyyVEFGtZNAogP6pq8vcc3YSjrhte4mF6_4OQWZbvPayKqlct7UsrqHCChbC6CElr9itHzGZzbqMANGMrZrUD1zBlPDZXeO9n4uw_9UG4GlzG4ho0zSWkFTu1W0Hu0nMHW1FYIaK0oFKT0vxSgawATAhKXdmQOQBgGgBlGAB53kiR6IBwGQBwKoB47OG6gHk9gbqAfulrECqAf-nrECqAeko7ECqAfVyRuoB6a-G6gH89EbqAeW2BuoB6qbsQKoB9-fsQLYBwHSCAYIABACGBqxCdqSxgM1Z1rQgAoBmAsByAsBuAwB2BMCiBQB0BUBmBYB-BYBgBcB&amp;ae=1&amp;num=1&amp;cid=CAMSeQClSFh3cPnvbTotysvsIVBVB3RPcYDCM7UhVtr_sUnClSH8cjxyJvA47Swhb7Y1d5Wp7l7GsNS8S-YDUpHrfLhH0yvHSxI8ZX8FYyG-L2HyZ2QJTpaJoPVxxdTPwL08XeURwsX-k6YFLUz9hhY4i5MI9XGhBUxxnc0&amp;sig=AOD64_0aChodHZJzaV1q0mARxqj9p-OqeA&amp;client=ca-pub-1245743565916746&amp;nb=8&amp;adurl=https://www.digitalocean.com/try/developer-brand%3Futm_campaign%3Dglobal_brand_rtg-community_en_display%26utm_adgroup%3Dcommunity_visitors_all_30_days%26_keyword%3D%26_device%3Dc%26_adposition%3D%26utm_content%3Dconversion%26utm_medium%3Ddisplay%26utm_source%3Dgoogle%26gclid%3DCjwKCAjwrfCRBhAXEiwAnkmKmbpV3jtf3POtXTJV-WxNYJKyhy0QG59O3Tw7ce0j-4mt-f5d80XV9RoC8vcQAvD_BwE" target="_top" title="digitalocean.com" x-ns-546iv-e="14" x-overflow-forbidden="xy"><div class="ns-546iv-e-15 cta-background-wrapper" x-ns-546iv-e="15"><div class="ns-546iv-e-16 cta-background cta-background-animated common-animation-pattern" x-ns-546iv-e="16" x-overflow-forbidden="xy"></div></div><div class="ns-546iv-e-17 cta-button animated" x-ns-546iv-e="17" x-overflow-forbidden="xy"><div class="ns-546iv-e-18 cta-text animated cta-text-animated common-animation-pattern" x-ns-546iv-e="18" x-overflow-forbidden="xy"><span class="ns-546iv-e-19" dir="auto" x-ns-546iv-e="19" x-score="1">OPEN</span></div></div></a></div>
// `;

const WAIT_FOR_DOWNLOAD = Apis.WAIT_FOR_DOWNLOAD; // 10s

class PostDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postDetail: {},
      listSame: [],
      loading: false,
      loadingSamePost: false,
      goHome: false,

      waitForDownload: WAIT_FOR_DOWNLOAD,
    };

    this.timerWaitForDownload = null;
  }

  startTimerWaitForDownload() {
    if (this.timerWaitForDownload) return;
    this.timerWaitForDownload = setInterval(() => {
      const newTime = this.state.waitForDownload - 1;
      this.setState({ waitForDownload: newTime }, () => {
        if (newTime <= 0) {
          clearInterval(this.timerWaitForDownload);
        }
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerWaitForDownload);
  }

  componentDidMount() {
    this.loadDetailPost(this.props.params);
    window.scrollTo(0, 0);
  }

  componentWillReceiveProps(nextProps) {
    this.loadDetailPost(nextProps.params);
  }

  componentDidUpdate(_prevProps, _prevState) {
    if (this.state.loading || this.state.loadingSamePost
      || this.state.waitForDownload <= 0
    ) return;
    this.startTimerWaitForDownload();
  }

  async loadDetailPost(params) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    this.setState({
      loading: true,
      loadingSamePost: true,
    });
    // get post from db
    PublicModules.fun_get(
      Apis.API_HOST + Apis.API_TAILER.POST + params.id,
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Tải chi tiết bài viết lỗi',
          message: MessageKeys.CHECK_CONNECTION,
        });
        this.setState({
          loading: false,
        });
        return;
      }
      // set state
      this.setState({
        postDetail: dataRes.data,
      }, () => {
        window.scrollTo(0, 0);
      });

      // load same post
      this.loadSamePost(dataRes.data.cate);
    });
  }

  async loadSamePost(cate) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (!cate) return;
    PublicModules.fun_get(
      Apis.API_HOST + Apis.API_TAILER.POST_FILTER + `?cate=${cate.id}&limit=5`
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Tải bài viết liên quan bị lỗi',
          message: MessageKeys.CHECK_CONNECTION,
        });
        this.setState({
          loading: false,
          loadingSamePost: false,
        });
        return;
      }
      this.setState({
        listSame: dataRes.data,
        loading: false,
        loadingSamePost: false,
      });
    });
  }

  getListSamePostUI() {
    const list = this.state.listSame;
    if (!list || list.length === 0) return;
    const newList = list.map((v, k) => {
      return (
        <div key={k}>
          <div className='row p-2 hover'>
            <div className='col-5 p-0 m-0'>
              <Link to={"/post/" + v.slug + '.' + v.id} className="img-news-df float-start me-3 position-relative d-block">
                <span style={{ margin: '0px 0px 0px 7px' }}>
                  <img
                    alt='img same post'
                    src={FACTORY.fun_getImageViewFromServer(v.imageBanner, v.imageUploadType)}
                    className="w-100 img-fluid" />
                </span>
              </Link>
            </div>
            <div className='col-7 p-0 m-0'>
              <p
                style={{ maxHeight: '47px', overflow: 'hidden' }}
                className="mb-0 text-capitalize fw-bold"><Link to={"/post/" + v.slug + '.' + v.id}>
                  {v.title}
                </Link></p>
              <p
                style={{ maxHeight: '70px', overflow: 'hidden' }}
              >{v.description}</p>
            </div>
          </div>
        </div>
      );
    });

    // insert ads
    // newList.splice(1, 0, <AdsGoogleFixed key='1_2949055488' slot='2949055488' height='60px' />);
    //newList.push(<AdsGoogleFixed key='5_3842021678' slot='3842021678' width='330px' height='102px' />);
    return newList;
  }

  getGl_loading() {
    if (this.state.loading)
      return (
        <LoadingComponent />
      );
  }

  btnNavChange(e) {
    const task = e.target.value;
    switch (task) {
      case 'HOME':
        this.setState({
          goHome: true,
        });
        break;

      default:
        break;
    }
  }

  getCategoryName() {
    const post = this.state.postDetail;
    if (!post || !post.cate) return;
    const name = post.cate.name.toString();
    return name;
  }

  render() {
    if (this.state.goHome)
      return (
        <Redirect to='/' />
      );
    return (
      <>
        {this.getGl_loading()}
        <main className="position-relative">
          <div className="container">
            {/*Body news*/}
            <div className="main-news-d pb-5">
              <div className="row">
                {/* col left */}
                <div className="col-lg-8 col-12 p-2">
                  <div className='mb-4 bg-border'>
                    <ContentLeftComponent
                      waitForDownload={this.state.waitForDownload}
                      postDetail={this.state.postDetail} />
                  </div>
                </div>
                {/* col right */}
                <div className="col-lg-4 col-12 p-2">
                  <div className="p-2 p-md-3 mb-3 bg-border">
                    <div className="last-post p-2">
                      <h2 className="pt-md-0 pt-3">Mới nhất</h2>
                      <div id='id-latest-post'>
                        <LatestPostsComponent />
                      </div>
                    </div>
                    {this.getListSamePostUI()}
                  </div>
                </div>
              </div>
            </div>
            {/*End body news*/}
            <div className="clear" />
          </div>
        </main>
      </>
    );
  }
}

export default PostDetailComponent;