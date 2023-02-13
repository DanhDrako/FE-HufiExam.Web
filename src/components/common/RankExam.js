
import React, { Component } from "react";
import FACTORY from "../../common/FACTORY";
import { Apis } from "../../common/utils/Apis";
import { Checkbox, Collapse, message, Tag, Tooltip } from "antd";
import {
  CheckOutlined,
  FacebookFilled,
  MailFilled,
  SyncOutlined,
} from "@ant-design/icons";
import { MessageKeys, NotificationKeys } from "../../common/utils/keys";
import MyImageView from "./MyImageView";
import moment from "moment";
import PagingComponent from "./PagingComponent";
import { PublicModules } from "../../common/PublicModules";
import { CoreUI } from "../../common/CoreUI";
//XUAT EX
import { CSVLink } from "react-csv";
const { Panel } = Collapse;


const genExtra = (userCount) => (
  <>
    {/* <SyncOutlined
      // spin
      onClick={(_event) => {
        message.success("Đang đồng bộ theo thời gian thực");
      }}
      className="rank-text"
    /> */}
    &nbsp;{userCount} người thi
  </>
);

class RankExam extends Component {
  constructor(props) {
    super(props);
    const userLoged = FACTORY.fun_getUserLoginLocalStorage();
    this.userRole = null;
    this.userToken = null;
    if (userLoged) {
      this.userRole = userLoged.role;
      this.userToken = userLoged.token
    };
    this.state = {
      listRank: [],
      total: 0,
      expandIconPosition: "left",
      isLoading: false,
    };
    this.pubs = null;
    this.coreUI = null;
    this.timer = null;
    this.CoreUI = null;
    this.currentPageUser = 1;
    this.currentLimitUser = 20;
  }

