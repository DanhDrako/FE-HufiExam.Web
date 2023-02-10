import React, { Component } from 'react';
import SlogantComponent from '../../components/common/SlogantComponent';
import FooterComponents from '../../components/home/footer/FooterComponents';
import HeaderComponent from '../../components/home/header/HeaderComponent';

class DonatePage extends Component {
  render() {
    return (
      <>
        <HeaderComponent />
        <SlogantComponent />

        <div className='container mt-2'>
          <div className='row'>
            <div className='col-sm-12 col-md-6 text-right mb-2'>
              <div className='mt-3 p-3 border h-100'>
                <h5 className='text-center fw-bold _text-thr text-uppercase'>Ủng hộ Admin để duy trì website</h5>
                <p style={{ textAlign: 'justify' }}>
                  <span className='_text-sec'>MoMo/Zalo Pay: </span> <span className='fw-bold'>0917344348</span>
                </p>
                <div className='text-center'>
                  <img className='w-100' src='/image/images/momo-pay.jpg' alt='momo-donate' />
                </div>
                <h5 className='text-center fw-bold _text-thr text-uppercase'>Chúc bạn học tốt</h5>
                {/* <hr />
                <div className='text-center mt-3'>
                  <i className="fas fa-book-reader" style={{ fontSize: '10px' }}></i>
                    &nbsp;
                    <i className="fas fa-book-reader" style={{ fontSize: '20px' }}></i>
                    &nbsp;
                    <i className="fas fa-book-reader" style={{ fontSize: '10px' }}></i>
                </div> */}
                {/* <p className='text-center author-name m-3'>
                  cộng đồng người học HUFI
                </p> */}
              </div>
            </div>
            <div className='col-sm-12 col-md-6 text-left mb-2'>
              <div className='mt-3 p-3 border h-100'>
                <img className='w-100' style={{ verticalAlign: 'middle' }} src='/image/images/fun-donate.jpg' alt='fun-donate' />
                <div className='text-center mt-5'>
                  <img src='/image/logos/logo-200.png' alt='logo-icon' width='140px' height='140px' />
                </div>
              </div>
            </div>
          </div>
          <br />
          <div>
          </div>
        </div>

        <FooterComponents />
      </>
    );
  }
}

export default DonatePage;