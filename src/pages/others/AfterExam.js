
import React, { Component } from 'react';

class AfterExam extends Component {
  render() {
    const { doTime, total, numberWrong, point } = this.props;
    return (
      <div className="after_exam_R-container mt-5">
        <hr className='mt-5' />
        <h4 className='text-uppercase fw-bold mt-5 mb-5'>Kết quả bạn đạt được</h4>
        <ul className="after_exam_R-container-list">
          <li className="after_exam_R-container-item bg-border">
            <span className='fw-bold'>Số câu đúng</span>
            <h1>
              <span className='_text-sec'>
                {total - numberWrong}
              </span> /&nbsp;
                <span className='_text-thr'>
                {total}
              </span></h1>
          </li>
          <li className="after_exam_R-container-item bg-border">
            <span className='fw-bold'>Điểm số</span>
            <h1>
              <span className='_text-sec'>
                {point}
              </span>&nbsp;/&nbsp;
             <span className='_text-thr'>10
               </span>
            </h1>
          </li>
          <li className="after_exam_R-container-item bg-border">
            <span className='fw-bold'>Thời gian còn lại</span>
            <h1>
              <span>{`${doTime.h}:${doTime.m}:${doTime.s}`}</span>
            </h1>
          </li>
        </ul>
      </div>
    );
  }
}
export default AfterExam;
