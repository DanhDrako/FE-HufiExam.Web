import React, { Component } from 'react';
import { Checkbox, Skeleton, Space, Tooltip } from 'antd';
import { Apis } from '../../../../common/utils/Apis';
import { MessageKeys, NotificationKeys } from '../../../../common/utils/keys';
import { connect } from 'react-redux';
import { ActionType } from '../../../../common/utils/actions-type';
import FACTORY from '../../../../common/FACTORY';
import CardComponent from './components/CardComponent';
import CardSaleComponent from './components/CardSaleComponent';
import PagingComponent from '../../../common/PagingComponent';
import ButtonGoToFacebook from '../../../common/ButtonGoToFacebook';
import AdsGoogleFixed from '../../../common/AdsGoogle/AdsGoogleFixed';
import { FacebookFilled, MailFilled } from '@ant-design/icons';

// import loadable from '@loadable/component';
// import { LoadingOutlined } from '@ant-design/icons';
// const CardComponent = loadable(() => import('./components/CardComponent'), {
//   fallback: <LoadingOutlined />
// });
// const CardSaleComponent = loadable(() => import('./components/CardSaleComponent'), {
//   fallback: <LoadingOutlined />
// });
// const PagingComponent = loadable(() => import('../../../common/PagingComponent'), {
//   fallback: <LoadingOutlined />
// });

class PostsComponent extends Component {
  constructor(props) {
    super(props);
    const userLoged = FACTORY.fun_getUserLoginLocalStorage();
    this.userId = null;
    if (userLoged) this.userId = userLoged.userId;
    this.state = {
      datas: [],
      loadingFilter: false,
      total: null,
    };
    this.dispatch = this.props.dispatch;
    this.CoreUI = null;
    this.PublicModules = null;

    // ads google
    this.adsSlots = [
      '2847121314',
      '2949055488',
      '1996239929',
      '8009810476',
      '6696728809',
      '3205395723',
      '6261614533',
      '6953069042',
      '3635451194',
      '2322369523',
    ];
  }

