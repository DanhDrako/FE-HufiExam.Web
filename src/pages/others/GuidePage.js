import React, { Component } from 'react';

class GuidePage extends Component {
  render() {
    return (
      <div className="GuidePage">
        <h1 className="faqs">FAQs</h1>
        {/*start Question */}
        <div className="Question">
          <div className="Question_iconWrapper">
            <strong className="Question_Q">Q</strong>
          </div>
            <h2 className="Question_text">1. Làm sao để tôi có thể đăng ký tài khoản?</h2>
        </div>
        <div className="Answer">
          <div className="Question_iconWrapper">
            <strong className="Question_Q">A</strong>
          </div>
          <div className="Answer_text">
            <div className="Answer_text-list">
            <p>Trước tiên thì bạn phải có một email chính chủ và chưa được đăng ký tài khoản tại đây bao giờ.
              Sau đó thì bạn đối với trình duyệt bằng điện thoại, tablet thì các bạn bấm vào dấu 3 gạch ở trên góc bên
              trái con đối với trình duyệt trên laptop hay PC thì nó nằm ngay góc bên phải của màng hình. 
            </p>
            <p>
              Tiếp theo các bạn bấm vào nút Sign-Up(đăng ký), sau đó 1 form đăng ký mới được xuất hiện các bạn
              nhập đầy đủ thông tin như yêu cầu, và nhớ hay xác nhận Tôi...Đồng ý với điều khoản nhé.
            </p>
            <p>
              Lúc này sẽ có một thanh trược và có một con số ngẫu nhiên được gán ở trên đó, các bạn hãy kéo thanh
              trược này sau cho nó đến vị trí như con số ở trên sau đó bạn bấm vào nút OK.
            </p>
            <p>
              À khoan, chưa xong đâu nhé tiếp theo thì bạn vào email mình đã nhập ở form đăng ký sẽ có một email được gửi đến 
              bạn hãy bấm xác nhận tài khoản và bây giờ bạn chính thức trở thành một thành viên của My hufier hãy quay lại 
              trang chính và trải nhiệm nhé.
            </p>
            </div>
          </div>
        </div>
        {/* end Question */}
        {/*start Question */}
        <div className="Question">
          <div className="Question_iconWrapper">
            <strong className="Question_Q">Q</strong>
          </div>
            <h2 className="Question_text">2. Làm sao để tôi có thể đăng ký tài khoản?</h2>
        </div>
        <div className="Answer">
          <div className="Question_iconWrapper">
            <strong className="Question_Q">A</strong>
          </div>
          <div className="Answer_text">
            <div className="Answer_text-list">
            <p>Trước tiên thì bạn phải có một email chính chủ và chưa được đăng ký tài khoản tại My hufier bao giờ.
              Sau đó thì bạn đối với trình duyệt bằng điện thoại, tablet thì các bạn bấm vào dấu 3 gạch ở trên góc bên
              trái con đối với trình duyệt trên laptop hay PC thì nó nằm ngay góc bên phải của màng hình. 
            </p>
            <p>
              Tiếp theo các bạn bấm vào nút Sign-Up(đăng ký), sau đó 1 form đăng ký mới được xuất hiện các bạn
              nhập đầy đủ thông tin như yêu cầu, và nhớ hay xác nhận Tôi...Đồng ý với điều khoản nhé.
            </p>
            <p>
              Lúc này sẽ có một thanh trược và có một con số ngẫu nhiên được gán ở trên đó, các bạn hãy kéo thanh
              trược này sau cho nó đến vị trí như con số ở trên sau đó bạn bấm vào nút OK.
            </p>
            <p>
              À khoan, chưa xong đâu nhé tiếp theo thì bạn vào email mình đã nhập ở form đăng ký sẽ có một email được gửi đến 
              bạn hãy bấm xác nhận tài khoản và bây giờ bạn chính thức trở thành một thành viên của My hufier hãy quay lại 
              trang chính và trải nhiệm nhé.
            </p>
            </div>
          </div>
        </div>
        {/* end Question */}
      </div>
    );
  }
}

export default GuidePage;