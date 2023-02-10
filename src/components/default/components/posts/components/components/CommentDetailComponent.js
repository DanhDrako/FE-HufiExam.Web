import { Button, Comment, Dropdown, List, Menu, message, Tooltip } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { DeleteOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';
import { Apis } from '../../../../../../common/utils/Apis';
import { CommentReactKeys, NotificationKeys } from '../../../../../../common/utils/keys';
import FACTORY from '../../../../../../common/FACTORY';
import TextArea from 'antd/lib/input/TextArea';
import PagingComponent from '../../../../../common/PagingComponent';

// import loadable from '@loadable/component';
// const PagingComponent = loadable(() => import('../../../../../common/PagingComponent'));

class CommentDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      commentContent: null,
      loading: false,
      glLoading: false,
      data: [],
      currentPage: 1,
      isEdit: false,
      commentIdEdit: null,
      total: 0,
    }
  }

  componentDidMount() {
    this.loadListComment(null);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.postId !== nextProps.postId
      || this.props.userLoged !== nextProps.userLoged)
      this.loadListComment(null);
  }

  getAuthorIdLoged = () => {
    if (this.props.userLoged && this.props.userLoged.userId)
      return this.props.userLoged.userId;
    return null;
  }

  deleteComment = async (commentId) => {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const find = this.state.data.find((v) => v.id === commentId);
    if (!find) return;
    // fork remove
    this.setState({
      data: this.state.data.filter((v) => v.id !== commentId),
      total: this.state.total - 1,
    });
    PublicModules.fun_delete(
      Apis.API_HOST + Apis.API_TAILER.COMMENT + commentId,
      PublicModules.fun_getConfigBearerDefault({}),
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        message.error(`Xóa bình luận không thành công [${dataRes.message}]`);
        this.setState({
          data: [...this.state.data, find],
          total: this.state.total + 1,
        });
        return;
      }
    });
  }

  editComment(commentId) {
    const find = this.state.data.find((v) => v.id === commentId);
    if (!find) return;
    // fill textbox
    this.setState({
      commentContent: find.content,
      isEdit: true,
      commentIdEdit: commentId,
    });
  }

  getOthersMenu = (rowAuthorId, commentId) => {
    const authorLoged = this.getAuthorIdLoged();
    if (!authorLoged) return;
    if (authorLoged !== rowAuthorId) return;
    return (
      <Dropdown overlay={
        <Menu>
          <Menu.Item onClick={() => this.editComment(commentId)} key='EDIT_COMMENT'>
            <span role='link'>
              Sửa
              </span>
          </Menu.Item>
          <Menu.Item onClick={() => this.deleteComment(commentId)} key='DELETE_COMMENT'>
            <span role='link'>
              Xóa
              </span>
          </Menu.Item>
        </Menu>
      } placement="bottomLeft" arrow>
        <span role='link' style={{ fontSize: '12px' }} type='link'>Khác...</span>
      </Dropdown>
    );
  }

  async btnReactClicked(commentId, type, currentStatus) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    if (!this.getAuthorIdLoged()) {
      message.info('Để làm điều này, cần đăng nhập trước.');
      return;
    }
    // fork like first
    let newStatus = null;
    if (type === CommentReactKeys.LIKE && (currentStatus === CommentReactKeys.NOTHING || currentStatus === CommentReactKeys.DISLIKE))
      newStatus = CommentReactKeys.LIKE;
    else if (type === CommentReactKeys.DISLIKE && (currentStatus === CommentReactKeys.NOTHING || currentStatus === CommentReactKeys.LIKE))
      newStatus = CommentReactKeys.DISLIKE;
    else if (type === CommentReactKeys.LIKE && currentStatus === CommentReactKeys.LIKE)
      newStatus = CommentReactKeys.NOTHING;
    else if (type === CommentReactKeys.DISLIKE && currentStatus === CommentReactKeys.DISLIKE)
      newStatus = CommentReactKeys.NOTHING;
    else newStatus = CommentReactKeys.LIKE;

    // caculate react fork
    let addLike = 1, addDislike = 1;
    if (currentStatus === CommentReactKeys.NOTHING) {
      if (newStatus === CommentReactKeys.LIKE) addDislike = 0;
      else addLike = 0;
    } else if (currentStatus === CommentReactKeys.LIKE) {
      if (newStatus === CommentReactKeys.DISLIKE) addLike = -1;
      else {
        addLike = -1;
        addDislike = 0;
      }
    } else {// dislike
      if (newStatus === CommentReactKeys.LIKE) addDislike = -1;
      else {
        addDislike = -1;
        addLike = 0;
      }
    }

    const commentFind = this.state.data.find((v) => v.id === commentId);
    if (!commentFind) return;
    const commentFindIndex = this.state.data.indexOf(commentFind);
    const newComment = {
      ...commentFind, status: newStatus,
      countLike: commentFind.countLike + addLike,
      countDislike: commentFind.countDislike + addDislike,
    };
    const newData = [...this.state.data];
    newData[commentFindIndex] = newComment;
    this.setState({
      data: [...newData],
    });
    PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.COMMENT_REACT,
      {
        id: commentId,
        status: newStatus,
      },
      PublicModules.fun_getConfigBearerDefault({}),
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        message.error('Hành động không thành công - ' + PublicModules.fun_mapErrorToMessage(dataRes.message));
        const newData = [...this.state.data];
        newData[commentFindIndex] = commentFind;
        this.setState({
          data: [...newData]
        });
        return;
      }
    });
  }

  mapCommetToRow = (v) => {
    return {
      key: v.id,
      author: v.author,
      avatar: FACTORY.fun_getAvatarImageView(v.avatar, v.avatarUploadType),
      content: (
        <p>
          {v.content}
        </p>
      ),
      contentOrigin: v.content,
      datetime: (
        <span>
          <Tooltip color={FACTORY.TOOLTIP_COLOR} title={moment(v.time).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(v.time).fromNow()}</span>
          </Tooltip>
          <span style={{ margin: '0px 0px 0px 7px' }}>
            {FACTORY.fun_getRoleUI(v.role)}
          </span>
        </span>
      ),
      actions: [
        <Tooltip key="comment-basic-like" title="Like" color={FACTORY.TOOLTIP_COLOR}>
          <span onClick={() => this.btnReactClicked(v.id, CommentReactKeys.LIKE, v.status)}>
            {React.createElement(v.status === CommentReactKeys.LIKE ? LikeFilled : LikeOutlined)}
            <span className="comment-action">
              {v.countLike}
            </span>
          </span>
        </Tooltip>,
        <Tooltip key="comment-basic-dislike" title="Dislike" color={FACTORY.TOOLTIP_COLOR}>
          <span onClick={() => this.btnReactClicked(v.id, CommentReactKeys.DISLIKE, v.status)}>
            {React.createElement(v.status === CommentReactKeys.DISLIKE ? DislikeFilled : DislikeOutlined)}
            <span className="comment-action">
              {v.countDislike}
            </span>
          </span>
        </Tooltip>,
        this.getOthersMenu(v.authorId, v.id),
      ],
    };
  }

  loadListComment = async (addQuery) => {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    this.setState({
      glLoading: true,
    });
    if (!addQuery) addQuery = '';
    const userId = this.getAuthorIdLoged();
    let query = '';
    if (userId)
      query += '?userId=' + userId;
    PublicModules.fun_get(
      Apis.API_HOST + Apis.API_TAILER.COMMENT + this.props.postId + query + addQuery,
    ).then((dataRes) => {
      // error ?
      if (!dataRes.success) {
        CoreUI.fun_showNotification({
          type: NotificationKeys.ERROR,
          title: 'Tải list comment lỗi',
          message: PublicModules.fun_mapErrorToMessage(dataRes.message),
        });
        this.setState({
          glLoading: false,
        });
        return;
      }
      // success

      this.setState({
        isModalVisible: true,
        glLoading: false,
        data: dataRes.data,
        total: dataRes.total,
      });
    });
  }

  onPageChange = (page, pageSize) => {
    const addQuery = `&page=${page}&limit=${pageSize}`;
    this.setState({ isModalVisible: false, currentPage: page, pageSize: pageSize });
    this.loadListComment(addQuery);
  }

  showModal = () => {
    this.setState({
      currentPage: 1,
    });
    this.loadListComment(null);
  };

  handleOk = async () => {
    const CoreUI = await FACTORY.GET_CORE_UI();
    // user loged ?
    const user = FACTORY.fun_getUserLoginLocalStorage();
    if (!user) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.INFO,
        title: 'Cần đăng nhập !',
        message: 'Để làm được điều này bạn cần đăng nhập trước.'
      });
      return;
    }

    if (!this.state.commentContent || this.state.commentContent.trim() === '') return;
    const commentContent = this.state.commentContent.trim();
    this.setState({
      loading: true,
    });

    // insert or update ?
    if (this.state.isEdit)
      await this.editCommentDB(commentContent);
    else
      await this.insertComment(commentContent);
  };

  async editCommentDB(commentContent) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    if (!this.state.commentIdEdit) return;
    const dataRes = await PublicModules.fun_put(
      Apis.API_HOST + Apis.API_TAILER.COMMENT + this.state.commentIdEdit,
      {
        content: commentContent,
      },
      PublicModules.fun_getConfigBearerDefault({}),
    );
    // error ?
    if (!dataRes.success) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Hành động không thành công!',
        message: PublicModules.fun_mapErrorToMessage(dataRes.message),
      });
      this.setState({
        loading: false,
      });
      return;
    }

    // success
    const v = dataRes.data;
    const old = this.state.data.find((v) => v.id === this.state.commentIdEdit);
    if (!old) return;
    const oldIndex = this.state.data.indexOf(old);
    const newComment = { ...old, ...v };
    const newData = [...this.state.data];
    newData[oldIndex] = newComment;
    this.setState({
      loading: false,
      commentContent: '',
      isEdit: false,
      data: [...newData]
    });
  }

  async insertComment(commentContent) {
    const PublicModules = await FACTORY.GET_PUBLIC_MODULES();
    const CoreUI = await FACTORY.GET_CORE_UI();
    const dataRes = await PublicModules.fun_post(
      Apis.API_HOST + Apis.API_TAILER.COMMENT,
      {
        content: commentContent,
        postId: this.props.postId,
      },
      PublicModules.fun_getConfigBearerDefault({}),
    );

    // error ?
    if (!dataRes.success) {
      CoreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: 'Hành động không thành công!',
        message: PublicModules.fun_mapErrorToMessage(dataRes.message),
      });
      this.setState({
        loading: false,
      });
      return;
    }

    // success
    const v = dataRes.data;
    this.setState({
      loading: false,
      commentContent: '',
      data: [{
        id: v.id,
        author: v.user.username,
        avatar: v.user.avatar,
        avatarUploadType: v.user.avatarUploadType,
        authorId: v.user.id,
        content: v.content,
        time: v.createAt,
        countLike: 0,
        countDislike: 0,
        status: CommentReactKeys.NOTHING,
      }, ...this.state.data],
      total: this.state.total + 1,
    });
  }

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  tbChange = (e) => {
    this.setState({
      commentContent: e.target.value,
    });
  }

  render() {
    return (
      <>
        {FACTORY.fun_getGl_loading(this.state.glLoading)}
        <List
          className="comment-list"
          itemLayout="horizontal"
          dataSource={this.state.data.map((v) => this.mapCommetToRow(v))}
          renderItem={item => (
            <li>
              <Comment
                actions={item.actions}
                author={item.author}
                avatar={item.avatar}
                content={item.content}
                datetime={item.datetime}
              />
            </li>
          )}
        />
        <PagingComponent
          total={this.state.total}
          onPageChange={(page, limit) => this.onPageChange(page, limit)}
        />
        <div>
          <TextArea
            rows={3}
            placeholder='Nhập nội dung bình luận.'
            onChange={(e) => this.tbChange(e)}
            value={this.state.commentContent}
          />
          <button
            onClick={() => this.handleOk()}
            className='btn-ds outline-pr mt-3 mb-5'
          >
            <i className="far fa-comment-dots">&nbsp;</i>Bình luận
          </button>
          {this.state.isEdit ?
            <Button onClick={() => this.setState({ isEdit: false, commentContent: '', commentIdEdit: null, })} type='link' danger>
              <DeleteOutlined /> D
            </Button> : ''}
          <hr />
        </div>
      </>
    );
  }
}

export default CommentDetailComponent;