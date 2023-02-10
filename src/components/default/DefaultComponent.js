import React, { Component } from 'react';
import FACTORY from '../../common/FACTORY';
import { Modal } from 'antd';
import TitleForModel from '../home/header/components/TitleForModel';
import { FilterOutlined } from '@ant-design/icons';
import SlogantComponent from "../../components/common/SlogantComponent";
import MenuCategoryComponentV2 from './components/memu/MenuCategoryComponentV2';
import PostsComponent from './components/posts/PostsComponent';
import MenuCategoryComponent from './components/memu/MenuCategoryComponent';
// import AdsGoogleFixed from '../common/AdsGoogle/AdsGoogleFixed';

// import loadable from '@loadable/component';
// const MenuCategoryComponentV2 = loadable(() => import('./components/memu/MenuCategoryComponentV2'), {
//   fallback: <LoadingOutlined />
// });
// const PostsComponent = loadable(() => import('./components/posts/PostsComponent'), {
//   fallback: <LoadingOutlined />
// });
// const MenuCategoryComponent = loadable(() => import('./components/memu/MenuCategoryComponent'), {
//   fallback: <LoadingOutlined />
// });

const initialState = {
  homeTheme: 0,
}

class BlackMarketComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      isModalVisible: false,
    };
    this.dimemsion = FACTORY.fun_getWindowDimensions();
  }

  getUI_PC() {
    return (
      <div className='row mt-4'>
        <div className='col-xxl-2 col-xl-3 col-md-3'>
          <MenuCategoryComponentV2 isBlackMarket={this.props.isBlackMarket} />
        </div>
        <div className='col-xxl-10 col-xl-9 col-md-9'>
          <PostsComponent isBlackMarket={this.props.isBlackMarket} />
        </div>
      </div>
    );
  }

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleOk = () => {
    this.setState({ isModalVisible: false });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  getUI_MB() {
    <MenuCategoryComponentV2 isBlackMarket={this.props.isBlackMarket} />
    return (
      <>
        <div>
          <button
            onClick={() => this.setState({ isModalVisible: true })}
            className='btn-ds outline-pr mt-2'
          >
            <FilterOutlined />Lọc bài viết
          </button>
          <Modal title={<TitleForModel text='Lọc bài viết' />}
            visible={this.state.isModalVisible}
            onOk={() => this.handleOk()}
            onCancel={() => this.handleCancel()}>
            <MenuCategoryComponentV2
              isBlackMarket={this.props.isBlackMarket} />
          </Modal>
        </div>
        <div>
          <PostsComponent
            isForkReload={true}
            isBlackMarket={this.props.isBlackMarket} />
        </div>
      </>
    );
  }

  renderTheme0() {
    return (
      <div className='container-fluid'>
        {this.dimemsion.width >= 1000 ?
          this.getUI_PC() : this.getUI_MB()}
      </div>
    );
  }

  renderTheme1() {
    return (
      <div className="container mt-4 mb-4">
        <div className="mb-4">
          <MenuCategoryComponent isBlackMarket={this.props.isBlackMarket} />
        </div>
        <PostsComponent isBlackMarket={this.props.isBlackMarket} />
      </div>
    );
  }

  render() {
    return (
      <>
        <SlogantComponent />
        {/* <div className='mt-3 w-100 text-center'>
          <AdsGoogleFixed
            slot="7526115814"
            height='100px'
          />
        </div> */}
        {this.state.homeTheme === 1 ?
          this.renderTheme1() : this.renderTheme0()}
      </>
    );
  }
}

export default BlackMarketComponent;