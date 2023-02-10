import React, { Component } from 'react';
import {
  LoadingOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Link } from 'react-router-dom';
import loadable from '@loadable/component';

const AuthorsComponent = loadable(() => import('./components/AuthorsComponent'), {
  fallback: <p className='text-center'><LoadingOutlined /></p>
})

class FooterComponents extends Component {
  getFooterOverrideClass() {
    return this.props.overrideClass || "mt-5 pt-xxl-5 pt-4";
  }

  render() {
    return (
      // Block Element Modifier
      <footer className={this.getFooterOverrideClass() + ' _bg-opa'}>
        <div className="container">
          {/* <div className="text-center text-uppercase fw-bold">
            <i className="fas fa-fist-raised m-2"></i>
            <span className='h6 fw-bold'>
              Được xây dựng bởi
            </span>
            <i className="fas fa-fist-raised m-2"></i>
          </div> */}

          {/* <AuthorsComponent /> */} 

          <div className="text-center footer-social mt-3">
            <span role='link'>
              <Link to='/rule'>
                <i className="fas fa-info-circle"></i>
              </Link>
            </span>
            <span role='link'>
              <Link to='/guide'>
                <i className="fas fa-phone-square-alt"></i>
              </Link>
            </span>
            <span role="link">
              <a href='/'>
                <i className="fab fa-facebook"></i>
              </a>
            </span>
            <span role="link"><TwitterOutlined /></span>
          </div>
          <div className="crea-page  mt-xxl-5 py-3">
            <hr />
            <ul className="footer-end">
              <li className="footer-end-">
                <div className="text-center m-0 p-0 float-start">© 2022 Go On</div>
              </li>
              <li className="footer-end-center" style={{ width: '30px', height: '30px' }}>
                {/* <i className="fas fa-book-reader" style={{ fontSize: '20px' }}></i> */}
                <img src='/favicon.ico' alt='logo-icon' width='30px' height='30px' />
              </li>
              <li className="footer-end-">
                <div className="float-end" style={{ marginLeft: '7px' }}>
                  <span role='link'>Privacy</span>
                </div>
                <div className="float-end">
                  <span role='link'>Terms</span></div><br />
              </li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }
}

export default FooterComponents;
