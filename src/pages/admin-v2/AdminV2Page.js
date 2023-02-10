import React, { Component } from 'react';
import './css/AdminV2Page.css';
import AdminV2MenuComponent from '../../components/admin-v2/left/AdminV2MenuComponent';
import AdminColRightComponent from '../../components/admin-v2/right/AdminColRightCompoent';
import ButtonSwithTheme from '../../components/common/ButtonSwithDarkLightTheme';

// import loadable from '@loadable/component';
// const AdminV2MenuComponent = loadable(() => import('../../components/admin-v2/left/AdminV2MenuComponent'));
// const AdminColRightComponent = loadable(() => import('../../components/admin-v2/right/AdminColRightCompoent'));
// const ButtonSwithTheme = loadable(() => import('../../components/common/ButtonSwithDarkLightTheme'));

class AdminV2Page extends Component {
  showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId)

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener('click', () => {
        // show navbar
        nav.classList.toggle('show')
        // change icon
        toggle.classList.toggle('fa-times')
        // add padding to body
        bodypd.classList.toggle('body-pd')
        // add padding to header
        headerpd.classList.toggle('body-pd')
      })
    }
  }

  componentDidMount() {
    this.showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header');
  }

  render() {
    return (
      <div id='body-pd'>
        <header className="header" id="header">
          <div className="header_toggle">
            <i className="fas fa-ellipsis-h" id="header-toggle"></i>
          </div>
          {/* <div className="header_img"> <img src="https://i.imgur.com/hczKIze.jpg" alt="" /> </div> */}
          <div>
            <ButtonSwithTheme />
          </div>
        </header>
        <div className="l-navbar" id="nav-bar">
          <AdminV2MenuComponent />
        </div>
        {/*Container Main start*/}
        <div className="height-100">
          <AdminColRightComponent />
        </div>
        {/*Container Main end*/}
      </div>
    );
  }
}

export default AdminV2Page;