  startSyncRank() {
    this.timer = setInterval(() => {
      this.loadRankExam();
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  onPositionChange = (expandIconPosition) => {
    this.setState({ expandIconPosition });
  };

  initLibs = async () => {
    if (!this.pubs) this.pubs = await FACTORY.GET_PUBLIC_MODULES();
    if (!this.coreUI) this.coreUI = await FACTORY.GET_CORE_UI();
  };

  componentDidMount() {
    this.loadRankExam();
    this.startSyncRank();
  }

  loadRankExam = async () => {
    await this.initLibs();
    const token = `&request_token=${this.userToken}`
    let url =
      Apis.API_HOST +
      Apis.API_TAILER.RANK +
      `?pageUsers=${this.currentPageUser}&limitUsers=${this.currentLimitUser}${this.userToken ? token : ''}`;
    if (this.props.postId) url += this.props.postId;
    const dataRes = await this.pubs.fun_get(url);
    if (!dataRes.success) {
      this.coreUI.fun_showNotification({
        type: NotificationKeys.ERROR,
        title: "Tải rank lỗi",
        message: MessageKeys.CHECK_CONNECTION,
      });
      return;
    }
    this.setState({
      listRank: dataRes.data,
      total: dataRes.total,
      isLoading: false,
    });
  };

  getMedal(top) {
    top = (this.currentPageUser - 1) * this.currentLimitUser + top;
    if (top > 20) return "";

    if (top === 1)
      return (
        <span className="fw-bold" style={{ color: "#cfcf23" }}>
          <i className="fas fa-crown"></i>
          &nbsp;TOP: {top}
        </span>
      );
    else if (top === 2)
      return (
        <span className="fw-bold" style={{ color: "#a2a69d" }}>
          <i className="fas fa-medal"></i>
          &nbsp;TOP: {top}
        </span>
      );
    else if (top === 3)
      return (
        <span className="fw-bold" style={{ color: "#a6650a" }}>
          <i className="fas fa-medal"></i>
          &nbsp;TOP: {top}
        </span>
      );
    return (
      <span className="fw-bold rank-text">
        <i className="fas fa-award"></i>
        &nbsp;TOP: {top}
      </span>
    );
  }

  async onShowRank(checked, postId) {
    if (!checked) return;
    const isConfirm = await this.coreUI.fun_showConfirm({
      title: "Xác nhận: Ẩn bảng xếp hạng này ?",
      message:
        "Sau khi hành động này được xác nhận, bảng xếp hạng này sẽ bị ẩn",
    });
    if (!isConfirm) return;
    if (this.state.isLoading) return;
    this.setState({ isLoading: true }, async () => {
      const dataRes = await PublicModules.fun_put(
        Apis.API_HOST + Apis.API_TAILER.POST_SHOWRANK + postId,
        {
          isShowRank: false,
        },
        PublicModules.fun_getConfigBearerDefault({})
      );
      
      this.setState({ isLoading: false }, () => {
        if (!dataRes.success) {
          CoreUI.fun_showNotification({
            message: "Ẩn bảng xếp hạng bị lỗi, hãy thử lại.",
          });
          return;
        }
        this.loadRankExam();
      });
    });
  }
  ///
  handleExportExcel(postID){
    let data = [];
    this.state.listRank.forEach(function(v){
      if(postID === v.post.id)
      {
        v.users.forEach(function(a){
        var us = {};
        us.diem = a.point;
        us.lanthi = a.tryNumber;
        us.ten = a.user.displayName;
        us.gioitinh = a.user.sex;
        us.ngaysinh = a.birthday;
        us.gmail = a.user.email;
        data.push(us);
      })
    }
    }
    )
    return data;
  }
  reloadListRankExam() {
    let headers = [
      { label: "Tên", key: "ten" },
      { label: "Giới tính", key: "gioitinh" },
      { label: "Ngày sinh", key: "ngaysinh" },
      { label: "Gmail", key: "gmail" },
      { label: "Lần thi", key: "lanthi" },
      { label: "Điểm số", key: "diem" }
    ];
    return this.state.listRank.map((v, k) => {
      return (
        <Panel
          header={
            <span className="fw-bold rank-text">
              {this.userRole === "ADMIN" && v.post.isShowRank ? (
                <Checkbox
                  onChange={(e) => this.onShowRank(e.target.checked, v.post.id)}
                ></Checkbox>
              ) : (
                ""
              )}
              &nbsp; &nbsp;
              {v.post.title}             
            </span>
          }
          key={k}
          extra={genExtra(v.post.count)}
        >        
          {v.users.map((u, s) => {
            return (
              <div
                className="border m-2 panel-border"
                style={{ borderRadius: 3 }}
                key={k + s}
              >
                
                {this.getMedal(s + 1)} &nbsp;
                <span className="fw-bold rank-text">HUFIDOC: </span>
                <MyImageView
                  width={32}
                  height={32}
                  className="rounded-circle"
                  style={{ margin: "0px 7px -10px 7px" }}
                  src={FACTORY.fun_getAvatarImageView(
                    u.user.avatar,
                    u.user.avatarUploadType
                  )}
                  alt="avatar-hufier-exam-rank"
                />
                <span className="rank-text">
                  {u.user.displayName || u.user.username}
                </span>{" "}
                &nbsp;
                {u.point < 5 ? (
                  <Tag className="tag-sec">Điểm số={u.point}</Tag>
                ) : (
                  <Tag className="tag-pr">Điểm số={u.point}</Tag>
                )}
                {u.tryNumber > 3 ? (
                  <Tag className="tag-pr">Lần thử lại={u.tryNumber}</Tag>
                ) : (
                  <Tag className="tag-sec">Lần thử lại={u.tryNumber}</Tag>
                )}
                &nbsp;<span className="rank-text">Kết nối qua:</span> &nbsp;
                {u.user.linkFacebook ? (
                  <a
                    href={u.user.linkFacebook}
                    className="_text-thr"
                    target="blank"
                  >
                    <FacebookFilled /> Facebook,{" "}
                  </a>
                ) : (
                  <Tooltip
                    color={FACTORY.TOOLTIP_COLOR}
                    className="_text-thr"
                    title="Người này chưa cập nhật Link Facebook !Mẹo: Nhấn vào biểu tượng avatar góc bên phải, phía trên cùng -> Cá nhân hóa -> cập nhật link facebook"
                  >
                    Facebook,{" "}
                  </Tooltip>
                )}{" "}
                {/* <a className="_text-thr" href={"mailto:" + u.user.email}>
                  <MailFilled /> Gmail.
                </a> */}
                &nbsp;
                <Tag color="processing">
                  <CheckOutlined /> {moment(u.updateAt).fromNow()}
                </Tag>
              </div>
            );
          })}

          <PagingComponent
            total={v.post.count}
            onPageChange={(page, limit) => this.onPageChange(page, limit)}
            nonScroll={true}
          />
          <CSVLink 
          data={this.handleExportExcel(v.post.id)}
          headers= {headers}
          filename = {v.post.title}    
          >
            <button style={{
              border: "none",
              marginLeft: 10,
              color: "white",
            }}>
            <span className="fw-bold rank-text" style={{
              color: "green",
            }}>
            XUẤT ĐIỂM THI
            </span>
            </button>
          </CSVLink>
        </Panel>       
      );
    });
    
  }

  onPageChange(page, limit) {
    this.currentPageUser = page;
    this.currentLimitUser = limit;
    this.loadRankExam();
  }

  render() {
    return (
      <>
        <Collapse
          defaultActiveKey={["0"]}
          expandIconPosition={"right"}
          className="rank-header"
        >
          {this.reloadListRankExam()}
        </Collapse>
      </>
    );
  }
}

export default RankExam;
