import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AdminRouterType } from '../../../common/utils/actions-type';
import AdminAllPostComponent from './components/AllPostComponent';
import AdminInsertPostComponent from './components/InsertNewPostComponent';
import CategoriesComponent from './components/CategoriesComponent';
import TagsComponent from './components/TagsComponent';
import AdminDashboard from './components/DashboardComponent';

// import loadable from '@loadable/component';
// const AdminAllPostComponent = loadable(() => import('./components/AllPostComponent'));
// const AdminInsertPostComponent = loadable(() => import('./components/InsertNewPostComponent'));
// const CategoriesComponent = loadable(() => import('./components/CategoriesComponent'));
// const TagsComponent = loadable(() => import('./components/TagsComponent'));
// const AdminDashboard = loadable(() => import('./components/DashboardComponent'));

class AdminColRightCompoent extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  getCurrentPageByAdminRouter(router) {
    switch (router) {
      case AdminRouterType.DASHBOARD:
        return (
          <AdminDashboard />
        );
      case AdminRouterType.ALL_POST:
        return (
          <AdminAllPostComponent />
        );
      case AdminRouterType.INSERR_NEW_POST:
        return (
          <AdminInsertPostComponent />
        );
      case AdminRouterType.EDIT_POST:
        return (
          <AdminInsertPostComponent dataUpdate={this.props.adminRouter.data} />
        );
      case AdminRouterType.CATEGORIES:
        return (
          <CategoriesComponent />
        );
      case AdminRouterType.TAGS:
        return (
          <TagsComponent />
        );

      default:
        return (
          <AdminInsertPostComponent />
        );
    }
  }

  render() {
    const router = this.props.adminRouter.router;
    return (
      <>
        {this.getCurrentPageByAdminRouter(router)}
      </>
    );
  }
}

const mapStateToProps = (state, _ownProps) => {
  return {
    adminRouter: state.adminRouter,
  }
}

export default connect(mapStateToProps)(AdminColRightCompoent);