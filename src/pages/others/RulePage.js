import React, { Component } from 'react';
import FooterComponent from '../../components/home/footer/FooterComponents';

// import loadable from '@loadable/component';
// const FooterComponent = loadable(() => import('../../components/home/footer/FooterComponents'));

class RulePage extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <>
        {/* <HeaderComponent /> */}
        <div className="policy">
          <div className="wrpaper-policy">
            <h1 className="wrpaper-policy-text">CHÍNH SÁCH SỬ DỤNG WEBSITE</h1>
          </div>
          <div className="nav__wrapper">
            <ul className="nav__wrapper-context">
              <li className="nav__wrapper-context-item">
                <a href="/" className="wrapper-context-item context-item-- " >NHÀ TUI</a>
              </li >
              <li className="nav__wrapper-context-item nav__wrapper-context-item-i  ">
                <span role="link" className="wrapper-context-item context-item-" >CHÍNH SÁCH SỬ DỤNG WEBSITE</span>
              </li>
            </ul>
          </div>
          <div className="context-wrpaper">
            <h2 className="context-wrpaper-h2">ĐIỀU KHOẢN SỬ DỤNG: TẠI WEBSITE VÀ FACEBOOK VỀ NGƯỜI DÙNG</h2>
            <div className="context-wrpaper-p">
              <p >
                Website <a href="/" >myhufier.com</a> là website thương mại điện tử học tập trao đổi thông tin về bài học,
                và bài giảng, trao đổi mua bán sách các dụng cụ học tập cần thiết khác.
              </p>
              <p >
                <span className="title-wrpaper">1. Chính sách riêng tư về sử dụng plugins của Facebook</span>
              </p>
              <p>
                Plugin mạng xã hội Facebook được tích hợp trên trang web của chúng tôi, của nhà cung cấp Facebook Inc., 1 Hacker Way, Menlo Park, California 94025, Hoa Kỳ.
              Bạn có thể nhận ra các plugin Facebook bằng logo Facebook trên trang web của chúng tôi. Bạn sẽ tìm thấy thông tin về tổng quan về các plugin Facebook tại đây: <a href="http://developers.facebook.com/docs/plugins/">http://developers.facebook.com/docs/plugins/.</a>
              </p>
              <p>
                Nếu bạn truy cập trang web của chúng tôi, kết nối trực tiếp sẽ được thiết lập giữa trình duyệt của bạn và máy chủ Facebook thông qua plugin. Bằng cách này, Facebook nhận được thông tin mà bạn đã truy
              cập trang web của chúng tôi với địa chỉ IP của bạn. Facebook có thể phân định được tài khoản người dùng của bạn truy cập vào trang web của chúng tôi. Chúng tôi muốn nêu rõ rằng chúng tôi là nhà cung cấp các trang web không nhận được bất kỳ kiến ​​thức nào về nội dung của dữ liệu được truyền cũng như việc Facebook sử dụng dữ liệu đó. Bạn có thể tìm thêm thông tin về vấn đề này trong chính sách bảo mật của Facebook <a href="https://www.facebook.com/privacy/explanation/">https://www.facebook.com/privacy/explanation/.</a>
              </p>
              <p>
                Nếu bạn không muốn Facebook có thể phân định sự truy cập từ tài khoản người dùng Facebook của bạn vào trang web của chúng tôi, hãy đăng xuất khỏi tài khoản người dùng Facebook của bạn.
              </p>
              <p>
                <span className="title-wrpaper">2. Các biện pháp an ninh</span>
              </p>
              <p>
                Chúng tôi đã thực hiện các biện pháp phòng ngừa bao quát để bảo mật dữ liệu của bạn. Dữ liệu mà bạn đã nhập vào, ví dụ: trên các trang web HTML (biểu mẫu liên hệ) được truyền đi dưới dạng mã hóa (SSL - Lớp cổng bảo mật) tới chúng tôi qua mạng dữ liệu công cộng tới Myhufier, nơi chúng được lưu và xử lý.
              </p>
              <p>
                Trang web này sử dụng mã hóa SSL vì lý do bảo mật và để bảo vệ việc truyền tải các nội dung mật, chẳng hạn như các yêu cầu mà bạn gửi tới chúng tôi với tư cách là nhà điều hành trang web.
              </p>
              <p>
                Bạn có thể nhận ra một kết nối được mã hóa bởi thực tế là dòng địa chỉ của trình duyệt thay đổi từ "http://" thành "https://" và bằng biểu tượng khóa trên dòng trình duyệt của bạn. Nếu mã hóa SSL được kích hoạt, dữ liệu mà bạn truyền cho chúng tôi sẽ không thể đọc được bởi bên thứ ba.
              </p>
              <p>
                <span className="title-wrpaper">3. Trang My Hufier</span>
              </p>
              <p>
                Nếu bạn sử dụng Extranet của chúng tôi, bạn phải nhập một số dữ liệu cá nhân mà chúng tôi sẽ xử lý và lưu để định hướng phạm vi dịch vụ được cung cấp cho nhu cầu của bạn dựa trên thông tin đó. Bạn có thể quản lý dữ liệu của mình mọi lúc trong "Hồ sơ của tôi". Để xóa hồ sơ của bạn, vui lòng thông báo cho chúng tôi qua địa chỉ <a href="https://mail.google.com/mail/u/0/?tab=mm#inbox?compose=CllgCHrfTPNnZgpQVqcXmRvvTzwVnGgpHkVxfLKxGDnsSLzgKvZcbRGVBcvTLrQvsMBbgZgXdvV">myhufier@gmail.com</a> vì quyền truy cập đầy đủ vào Extranet cũng sẽ bị thu hồi cùng với việc xóa dữ liệu của bạn.
              </p>
              <p>
                <span className="title-wrpaper">4. Truy cập thông tin và thông báo email</span>
              </p>
              <p>
                Sau khi khai thông tin định danh và đăng ký thành công, người sử dụng sẽ được trao quyền truy cập tại My Hufier với mọi thông tin, tài liệu và ứng dụng.
              </p>
              <p>
                Tin nhắn e-mail miễn phí sẽ được cung cấp cho người sử dụng My Hufier. Để nhận tin nhắn email, người sử dụng phải cung cấp địa chỉ email cá nhân đang sử dụng hoặc địa chỉ email được ủy quyền duy nhất. Việc cung cấp các địa chỉ email khác, đặc biệt là các địa chỉ email của bên thứ ba, là không được phép.
              </p>
              <p>
                Bằng cách nhập địa chỉ email đồng nghĩa với việc bạn đồng ý với việc xử lý các dữ liệu này.
              </p>
              <p>
                Người truy cập có thể hủy kích hoạt các dịch vụ e-mail này. Trong trường hợp do lỗi kỹ thuật hoặc các lý do khác khi hủy kích hoạt, vui lòng e-mail tới địa chỉ : <a href="https://mail.google.com/mail/u/0/?tab=mm#inbox?compose=CllgCHrfTPNnZgpQVqcXmRvvTzwVnGgpHkVxfLKxGDnsSLzgKvZcbRGVBcvTLrQvsMBbgZgXdvV">myhufier@gmail.com.</a> để nhận hỗ trợ kỹ thuật.
              </p>
            </div>
            <h2 className="context-wrpaper-h2 context-wrpaper-h2-hed ">CHÍNH SÁCH BẢO MẬT</h2>
            <div className="context-wrpaper-p">
              <p >
                <span className="title-wrpaper">1. Bảo mật thông tin</span>
              </p>
              <p>
                Myhufier.vn tôn trọng những thông tin cá nhân của bạn. Chúng tôi hiểu rằng bạn cần biết chúng tôi quản lý những thông tin cá nhân tập hợp được từ myhufier.vn như thế nào. Hãy đọc và tìm hiểu về những quy định bảo mật thông tin sau đây.
              </p>
              <p >
                Việc bạn truy cập, đăng ký, sử dụng myhufier.vn có nghĩa rằng bạn đồng ý và chấp nhận ràng buộc bởi các điều khoản của bản quy định bảo mật của chúng tôi.
              </p>
              <p >
                <span className="title-wrpaper">2. Tập hợp thông tin</span>
              </p>
              <p >
                <span className="title-wrpaper-chiu">2.1 Thông tin cá nhân</span>
              </p>
              <p>
                Myhufier.vn hoàn toàn miễn phí, bạn không cần phải cung cấp toàn bộ thông tin cá nhân của bạn. myhufier.vn chỉ yêu cầu các thông tin cá nhân của bạn như: tên, email và một số thông tin không bắt buộc khác khi bạn muốn tương tác với một số nội dung trên website. Các thông tin cá nhân này sử dụng để My Hufier nhận diện và liên hệ với bạn khi cần.
              </p>
              <p>
                Các thông tin cá nhân có thể được lưu trữ cho đến khi bạn xóa tài khoản. Nhưng chúng tôi có thể phục hồi những thông tin đó từ cơ sở dữ liệu của chúng tôi về tài khoản của bạn để giải quyết các tranh chấp, thi hành bản thoả thuận người sử dụng, hay vì các yêu cầu kỹ thuật, pháp lý liên quan đến sự an toàn và những hoạt động của trang website chúng tôi.
              </p>
              <p >
                <span className="title-wrpaper-chiu">2.2 Lịch sử tìm kiếm</span>
              </p>
              <p>
                Myhufier.vn sẽ lưu trữ lịch sử tìm kiếm của bạn trong hệ thống, mục đích của việc lưu trữ này là để chúng tôi có thể đưa ra kết quả tìm kiếm lần sau của bạn chính xác hơn, phù hợp với nhu cầu của bạn.
              </p>
              <p >
                <span className="title-wrpaper-chiu">2.3 Phạm vi, cách sử dụng thông tin</span>
              </p>
              <p>
                Thông thường, chúng tôi sử dụng các thông tin bạn cung cấp chỉ để liên hệ, hồi đáp những câu hỏi hay thực hiện các yêu cầu của bạn.
              </p>
              <p>
                Thông tin cá nhân của bạn sẽ không bị chia sẻ với bất kỳ bên thứ ba nào khi chưa có sự đồng ý của bạn. Nhưng chúng tôi có thể chia sẻ thông tin cho bên đối tác khi bạn đồng ý.
              </p>
              <p >
                <span className="title-wrpaper-chiu">2.4 Bảo đảm an toàn đối với các thông tin thu thập được</span>
              </p>
              <p>
                Chúng tôi chỉ tập hợp lại các thông tin cá nhân trong phạm vi phù hợp và cần thiết cho mục đích phục vụ đúng đắn của chúng tôi. Và chúng tôi duy trì các biện pháp thích hợp nhằm bảo đảm tính an toàn, nguyên vẹn, độ chính xác, và tính bảo mật những thông tin mà bạn đã cung cấp. Ngoài ra, chúng tôi cũng có những biện pháp thích hợp để đảm bảo rằng bên thứ ba cũng sử dụng các biện pháp bảo đảm an toàn cho các thông tin mà chúng tôi cung cấp cho họ nếu có.
              </p>
              <p >
                <span className="title-wrpaper">3. Liên kết các Website khác</span>
              </p>
              <p>
                Nếu bạn nhấn đường liên kết sang Website thứ ba, bao gồm cả trang quảng cáo, bạn sẽ rời trang myhufier.vn và sẽ đến trang Web bạn đã chọn. Chúng tôi không thể kiểm soát các hoạt động của bên thứ ba và không chịu trách nhiệm về sự an toàn hay bất kể những nội dung gì có trong Website đó.
              </p>
              <p >
                <span className="title-wrpaper">4. Sửa đổi và xoá thông tin tài khoản</span>
              </p>
              <p>
                Bạn có thể sửa đổi, cập nhật thông tin tài khoản của bạn bất cứ lúc nào tại myhufier.vn
              </p>
              <p>
                Cho dù, bạn tự xoá các thông tin đó đi nhưng chúng tôi có thể phục hồi những thông tin đó từ cơ sở dữ liệu của chúng tôi để giải quyết các tranh chấp, thi hành bản thoả thuận người sử dụng, hay vì các yêu cầu kỹ thuật, pháp lý liên quan đến sự an toàn và những hoạt động của trang website chúng tôi.
              </p>
              <p >
                <span className="title-wrpaper">5. Liên hệ, giải quyết khiếu nại</span>
              </p>
              <p>
                Bất kỳ khi nào bạn cần hỗ trợ, hay có các khiếu nại về chúng tôi hãy gọi đến số <a href="tel:0812455939">0812455939</a> hoặc gửi email đến địa chỉ: <a href="https://mail.google.com/mail/u/0/?tab=mm#inbox?compose=CllgCHrfTPNnZgpQVqcXmRvvTzwVnGgpHkVxfLKxGDnsSLzgKvZcbRGVBcvTLrQvsMBbgZgXdvV">myhufier@gmail.com.</a>
              </p>
            </div>
          </div>
        </div>
        <FooterComponent />
      </>
    );
  }
}

export default RulePage;