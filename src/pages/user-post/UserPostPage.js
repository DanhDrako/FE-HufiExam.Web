import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AdminRouterType } from '../../common/utils/actions-type';
import SlogantComponent from "../../components/common/SlogantComponent";
import AdminAllPostComponent from '../../components/admin-v2/right/components/AllPostComponent';
import AdminInsertPostComponent from '../../components/admin-v2/right/components/InsertNewPostComponent';
import Footer from '../../components/home/footer/FooterComponents';
import Header from '../../components/home/header/HeaderComponent';

// import loadable from '@loadable/component';
// import { LoadingOutlined } from '@ant-design/icons';
// const AdminAllPostComponent = loadable(() => import('../../components/admin-v2/right/components/AllPostComponent'), {
//   fallback: <LoadingOutlined />
// });
// const AdminInsertPostComponent = loadable(() => import('../../components/admin-v2/right/components/InsertNewPostComponent'), {
//   fallback: <LoadingOutlined />
// });
// const Footer = loadable(() => import('../../components/home/footer/FooterComponents'), {
//   fallback: <LoadingOutlined />
// });
// const Header = loadable(() => import('../../components/home/header/HeaderComponent'), {
//   fallback: <LoadingOutlined />
// });

class UserPostPage extends Component {
  getUI() {
    const router = this.props.adminRouter.router;
    const data = this.props.adminRouter.data;
    switch (router) {
      case AdminRouterType.INSERR_NEW_POST:
        return (
          <AdminInsertPostComponent />
        );
      case AdminRouterType.EDIT_POST:
        return (
          <AdminInsertPostComponent dataUpdate={data} />
        );

      default:
        return (
          <AdminAllPostComponent />
        );
    }
  }

  render() {
    return (
      <>
        <Header />
        <SlogantComponent />
        <div className='container-fluid mt-4'>
          {this.getUI()}
        </div>
        <Footer />
      </>
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    adminRouter: state.adminRouter,
  }
}

export default connect(mapStateToProps)(UserPostPage);