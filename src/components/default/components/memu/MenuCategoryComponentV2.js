import { ClearOutlined, SearchOutlined, SortAscendingOutlined, TagsOutlined, UnorderedListOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import FACTORY from '../../../../common/FACTORY';
import { ActionType } from '../../../../common/utils/actions-type';
import { Apis } from '../../../../common/utils/Apis';
import { MessageKeys, NotificationKeys } from '../../../../common/utils/keys';
import { Link } from 'react-router-dom';
import { Checkbox, Input, Tooltip } from 'antd';
import NumberSerchComponent from '../../../common/NumberSerchComponent';
import SelectCategoryComponent from '../../../admin-v2/right/components/components/SelectCategoryComponent';
import SelectTagsComponents from '../../../admin-v2/right/components/components/SelectTagNameComponent';
import { FacebookProvider, Group } from 'react-facebook';
import AdsGoogleFixed from '../../../common/AdsGoogle/AdsGoogleFixed';

// import loadable from '@loadable/component';
// const SelectCategoryComponent = loadable(() => import('../../../admin-v2/right/components/components/SelectCategoryComponent'));
// const SelectTagsComponents = loadable(() => import('../../../admin-v2/right/components/components/SelectTagNameComponent'));

class MenuCategoryComponentV2 extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      listCate: null,
      listTags: null,
      isBlackMarket: false,
      defaultCateSelected: null,
      defaultTagsSelected: null,
      checkBoxNewestOldest: -1,
      checkBoxStartHeart: -1,
      filterCount: 0,
    }
    this.state = {
      ...this.initialState,
    }
    this.dispatch = this.props.dispatch;
  }

  componentDidMount() {
    this.loadListCate();
    this.loadListTags();
  }

  async loadListCate() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    let url = Apis.API_HOST + Apis.API_TAILER.CATE;
    url = url.substring(0, url.length - 1);
    url += `?isBlackMarket=${this.props.isBlackMarket || false}`;
    const dataRes = await PublicModules.fun_get(
      url,
    );
    // error ?
    if (!dataRes.success) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'T???i th??? lo???i b??? l???i',
        message: MessageKeys.CHECK_CONNECTION,
      });
      return;
    }

    // insert all select
    const list = [];
    list.push({
      id: 0,
      name: 'T???t c??? th??? lo???i',
    });
    list.push(...dataRes.data);
    let cateSelect = list[0];
    this.setState({
      listCate: list,
      defaultCateSelected: cateSelect,
    }, () => {
      this.applyFilter({ cate: cateSelect });
    });
  }

  async loadListTags() {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    let url = Apis.API_HOST + Apis.API_TAILER.TAG_NAME;
    url = url.substring(0, url.length - 1);
    url += `?isBlackMarket=${this.props.isBlackMarket || false}`;
    const dataRes = await PublicModules.fun_get(
      url,
    );
    // error ?
    if (!dataRes.success) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'T???i tags b??? l???i',
        message: MessageKeys.CHECK_CONNECTION,
      });
      return;
    }

    this.setState({
      listTags: dataRes.data,
    });
  }

  applyFilter(append) {
    const filter = { ...this.props.filterPost, ...append }
    this.dispatch({
      type: ActionType.POST_FILTER_UPDATE,
      value: filter
    });
    this.countFilter(filter);
  }

  countFilter(filter) {
    let count = 0;
    if (filter.keyWord !== '')
      count += 1;
    if (filter.cate !== 0 && filter.cate.id !== 0)
      count += 1;
    if (filter.tags.length !== 0)
      count += 1;
    if (filter.sort !== 0)
      count += 1;
    if (filter.start)
      count += 1;
    if (filter.heart)
      count += 1;

    this.setState({ filterCount: count });
  }

  selectCateChange(cateId) {
    const cate = this.state.listCate.find((v) => String(v.id) === String(cateId));
    this.setState({
      defaultCateSelected: cate,
    }, () => {
      this.applyFilter({ cate: cate, page: 1 });
    });
  }

  selectTagsChange(tags) {
    this.setState({ defaultTagsSelected: tags }, () => {
      this.applyFilter({ tags: tags, page: 1 });
    });
  }

  tbKeyWordChange(e) {
    let value = e.target.value || '';
    // let value = e;

    value = value.trim();
    if (value === this.props.filterPost.keyWord) return;
    this.applyFilter({ keyWord: value, page: 1 });
  }

  checkBoxNewestOldestChange(e) {
    const name = e.target.name;
    // const checked = e.target.checked;
    if (name === 'ck_00')
      this.setState({ checkBoxNewestOldest: 0 }, () => {
        this.applyFilter({ sort: 0 });
      });
    else if (name === 'ck_01')
      this.setState({ checkBoxNewestOldest: 1 }, () => {
        this.applyFilter({ sort: 1 });
      });

    else if (name === 'ck_02')
      this.setState({ checkBoxStartHeart: 0 }, () => {
        this.applyFilter({ start: true, heart: false });
      });
    else if (name === 'ck_03')
      this.setState({ checkBoxStartHeart: 1 }, () => {
        this.applyFilter({ start: false, heart: true });
      });
  }

  btnClearClicked() {
    this.setState({
      defaultCateSelected: this.state.listCate && this.state.listCate.length !== 0 ? this.state.listCate[0] : null,
      defaultTagsSelected: null,
      checkBoxNewestOldest: -1,
      checkBoxStartHeart: -1,
      filterCount: 0,
    }, () => {
      this.dispatch({
        type: ActionType.POST_FILTER_RESET
      });
      this.loadListTags();
    });
  }

  getWidthEmbedGroup() {
    const elmnt = document.getElementById("block-facebook-group");
    if (!elmnt) return 200;
    const width = elmnt.offsetWidth - (16 * 2);
    return width;
  }

  render() {
    if (this.state.isBlackMarket)
      return (
        <Redirect to='/black-market' />
      );
    return (
      <div className='menu-categories bg-border'>
        <div className='cate-focus fw-bold'>
          <NumberSerchComponent />
          <div className='float-end'>
            <Tooltip
              color={FACTORY.TOOLTIP_COLOR}
              title='X??a b??? l???c'
            >
              <span
                onClick={() => this.btnClearClicked()}
                className='_text-sec'
                role='link'>
                <ClearOutlined />
                {this.state.filterCount !== 0 ? <span>
                  &nbsp;{this.state.filterCount}
                </span> : ''}
              </span>
            </Tooltip>
          </div>
          <br />
        </div>
        <div className='p-2 mb-2'>
          <div className='row'>
            <div className='col-9'>
              <p className='mb-1 fw-bold'>
                <SearchOutlined className='m-2 mt-0 mb-0' />
                Nh???p t??? t??m ki???m
              </p>
            </div>
            {/* <div className='col-3'>
              <span className="spinner-grow spinner-grow-sm m-2 mt-0 mb-0 _text-sec" role="status">
                <span className="visually-hidden">Loading...</span>
              </span>
            </div> */}
          </div>
          <div className='mb-2'>
            <figcaption className="blockquote-footer m-2">
              Nh???p t??? kh??a ????? t??m, ?????ng qu??n ch???n th??? lo???i n???a nh??.
            </figcaption>
          </div>
          <Input.Search
            size='large'
            onChange={(e) => this.tbKeyWordChange(e)}
            // onSearch={(e) => this.tbKeyWordChange(e)}
            type="search"
            placeholder="T??m b??i vi???t" />
        </div>
        {/* {Apis.IS_SHOW_ADS !== '0' ?
          <div className='p-2 mb-2'>
            <AdsGoogleFixed
              slot="3842021678"
            />
          </div> : ''} */}
        <div className='p-2 mb-2'>
          <p className='mb-1 fw-bold'>
            <UnorderedListOutlined className='m-2 mt-0 mb-0' />
                Ch???n th??? lo???i l???c
                </p>
          <div className='mb-2'>
            <figcaption className="blockquote-footer m-2">
              S??? t??m ki???m theo th??? lo???i t???i ????y.
                </figcaption>
          </div>
          <SelectCategoryComponent
            onChange={(e) => this.selectCateChange(e)}
            defaultValue={this.state.defaultCateSelected}
            listCate={this.state.listCate} className='form-control' />
        </div>
        <div className='p-2'>
          <p className='mb-1 fw-bold'>
            <TagsOutlined className='m-2 mt-0 mb-0' />
                T??m th??? ???? g???n
                </p>
          <div className='mb-2'>
            <figcaption className="blockquote-footer m-2">
              C?? th??? c??c b??i vi???t theo th??? ???? g???n n???u b???n mu???n.
                </figcaption>
          </div>
          <SelectTagsComponents
            defaultValue={this.state.defaultTagsSelected}
            listTags={this.state.listTags}
            onChange={(e) => this.selectTagsChange(e)}
            className='form-control' />
        </div>
        <div className='p-2'>
          <p className='mb-1 fw-bold'>
            <SortAscendingOutlined className='m-2 mt-0 mb-0' />
                S???p x???p
                </p>
          <div className='mb-2'>
            <figcaption className="blockquote-footer m-2">
              L??u ??: l?????c ????nh gi?? ch??? ??p d???ng cho 1 trang kh??ng ??p d???ng tr??n to??n b???.
                </figcaption>
          </div>
          <div className='row mt-3'>
            <div className='col-6'>
              <Checkbox
                name='ck_00'
                checked={this.state.checkBoxNewestOldest === 0}
                onChange={(e) => this.checkBoxNewestOldestChange(e)}>
                <i className="far fa-clock">&nbsp;</i> m???i nh???t
              </Checkbox>
            </div>
            <div className='col-6'>
              <Checkbox
                name='ck_01'
                checked={this.state.checkBoxNewestOldest === 1}
                onChange={(e) => this.checkBoxNewestOldestChange(e)}>
                <i className="far fa-clock">&nbsp;</i> c??? nh???t
              </Checkbox>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col-6'>
              <Checkbox
                checked={this.state.checkBoxStartHeart === 0}
                name='ck_02'
                onChange={(e) => this.checkBoxNewestOldestChange(e)}
              >
                <i className="far fa-star">&nbsp;</i>Nhi???u nh???t
              </Checkbox>
            </div>
            <div className='col-6'>
              <Checkbox
                checked={this.state.checkBoxStartHeart === 1}
                name='ck_03'
                onChange={(e) => this.checkBoxNewestOldestChange(e)}
              >
                <i className="far fa-heart">&nbsp;</i>Nhi???u nh???t
              </Checkbox>
            </div>
          </div>
        </div>
        <hr />
        <div className='p-2 mb-3'>
          <p className='mb-1 fw-bold'>
            <i className="fas fa-hand-peace m-2 mt-0 mb-0"></i>
              H??y ????ng g??p nh??.
                </p>
          <div className='mb-2'>
            <figcaption className="blockquote-footer m-2" style={{ textAlign: 'justify' }}>
              Ch??ng t??i. Kh??ng, ch??ng ta ??ang r???t c???n nh???ng b??i vi???t hay t??? c??c b???n,
              h??y c???ng hi???n nh???ng b??i vi???t hay ?????n cho c??c b???n kh??c nh?? thanks.
                </figcaption>
          </div>
        </div>
        <div className='p-3'>
          <Link
            to='/user-post'
          >
            <button
              className='btn-ds outline block'
            >
              ????ng b??i vi???t
            </button>
          </Link>
        </div>
        {/* <hr /> */}
        {/* <div id='block-facebook-group' className='p-3'>
          <p className='mb-1 fw-bold'>
            <i className="fas fa-users m-2 mt-0 mb-0"></i>
              Nh??m tr??n facebook.
                </p>
          <div className='mb-3'>
            <figcaption className="blockquote-footer m-2" style={{ textAlign: 'justify' }}>
              K???t n??i m???i ng?????i tr??n nh??m facebook, ????? thu???n ti???n chia s??? v?? nh???n th??ng b??o h??n nh??.
                </figcaption>
          </div>
          <FacebookProvider appId="1267751853640304">
            <Group
              href="https://www.facebook.com/groups/myhufier.all.in.one"
              width={this.getWidthEmbedGroup()}
              showSocialContext={true}
              showMetaData={true}
              skin="light"
            />
          </FacebookProvider>
        </div> */}

        {/* <div className='text-center'>
          <img src='/image/logos/logo-200.png' alt='logo-icon' width='140px' height='140px' />
        </div> */}

        {/* <div className='text-center mt-3'>
          <i className="fas fa-book-reader" style={{ fontSize: '10px' }}></i>
          &nbsp;
          <i className="fas fa-book-reader" style={{ fontSize: '20px' }}></i>
          &nbsp;
          <i className="fas fa-book-reader" style={{ fontSize: '10px' }}></i>
        </div>
        <p className='text-center author-name m-3'>
          c???ng ?????ng ng?????i h???c HUFI
        </p> */}

        {/* <hr /> */}

        {/* <div className='p-2 mb-2'>
          <AdsGoogleFixed
            slot="6066512727"
          />
        </div> */}
        {/* <hr />
        <div className='p-2 mb-2'>
          <AdsGoogleFixed
            slot="1450472680"
          />
        </div> */}
      </div >
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    filterPost: state.filterPost,
  }
}

export default connect(mapStateToProps)(MenuCategoryComponentV2);