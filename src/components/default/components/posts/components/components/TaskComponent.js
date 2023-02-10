import React, { Component } from "react";
import { Link } from "react-router-dom";
import ButtonCommentComponentV2 from "./ButtonCommentComponent";
import ButtonExamComponent from "./ButtonExamComponent";
import ButtonRealExamComponent from "./ButtonRealExamComponent";

class TaskComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMaxUI: false,
    };
  }

  getButtonExam(v, bigButtonText) {
    if (v.isRealTest) {
      return <ButtonRealExamComponent post={v} text={"Làm kiểm tra"} />;
    } else {
      return <ButtonExamComponent post={v} text={bigButtonText} />;
    }
  }

  getMaxUI() {
    const post = this.props.post;
    const userLoged = this.props.userLoged;
    const bigButtonText = post.isBlackMarket
      ? "Xem thông tin người bán"
      : "Luyện tập (thi thử)";
    return (
      <div className="card-task">
        <div className="row mb-2 mt-4">
          <div className="col-6">
            <Link to={"/post/" + post.slug + "." + post.id}>
              <button className="btn-ds outline-pr block">
                <i className="far fa-eye">&nbsp;</i>
                Xem C.Tiết
              </button>
            </Link>
          </div>
          <div className="col-6">
            <ButtonCommentComponentV2 userLoged={userLoged} postId={post.id} />
          </div>
        </div>
        {/* {post.isRealTest ? (
          <ButtonRealExamComponent post={post} text={'Làm kiểm tra'} />
        ) : (
          <ButtonExamComponent post={post} text={bigButtonText} />
        )} */}


        {this.getButtonExam(post,bigButtonText)}
      </div>
    );
  }

  getMinUI() {
    return (
      <div className="card-task">
        <hr className="m-1 mb-2 mt-2" />
        <button
          className="btn-ds outline block"
          onClick={() => this.setState({ isMaxUI: true })}
        >
          Xem C.Tiết
        </button>
      </div>
    );
  }

  render() {
    // if (this.state.isMaxUI)
    return this.getMaxUI();
    // return this.getMinUI();
  }
}

export default TaskComponent;
