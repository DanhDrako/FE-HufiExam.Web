import { Avatar, Comment, Space, Tag } from 'antd';
import React, { Component } from 'react';
import FACTORY from '../../../common/FACTORY';
import { TagsOutlined } from '@ant-design/icons';
import CommentDetailComponent from '../../default/components/posts/components/components/CommentDetailComponent';
import MyImageView from '../../common/MyImageView';
import ButtonDowloadsUIComponent from '../../default/components/posts/components/components/ButtonDowloadsUIComponent';
import ButtonGoToFacebook from '../../common/ButtonGoToFacebook';
import ButtonMessage from '../../common/ButtonMessage';

import loadable from '@loadable/component';
import ButtonShareOnFacebook from '../../common/ButtonShareOnFacebook';
import ButtonShareOnEmail from '../../common/ButtonShareOnEmail';
import ButtonExamComponent from '../../default/components/posts/components/components/ButtonExamComponent';
import AdsGoogleDefault from '../../common/AdsGoogle/AdsGoogleDefault';
import QuestionAnswerComponent from './QuestionAnswerComponent';
// import AdsGoogleFixed from '../../common/AdsGoogle/AdsGoogleFixed';
const ReactHtmlParserLoad = loadable(() => import('react-html-parser'));
// const CommentDetailComponent = loadable(() => import('../../default/components/posts/components/components/CommentDetailComponent'));

let ReactHtmlParser = null;

class ContentLeftComponent extends Component {
  constructor(props) {
    super(props);
    this.userLoged = FACTORY.fun_getUserLoginLocalStorage();
    this.state = {
      isLoadReactHtmLParser: false,
    }
    this.dispatch = this.props.dispatch;
  }

  componentDidMount() {
    this.setState({ isLoadReactHtmLParser: true }, () => {
      ReactHtmlParserLoad.load().then((load) => {
        ReactHtmlParser = load.default;
        this.setState({ isLoadReactHtmLParser: false, });
      });
    });
  }

  getTags() {
    const tags = this.props.postDetail.tags;
    if (!tags || tags.length === 0) return;
    return (
      <div className="tag mb-3">
        <div className='_text-thr mb-2'>
          <TagsOutlined /> Tags:
          </div>
        <div>
          {tags.map((v) => {
            return (
              <Tag className='tag-pr' key={v.id} >{v.name}</Tag>
            );
          })}

        </div>
      </div>
    );
  }

  getImageBanner(post) {
    if (post && post.imageBanner)
      return (
        <div className='text-center mt-3'>
          <MyImageView
            src={FACTORY.fun_getImageViewFromServer(post.imageBanner, post.imageUploadType)}
            className="img-fluid"
            alt="Post detail" />
        </div>
      );
  }

  getBtnDownloadUI() {
    if (this.props.waitForDownload > 0)
      return (
        <p className='fw-bold p-2 border'>
          Chờ Downloads trong: <span className='_text-sec'>{this.props.waitForDownload} giây</span>
        </p>
      );
    return (
      <ButtonDowloadsUIComponent
        links={this.props.postDetail.linksDownload}
      />)
  }

  render() {
    const own = this.props.postDetail.own;
    return (
      <div className="content-news p-2 p-md-3 pb-0">
        <h2>
          {this.props.postDetail.title}
        </h2>
        <ul className="post-meta list-inline">
          <li className="list-inline-item">
            <i className="far fa-user-circle"></i> {this.props.postDetail.own ?
              this.props.postDetail.own.username : ''}
          </li>
          <li className="list-inline-item">
            <i className="far fa-calendar-alt"></i>{FACTORY.fun_getDateString(this.props.postDetail.createAt)}
          </li>
        </ul>
        <div className="nd-news">
          <article>
            <p>
              {this.props.postDetail.description}
            </p>
            <div>
              {this.getImageBanner(this.props.postDetail)}
            </div>
            {/* <div className='w-100'>
              <AdsGoogleDefault
                slot="9153509368"
              />
            </div> */}
            <div className="post-content mt-5">
              <div className='text-break body-parser'>
                {!this.state.isLoadReactHtmLParser && ReactHtmlParser != null ?
                  ReactHtmlParser(this.props.postDetail.content) : ''}
              </div>
              <h3 className='mt-5'>Links Download</h3>
              {/* <div className='w-100' id='vsl-ads-one'>
                <AdsGoogleDefault
                  slot="7049271967"
                />
              </div> */}
              {this.getBtnDownloadUI()}
              <div className='_text-thr mt-3'>
                <Space>
                  <span>Share</span>
                  <ButtonShareOnFacebook
                    post={this.props.postDetail}
                  />
                  <ButtonShareOnEmail
                    post={this.props.postDetail}
                  />
                </Space>
              </div>
              <hr className="mb40" />

              {this.props.postDetail && this.props.postDetail.id ?
                <QuestionAnswerComponent
                  postId={this.props.postDetail.id}
                /> : ''}

              {/* <hr className="mb40" /> */}
              <h3>About Author</h3>
              <div className="media mb40">
                {own ?
                  <Comment
                    avatar={<Avatar
                      src={FACTORY.fun_getAvatarImageView(own.avatar, own.avatarUploadType)}
                      alt='avatar author'
                    />}
                    author={own.displayName || own.username}
                    content={<div>
                      <span><i className="far fa-smile-wink">&nbsp;&nbsp;&nbsp;</i>{own.username}</span>
                      <br />
                      <span><i className="far fa-envelope">&nbsp;&nbsp;&nbsp;</i>{own.email}</span>
                      <br />
                      <span><i className="fas fa-book-reader">&nbsp;&nbsp;&nbsp;</i>{own.role}</span>
                    </div>}

                  /> : ''}
              </div>
              <div>
                <Space>
                  <span role='link'>
                    <ButtonGoToFacebook
                      user={own}
                    />
                  </span>
                  {own ?
                    <ButtonMessage
                      user={own}
                    /> : ''}
                </Space>
              </div>
              <hr className="mb40" />
              <h3>Comment</h3>
              {this.props.postDetail && this.props.postDetail.id ?
                <CommentDetailComponent
                  postId={this.props.postDetail.id}
                  userLoged={this.userLoged}
                /> : ''}
            </div>
          </article>
        </div>

        {/* <div className='w-100 mb-3'>
          <AdsGoogleDefault
            slot="7526115814"
          />
        </div> */}

        <ButtonExamComponent
          post={this.props.postDetail}
          text='Luyện tập (thi thử)'
        />
      </div >
    );
  }
}

export default ContentLeftComponent;