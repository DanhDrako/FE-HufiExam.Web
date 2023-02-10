import React, { Component } from 'react';
import { connect } from 'react-redux';
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

class Home extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  render() {
    return (
      <>
        <Header />
        <DefaultComponent />
        <Footer />
      </>
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    user: state.user.user,
  }
}

export default connect(mapStateToProps)(Home);