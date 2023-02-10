import { message, Space, Tooltip } from 'antd';
import React, { Component } from 'react';
import FACTORY from '../../../../../../common/FACTORY';
import { Apis } from '../../../../../../common/utils/Apis';
import { ReactTypeKeys } from '../../../../../../common/utils/keys';

class ButtonsReactComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countExam: null,
      countLike: null,
    }
  }

  forkReact(post, type, value) {
    if (type === ReactTypeKeys.USER_LIKE) {
      this.props.post.isLike = !this.props.post.isLike;
      const newValue = post.countLike + value;
      this.props.post.countLike = newValue;
      this.setState({
        countLike: newValue,
      });
    } else {
      this.props.post.isExam = !this.props.post.isExam;
      const newValue = post.countExam + value;
      this.props.post.countExam = newValue;
      this.setState({
        countExam: newValue,
      });
    }
  }

  async btnUserReactClicked(post, type) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const userLoged = FACTORY.fun_getUserLoginLocalStorage();
    if (!userLoged) {
      message.info('Làm điều này bạn cần đăng nhập trước.');
      return;
    }
    // fork react first
    if (post.isExam && type === ReactTypeKeys.EXAM_COMMIT)
      this.forkReact(post, type, -1);
    else if (post.isLike && type === ReactTypeKeys.USER_LIKE)
      this.forkReact(post, type, -1);
    else
      this.forkReact(post, type, 1);
    PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.USER_REACT,
      {
        postId: post.id,
        reactType: type,
      },
      PublicModules.fun_getConfigBearerDefault({}),
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        // revort react
        if (post.isExam && type === ReactTypeKeys.EXAM_COMMIT)
          this.forkReact(post, type, 1);
        else if (post.isLike && type === ReactTypeKeys.USER_LIKE)
          this.forkReact(post, type, 1);
        else
          this.forkReact(post, type, -1);
        message.error(dataRes.message);
        return;
      }
    });
  }

  render() {
    const post = this.props.post;
    return (
      <Space size='large'>
        <Tooltip title="Xác nhận có thi" color={FACTORY.TOOLTIP_COLOR} key='green'>
          <span
            className='font-react'
            role="link" onClick={() => this.btnUserReactClicked(post, ReactTypeKeys.EXAM_COMMIT)}>
            {/* <img alt='icon-exam' className='icon-react' src={this.getColorExam()} /> */}
            {this.props.post.isExam ?
              <i className="fas fa-star"></i> : <i className="far fa-star"></i>}
            <span className='m-1'>{
              this.state.countExam
              || post.countExam
            }</span>
          </span>
        </Tooltip>
        <Tooltip title="Cho TG 1 LIKE" color={FACTORY.TOOLTIP_COLOR} key='pink'>
          <span
            className='font-react'
            role="link" onClick={() => this.btnUserReactClicked(post, ReactTypeKeys.USER_LIKE)}>
            {/* <img alt='icon-like' className='icon-react' src={this.getColorLike()} /> */}
            {this.props.post.isLike ?
              <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>}
            <span className='m-1'>{
              this.state.countLike
              || post.countLike
            }</span>
          </span>
        </Tooltip>
        <Tooltip title={"Số người bình luận: " + post.countComment} color={FACTORY.TOOLTIP_COLOR} key='purple'>
          <span
            className='font-react'
            role="link" >
            {this.props.post.isComment ?
              <i className="fas fa-comments"></i> : <i className="far fa-comment-dots"></i>}
            <span className='m-1'>
              {post.countComment}
            </span>
          </span>
        </Tooltip>
      </Space>
    );
  }
}

export default ButtonsReactComponent;