  async filterPosts(urlRequest, isDone) {
    if (!this.PublicModules)
      this.PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    if (!this.CoreUI)
      this.CoreUI = await FACTORY.GET_CORE_UI();
    if (this.userId && !isDone)
      urlRequest += `&userId=${this.userId}`;
    if (this.props.isBlackMarket && !isDone) {
      urlRequest += `&cate=-1`;
    }
    const dataPosts = await this.PublicModules.fun_get(
      urlRequest,
    );
    // error ?
    if (!dataPosts.success) {
      this.CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Tải bài viết bị lỗi',
        message: MessageKeys.CHECK_CONNECTION,
      });
      this.setState({
        loadingFilter: false,
      }, () => {
        this.dispatch({
          type: ActionType.SEARCH_POST_NUM_UPDATE,
          value: {
            isLoading: false,
            number: 0,
          }
        });
      });
      return;
    }

    this.setState({
      datas: dataPosts.data,
      loadingFilter: false,
      total: dataPosts.total,
    }, () => {
      this.dispatch({
        type: ActionType.SEARCH_POST_NUM_UPDATE,
        value: {
          isLoading: false,
          number: dataPosts.total,
        }
      });
    });
  }

  buildTagsQuery(listTags) {
    let tags = '';
    listTags.forEach(t => {
      tags += `&tags=${t}`;
    });
    return tags;
  }

  componentDidMount() {
    const filter = this.props.filterPost;
    this.urlRequestDefault = Apis.API_HOST + Apis.API_TAILER.POST_FILTER + `?keyWord=${filter.keyWord}&page=${filter.page}&limit=${filter.limit}`;
    if (this.props.isForkReload)
      this.filterPosts(this.urlRequestDefault, false);
  }

  componentWillUnmount() {
    this.dispatch({
      type: ActionType.POST_FILTER_RESET,
    });
  }

  componentWillReceiveProps(nextProps) {
    let user = nextProps.user;
    if (!user || !user.userId)
      user = FACTORY.fun_getUserLoginLocalStorage();
    const filter = nextProps.filterPost;

    // check is reload ?
    const prvFilter = this.props.filterPost;
    if (prvFilter.cate === filter.cate
      && prvFilter.keyWord === filter.keyWord
      && prvFilter.page === filter.page
      && prvFilter.limit === filter.limit
      && prvFilter.tags === filter.tags
      && prvFilter.sort === filter.sort
      && prvFilter.start === filter.start
      && prvFilter.heart === filter.heart
    )
      return;

    // isBlackMakret height priority.
    let cateId = -1;// -1 = blackMarket
    if (!this.props.isBlackMarket || (filter.cate && filter.cate.id !== 0)) {
      cateId = filter.cate;
      if (filter.cate.id != null)
        cateId = filter.cate.id;
    }
    // load data from db
    this.setState({
      loadingFilter: true,
    }, () => {
      this.dispatch({
        type: ActionType.SEARCH_POST_NUM_UPDATE,
        value: {
          isLoading: true,
          number: 0,
        }
      });
    });
    const tagsQuery = this.buildTagsQuery(filter.tags);

    let urlRequest = Apis.API_HOST + Apis.API_TAILER.POST_FILTER + `?keyWord=${filter.keyWord}&cate=${cateId}${tagsQuery}&sort=${filter.sort}&start=${filter.start}&heart=${filter.heart}&page=${filter.page}&limit=${filter.limit}`;
    if (user && user.userId) {
      urlRequest += `&userId=${user.userId}`;
    }
    this.filterPosts(urlRequest, true);
  }

  showInfoExam() {
    if (!this.CoreUI) return;
    this.CoreUI.fun_showNotification({
      type: NotificationKeys.INFO,
      title: 'Đã sẵn sàng luyện thi',
      message: 'Nhấn vào nút xem chi tiết, và luyện thi',
    });
  }

  getAdsInCard(k, own) {
    const des = [];
    if (des.includes(k))
      return (
        <AdsGoogleFixed
          slot={this.adsSlots[FACTORY.fun_randomBetwent(0, this.adsSlots.length)]}
          height='60px'
        />
      );

    return (
      <div
        style={{ width: '100%', height: 'auto' }}
        className='text-center'
      >
        <p
          style={{
            backgroundColor: 'var(--cl-opa)',
            borderBottom: '1px solid var(--cl-border-light)',
            borderTop: '1px solid var(--cl-border-light)',
          }}
          className='m-0 p-2'>
          <span
            className='text-capitalize'
          >
            {/* <i className="far fa-heart" style={{ fontSize: '5px' }}>&nbsp;</i>
            <i className="far fa-heart" style={{ fontSize: '10px' }}>&nbsp;</i>
            <i className="far fa-heart"></i> */}
            &nbsp;Tác giả: <span className='_text-sec fw-bold'> - {own.displayName || own.username} </span>&nbsp;
            <i className="far fa-heart">&nbsp;</i>
            {/* <i className="far fa-heart" style={{ fontSize: '10px' }}>&nbsp;</i>
            <i className="far fa-heart" style={{ fontSize: '5px' }}>&nbsp;</i> */}
          </span>
        </p>
        {/* <p
          style={{ height: 'auto', overflowY: 'hidden' }}
          className='text-capitalize m-0 p-2'>
          Bạn thắc mắc liên hệ: {
            own.linkFacebook ? <a href={own.linkFacebook} className='_text-thr' target='blank'><FacebookFilled /> Facebook, </a> :
              <Tooltip className='_text-thr' title='Tác giả chưa cập nhật Link Facebook'>Facebook, </Tooltip>
          } 
          <a className='_text-thr' href={'mailto:' + own.email}><MailFilled /> Gmail.</a>
        </p> */}
      </div>
    );
  }

  async onExamAreadyChange(checked, postId) {
    if (!checked) return;
    const isConfirm = await this.CoreUI.fun_showConfirm({
      title: 'Xác nhận: Nhập trắc nghiệm cho bài viết này ?',
      message: 'Sau khi hành động này được xác nhận, bài viết này sẽ sãn sàng trong phần thi thử.',
    });
    if (!isConfirm) return;

    const dataRes = await this.PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.QUESTION_ANSWER,
      {
        postId: postId,
        q: 'Câu hỏi mặt định (sẽ bị xóa)',
        a: 'Đáp án A;vsl;Đáp án B;vsl;Đáp án C;vsl;Đáp án D',
        qa: 2,
      },
      this.PublicModules.fun_getConfigBearerDefault({}),
    );
    if (!dataRes.success) {
      this.CoreUI.fun_showNotification({
        message: 'Thêm câu hỏi bị lỗi, hãy thử lại.',
      });
      return;
    }
    this.filterPosts(this.urlRequestDefault, true);
  }

  getExamAready(post) {
    if (post.countQuestion)
      return (
        <span
          onClick={() => this.showInfoExam()}
          role='link'>
          <Tooltip
            color={FACTORY.TOOLTIP_COLOR}
            title={`Ngân hàng: ${post.countQuestion} câu hỏi - Thi Thử`}
          >
            <div className='float-start'>
              {/* <i className="fas fa-tasks"></i> */}
              {/* <img src='/favicon.ico' alt='ready-exam' width='20px' height='20px'/> */}
              <i className="fab fa-teamspeak icon-header"></i>
            </div>
          </Tooltip>
        </span>)
    const role = this.props.user ? this.props.user.role : '';
    if (role === 'ADMIN')
      return (
        <div className='float-start'>
          <Checkbox onChange={(e) => this.onExamAreadyChange(e.target.checked, post.id)} />
        </div>
      );
    return '';
  }

  getCards() {
    if (!this.state.datas || this.state.loadingFilter)
      return [1, 2].map((k) => {
        return (
          <div key={k} className='col-xxl-6 col-xl-6 col-md-6 col-sm-12 col-12 p-0'>
            <div className=''>
              <div className='mb-3' >
                <Space>
                  <Skeleton.Avatar active />
                  <Skeleton.Button active shape='square' />
                  <Skeleton.Button active shape='square' />
                  <Skeleton.Input style={{ width: 200 }} active='true' />
                </Space>
                <div className='m-3'></div>
                <Space>
                  <Skeleton.Avatar active shape='square' size={100} />
                </Space>
                <div className='m-3'></div>
                <Space>
                  <Skeleton.Input style={{ width: 200 }} active='true' />
                </Space>
              </div>
            </div>
          </div>
        );
      });
    const datas = this.state.datas;
    return datas.map((v, k) => {
      if (this.props.isBlackMarket)
        return (
          <div key={k} className='col-xxl-2 col-xl-3 col-md-3 col-sm-12 col-12 p-0'>
            <div className='m-2 bg-border hover'>
              <CardSaleComponent userLoged={this.props.user} post={v} />
            </div>
          </div>
        );
      return (
        <div key={k} className='col-xxl-4 col-xl-6 col-md-6 col-sm-12 col-12 p-0'>
          <div className='m-2 bg-border hover'>
            <div className='cate-focus fw-bold _text-sec'>
              {v.cate.name}
              {this.getExamAready(v)}
              <div className='float-end'>
                <ButtonGoToFacebook
                  user={v.own}
                />
              </div>
              <br />
            </div>
            <CardComponent userLoged={this.props.user} post={v} />
            {this.getAdsInCard(k, v.own)}
          </div>
        </div>
      );
    });
  }

  onPageChange = (page, pageSize) => {
    this.dispatch({
      type: ActionType.POST_FILTER_UPDATE,
      value: { ...this.props.filterPost, page: page, limit: pageSize },
    });
    window.scrollTo(0, 0);
  };

  render() {
    return (
      <>
        <div className='row'>
          {this.getCards()}
        </div>
        <div className="w-100 mt-5 ">
          <PagingComponent
            total={this.state.total}
            onPageChange={(page, limit) => this.onPageChange(page, limit)}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    filterPost: state.filterPost,
    user: state.user.user,
  }
}

export default connect(mapStateToProps)(PostsComponent);