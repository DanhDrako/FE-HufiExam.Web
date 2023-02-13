import React, { Component } from 'react';
import { PageHeader, Row, Space, Tag, Tooltip } from 'antd';
import moment from "moment";
import FACTORY from '../../../../../common/FACTORY';
import ButtonsReactComponent from './components/ButtonsReactComponent';
import MyImageView from '../../../../common/MyImageView';
import TaskComponent from './components/TaskComponent';
// import ButtonDowloadsUIComponent from './components/ButtonDowloadsUIComponent';
import ButtonShareOnFacebook from '../../../../common/ButtonShareOnFacebook';
import ButtonShareOnEmail from '../../../../common/ButtonShareOnEmail';
import { ShareAltOutlined, SmileOutlined } from '@ant-design/icons';

// import loadable from '@loadable/component';
// import { LoadingOutlined } from '@ant-design/icons';
// const ButtonShareOnFacebook = loadable(() => import('../../../../common/ButtonShareOnFacebook'), {
//   fallback: <LoadingOutlined />
// });
// const ButtonShareOnEmail = loadable(() => import('../../../../common/ButtonShareOnEmail'), {
//   fallback: <LoadingOutlined />
// });
// const ButtonsReactComponent = loadable(() => import('./components/ButtonsReactComponent'));
// const MyImageView = loadable(() => import('../../../../common/MyImageView'));
// const TaskComponent = loadable(() => import('./components/TaskComponent'));

const Content = ({ children, extraContent }) => (
  <Row>
    <div className="row">
      <div className="col-xxl-3 col-xl-3 col-md-3 col-sm-12 mb-2">
        {extraContent}
      </div>
      <div className="col-xxl-9 col-xl-9 col-md-9 col-sm-12">
        {children}
      </div>
    </div>
  </Row>
);

class CardComponent extends Component {
  constructor(props) {
    super(props);
    this.dimension = FACTORY.fun_getWindowDimensions();
  }

  getContent(post) {
    return (
      <>
        <p
          style={{ height: '47px', overflow: 'hidden' }}
          className='fw-bold text-capitalize'>
          {post.title}
        </p>
        <p className='card-description' style={{ textAlign: 'justify' }}>
          {post.description}
        </p>
        <div
          style={{ border: '1px solid var(--cl-border-light)' }}
          className='w-100 mt-2'>
          {/* <div
            className='text-center p-2'
            style={{ backgroundColor: 'var(--cl-opa)', borderBottom: '1px solid var(--cl-border-light)' }}
          >
            <SmileOutlined /> Xếp hạng Bài Viết này<br />
            <Tooltip title='Lưu ý: Nội dung thư phải trên 100 ký tự' color={FACTORY.TOOLTIP_COLOR}>
              <a href={'mailto:myhufier@gmail.com'}>Yêu cầu gỡ</a>
            </Tooltip>
          </div> */}

          <div className='text-center p-2'>
            <ButtonsReactComponent post={post} />
          </div>
        </div>
        <div className='text-center' >
          {/* <ButtonDowloadsUIComponent
            links={post.linksDownload}
          /> */}
          {/* <ButtonsReactComponent post={post} /> */}
        </div>

        <TaskComponent
          post={post}
          userLoged={this.props.userLoged}
        />
      </>
    );
  }

  getBoxShareSocial(post) {
    if (this.dimension.width < 1000) return '';
    return (
      <div
        style={{ border: '1px solid var(--cl-border-light)' }}
        className='w-100 mt-2'>
        <div
          className='text-center p-2'
          style={{ backgroundColor: 'var(--cl-opa)', borderBottom: '1px solid var(--cl-border-light)' }}
        >
          <ShareAltOutlined /> Share
          </div>

        <div className='text-center p-2'>
          <Space
            size='middle'
          >
            <ButtonShareOnFacebook
              post={post}
            />
            {/* <ButtonShareOnEmail
              post={post}
            /> */}
          </Space>
        </div>
      </div>
    );
  }

  getColLeft(post) {
    if (!post) return;
    return (
      <>
        <MyImageView
          src={FACTORY.fun_getImageViewFromServer(post.imageBanner, post.imageUploadType)}
          alt="content"
          width="100%"
          className='img-fluid'
        />
        {post.tags.length !== 0 ?
          <hr className='m-1 mb-2' /> : ''}
        <div style={{ overflow: 'auto' }}>
          {post.tags.map((v, k) => {
            return (
              <Tag
                key={k}
                className='tag-pr m-1'
              >{v}</Tag>
            );
          })}
        </div>
        {this.getBoxShareSocial(post)}
      </>
    );
  }

  render() {
    const post = this.props.post;
    return (
      <PageHeader
        title={<span>{post.own.username}</span>}
        className="site-page-header"
        subTitle={moment(post.createAt).calendar()}
        tags={FACTORY.fun_getRoleUI(post.own.role)}
        // extra={<ButtonsReactComponent post={post} />}
        avatar={{
          src: <MyImageView
            src={FACTORY.fun_getAvatarImageView(post.own.avatar, post.own.avatarUploadType)}
            alt='avatar'
          />
        }}
      >
        <Content
          extraContent={this.getColLeft(post)}
        >
          {this.getContent(post)}
        </Content>
      </PageHeader>
    );
  }
}

export default CardComponent;