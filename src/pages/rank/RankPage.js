import React, { Component } from 'react';
import RankExam from '../../components/common/RankExam';
import SlogantComponent from '../../components/common/SlogantComponent';
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

class RankPage extends Component {
  render() {
    return (
      <>
        <Header />
        <SlogantComponent />
        <div className='container mt-2'>
          <div className='row'>
            <div className='col-sm-12 col-md-6 text-right mb-2'>
              <div className='mt-3 p-3 border h-100'>
                <h5 className='text-center fw-bold _text-thr text-uppercase'>Bạn cần lưu ý một số thông tin sau</h5>
                <p style={{ textAlign: 'justify' }}>
                  Bạn nhìn qua <span className='_text-sec'>hình ảnh bên cạnh</span>, nếu bạn không sửa gì mà nhấn OK, thì
                  <span className='_text-sec'> mặc định</span> hệ thống sẽ lấy
                  từ câu hỏi thứ <span className='_text-sec'> 0 - 40</span> để cho bạn thi. Vì vậy sẽ không luyện thi hết ngân hàng đề được.
                  <span className='_text-sec'> Bạn cần phải:</span>
                </p>
                <ol>
                  <li style={{ textAlign: 'justify' }}><span className='_text-sec'>"Chọn số lượng câu"</span> để thi cho phù hợp. ví dụ 40, 50, 100.</li>
                  <li style={{ textAlign: 'justify' }}>Chọn<span className='_text-sec'> "Bắt đầu thi từ câu thứ?" </span>cho phù hợp, ví dụ lần thi thứ nhất bạn thi 40 câu, thì lần thi thứ hai bạn nên chọn bắt đầu từ ví trí thứ 41 hoặc 50, 60,...
                  Như vậy ngân hàng sẽ lấy câu hỏi mới cho bạn thi.</li>
                  <li style={{ textAlign: 'justify' }}>Chọn chế độ <span className='_text-sec'>"trộn ngẫu nhiên"</span> để được thi với những câu hỏi được bốc ngẫu nhiên trong ngân hàng đề. Giống thi thật nhất.</li>
                </ol>
                <h5 className='text-center fw-bold _text-thr text-uppercase'>Chúc bạn học tốt</h5>
                <hr />
                <div className='text-center mt-3'>
                  <i className="fas fa-book-reader" style={{ fontSize: '10px' }}></i>
                    &nbsp;
                    <i className="fas fa-book-reader" style={{ fontSize: '20px' }}></i>
                    &nbsp;
                    <i className="fas fa-book-reader" style={{ fontSize: '10px' }}></i>
                </div>
                <p className='text-center author-name m-3'>
                  cộng đồng người học HUFI
                </p>
              </div>
            </div>
            <div className='col-sm-12 col-md-6 text-left mb-2'>
              <div className='mt-3 p-3 border h-100'>
                <img className='w-100' src='/image/images/conf-exam.png' alt='suggess-exam' />
              </div>
            </div>
          </div>
          <br />
          <div>
            <RankExam />
          </div>
        </div>

        <Footer />
      </>
    );
  }
}

export default RankPage;