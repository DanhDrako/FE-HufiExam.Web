import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import ButtonMessagePcComponent from './ButtonMessagePcComponent';
import BodyMessagePcComponent from './BodyMessagePcComponent';
import ButtonSwithTheme from '../../../../common/ButtonSwithDarkLightTheme';

// import loadable from '@loadable/component';
// const ButtonMessagePcComponent = loadable(() => import('./ButtonMessagePcComponent'));
// const BodyMessagePcComponent = loadable(() => import('./BodyMessagePcComponent'));
// const ButtonSwithTheme = loadable(() => import('../../../../common/ButtonSwithDarkLightTheme'));

class NavbarPcComponent extends Component {
  navLinkClicked(value) {
    if (!this.props.navLinkClicked) return;
    this.props.navLinkClicked(value);
  }

  render() {
    return (
      <div className="container__PC">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <ul id="nav-links" className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li>
                <NavLink
                  onClick={() => this.navLinkClicked('HOME')}
                  to="/"
                  isActive={(_match, location) => {
                    if (location.pathname === '/')
                      return true;
                    return false;
                  }}
                  activeStyle={{
                    fontWeight: "bold",
                    borderBottom: "1px solid",
                  }}
                  className="nav-link px-2">
                  <div className='bi d-block mx-auto mb-1 text-center'>
                    <i className="fas fa-book-reader icon-header"></i>
                  </div>
                    Trang chủ
              </NavLink>
              </li>
              
              <li><NavLink
                onClick={() => this.navLinkClicked('USER_POST')}
                to="/user-post"
                activeStyle={{
                  fontWeight: "bold",
                  borderBottom: "1px solid"
                }}
                className="nav-link px-2">
                <div className='bi d-block mx-auto mb-1 text-center'>
                  <i className="fas fa-cannabis icon-header"></i>
                </div>
                  Bài Viết
            </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => this.navLinkClicked('RANK_EXAMP')}
                  to="/exam"
                  activeStyle={{
                    fontWeight: "bold",
                    borderBottom: "1px solid"
                  }}
                  className="nav-link px-2">
                  <div className='bi d-block mx-auto mb-1 text-center'>
                    <i className="fab fa-teamspeak icon-header"></i>
                  </div>
                    Thi thử
                </NavLink>
              </li>

              <li>
                <NavLink
                  onClick={() => this.navLinkClicked('RANK_EXAMP')}
                  to="/rank"
                  activeStyle={{
                    fontWeight: "bold",
                    borderBottom: "1px solid"
                  }}
                  className="nav-link px-2">
                  <div className='bi d-block mx-auto mb-1 text-center'>
                    <i className="fas fa-random icon-header"></i>
                  </div>
                  Xếp hạng
                </NavLink>
              </li>

              <li><NavLink
                onClick={() => this.navLinkClicked('BLACK_MARKET')}
                to="/black-market"
                activeStyle={{
                  fontWeight: "bold",
                  borderBottom: "1px solid"
                }}
                className="nav-link px-2">
                <div className='bi d-block mx-auto mb-1 text-center'>
                  <i className="fas fa-torah icon-header"></i>
                </div>
                  Báo cáo
            </NavLink>
              </li>
              
              <li className="nav-item dropdown">
                <span role='link' className="nav-link dropdown-toggle" id="navbarDarkDropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className='bi d-block mx-auto mb-1 text-center'>
                  <i className="fab fa-buromobelexperte icon-header"></i>
                  </div>
                  Xem thêm
                </span>
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                  <li>
                    <NavLink
                      onClick={() => this.navLinkClicked('SUGGESTION')}
                      to="/suggestion"
                      activeStyle={{
                        fontWeight: "bold",
                        borderBottom: "1px solid"
                      }}
                      className="dropdown-item">Hộp Thư Góp Ý
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink
                      onClick={() => this.navLinkClicked('DONATE')}
                      to="/donate"
                      activeStyle={{
                        fontWeight: "bold",
                        borderBottom: "1px solid"
                      }}
                      className="dropdown-item">Ủng hộ Amin
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={() => this.navLinkClicked('DONATE')}
                      to="/price-gold"
                      activeStyle={{
                        fontWeight: "bold",
                        borderBottom: "1px solid"
                      }}
                      className="dropdown-item">Xem biểu đồ giá vàng
                    </NavLink>
                  </li> */}
                </ul>
              </li>
            </ul>
            <span style={{ marginRight: '7px' }}>
              <ButtonSwithTheme />
            </span>
            {/*
              # Code by thangchay
              # edit by vietsaclo
              This button message -> user logon -> show button ?
            */}
            {this.props.user && this.props.user.userId ?
              <ButtonMessagePcComponent
                user={this.props.user}
                socket={this.props.socket}
              /> : ''
            }
            <div className="text-end">
              {this.props.getUserAvatar != null ? this.props.getUserAvatar() : ''}
            </div>
          </div>
          {/*
              # Code by thangchay
              # edit by vietsaclo
              This is body button message -> user logon -> show body button ?
            */}
          {this.props.user && this.props.user.userId ?
            <BodyMessagePcComponent
              user={this.props.user}
              socket={this.props.socket}
            /> : ''
          }
        </div>
      </div>
    );
  }
}

export default NavbarPcComponent;