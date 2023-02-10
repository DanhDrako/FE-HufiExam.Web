
import React from 'react'
import { Component } from 'react';
import SlogantComponent from "../../components/common/SlogantComponent";
import SuggesstionQuestion from './SuggesstionQuestion';
import Footer from '../../components/home/footer/FooterComponents';
import Header from '../../components/home/header/HeaderComponent';

// import loadable from '@loadable/component';
// import { LoadingOutlined } from '@ant-design/icons';
// const SuggesstionQuestion = loadable(() => import('./SuggesstionQuestion'), {
//   fallback: <LoadingOutlined />
// });
// const Footer = loadable(() => import('../../components/home/footer/FooterComponents'), {
//   fallback: <LoadingOutlined />
// });
// const Header = loadable(() => import('../../components/home/header/HeaderComponent'), {
//   fallback: <LoadingOutlined />
// });

class Suggesstion extends Component {
  render() {
    return (
      <div>
        <Header />
        <SlogantComponent />
        <SuggesstionQuestion />
        <Footer />
      </div>
    );
  }
}

export default Suggesstion