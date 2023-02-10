
import React, { Component } from 'react';
import HeaderComponent from '../../components/home/header/HeaderComponent';
import FooterComponent from '../../components/home/footer/FooterComponents';

class Infoexam extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    return (
      <>
        <HeaderComponent />
        <div className="container">
          <div className="Info_exam">
            <h5 className="brother-bottom-1px">Thông tin sinh viên </h5>
            <div className="Info_exam-container">
              <div className="Info_exam-container_L">
                <img src="/image/authors/author1.png" className="img-info-exam img-info-exam-- " alt="logo author" ></img>
              </div>
              <div className="Info_exam-container_C">

                <div className="container">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="exampleFormControlInput1" className="form-label">Mã sinh viên</label>
                    </div>
                    <div className="col">
                      <input type="email" className="form-control" placeholder="Mã sinh viên"></input>
                    </div>

                  </div>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="exampleFormControlInput1" className="form-label">Ngày sinh</label>
                    </div>
                    <div className="col">
                      <input type="email" className="form-control" placeholder="Ngày sinh"></input>
                    </div>

                  </div>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="exampleFormControlInput1" className="form-label">Nơi sinh</label>
                    </div>
                    <div className="col">
                      <input type="email" className="form-control" placeholder="Nơi sinh"></input>
                    </div>

                  </div>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="exampleFormControlInput1" className="form-label">Lớp học</label>
                    </div>
                    <div className="col">
                      <input type="email" className="form-control" placeholder="Lớp học"></input>
                    </div>

                  </div>
                </div>

              </div>
              <div className="Info_exam-container_R">
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="exampleFormControlInput1" className="form-label">Họ tên</label>
                    </div>
                    <div className="col">
                      <input type="email" className="form-control" placeholder="Họ tên"></input>
                    </div>

                  </div>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="exampleFormControlInput1" className="form-label">Giới tính</label>
                    </div>
                    <div className="col">
                      <input type="email" className="form-control" placeholder="Giới tính"></input>
                    </div>

                  </div>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="exampleFormControlInput1" className="form-label">Khóa học</label>
                    </div>
                    <div className="col">
                      <input type="email" className="form-control" placeholder="Khóa học"></input>
                    </div>

                  </div>
                </div>

              </div>

            </div>
            <h5 className="brother-bottom-1px">Chọn môn thi</h5>
            <div className="footer_info-exam">
              <div className="footer_info-exam-item">
                <h6>Môn thi:</h6>
                <select className="form-select form-select-- " aria-label="Default select example">
                  <option defaultValue>Toán</option>
                  <option value="1">Lý</option>
                </select>
              </div>
              <div className="footer_info-exam-item2">
                <ul className="footer_info-exam-item2-list">
                  <li><button type="button" className="btn btn-success">Vào thi</button></li>
                  <li><button type="button" className="btn btn-danger">Hủy thi</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent />
      </>
    );
  }
}
export default Infoexam;
