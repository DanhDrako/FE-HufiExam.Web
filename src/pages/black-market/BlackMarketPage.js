import React, { Component } from 'react';
import DefaultComponent from '../../components/default/DefaultComponent';
import Footer from '../../components/home/footer/FooterComponents';
import Header from '../../components/home/header/HeaderComponent';

// import loadable from '@loadable/component';
// import { LoadingOutlined } from '@ant-design/icons';
// const DefaultComponent = loadable(() => import('../../components/default/DefaultComponent'), {
//   fallback: <LoadingOutlined />
// });
// const Footer = loadable(() => import('../../components/home/footer/FooterComponents'), {
//   fallback: <LoadingOutlined />
// });
// const Header = loadable(() => import('../../components/home/header/HeaderComponent'), {
//   fallback: <LoadingOutlined />
// });

class BlackMarketPage extends Component {
  render() {
    return (
      <>
        <Header />
        <DefaultComponent isBlackMarket={true} />
        <Footer />
      </>
    );
  }
}

export default BlackMarketPage;