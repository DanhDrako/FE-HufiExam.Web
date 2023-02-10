import React, { Component } from 'react';
import PostDetailComponent from '../../components/post-detail/PostDetailComponent';
import Footer from '../../components/home/footer/FooterComponents';
import Header from '../../components/home/header/HeaderComponent';

// import loadable from '@loadable/component';
// import { LoadingOutlined } from '@ant-design/icons';
// const PostDetailComponent = loadable(() => import('../../components/post-detail/PostDetailComponent'), {
//   fallback: <LoadingOutlined />
// });
// const Footer = loadable(() => import('../../components/home/footer/FooterComponents'), {
//   fallback: <LoadingOutlined />
// });
// const Header = loadable(() => import('../../components/home/header/HeaderComponent'), {
//   fallback: <LoadingOutlined />
// });

class PostDetail extends Component {
  render() {
    const params = {
      slug: this.props.match.params.slug,
      id: this.props.match.params.id,
    }
    return (
      <>
        <Header />
        <div className="container mt-4 mb-4">
          <PostDetailComponent params={params} />
        </div>
        <Footer />
      </>
    );
  }
}

export default PostDetail;