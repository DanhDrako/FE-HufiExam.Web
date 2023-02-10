import React, { Component } from "react";
import { PublicModules } from "../../common/PublicModules";
import { Apis } from "../../common/utils/Apis";
import FooterComponents from "../../components/home/footer/FooterComponents";
import HeaderComponent from "../../components/home/header/HeaderComponent";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Radio, Select } from "antd";
import moment from "moment";
import { CoreUI } from "../../common/CoreUI";
import { NotificationKeys } from "../../common/utils/keys";

const optionPrice = {
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: "Biểu đồ giá vàng",
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
      max: 10,
      min: 0,
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      max: 10,
      min: 0,
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

class PriceGold extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: {
        labels: [],
        datasets: [],
      },
      listDT: null,
      isLoading: false,
      selectProvince: "Hồ Chí Minh",
      selectType: "Vàng nhẫn SJC 99,99 1 chỉ, 2 chỉ, 5 chỉ",
      listEnd: [],
      queryDay: 1,
    };
    this.timeLoad = null;
  }

  componentDidMount() {
    this.getDataPrice();
    this.setTimeRun();
  }

  componentWillUnmount() {
    clearInterval(this.timeLoad);
  }

  setTimeRun() {
    if (this.timeLoad) return;
    this.timeLoad = setInterval(() => {
      this.getDataPrice();
    }, 300000);
  }

  sortFunction(a, b) {
    var dateA = new Date(a.updateAt);
    var dateB = new Date(b.updateAt);
    return dateA > dateB ? 1 : -1;
  }

  getDataPrice() {
    if (this.state.isLoading) return;


    this.setState({ isLoading: true }, async () => {
      const keyPLoading = CoreUI.fun_showNotification({
        type: NotificationKeys.LOADING,
        message: 'Đang tải thông tin giá vàng, xin hãy chờ trong giây lát.',
      });

      const dataRes = await PublicModules.fun_get(
        Apis.API_HOST +
          Apis.API_TAILER.PRICE_GOLD +
          `?day=${this.state.queryDay}&province=${this.state.selectProvince}`
      );
      const data = dataRes.success && dataRes.data ? dataRes.data : [];
      const filterData = data.filter(
        (data) =>
          data.province === this.state.selectProvince &&
          data.typeGold === this.state.selectType
      );

      filterData.sort(this.sortFunction);
      const listEnd = filterData[filterData.length - 1];
      const listData = {
        labels: filterData.map((data) => moment(data.updateAt).calendar()),
        datasets: [
          {
            label: "Giá bán",
            data: filterData.map((data) => data.sell * 1000),
            borderColor: "#36a2eb",
            backgroundColor: "#90d0f6",
            yAxisID: "y",
          },
          {
            label: "Giá mua",
            data: filterData.map((data) => data.buy * 1000),
            borderColor: "#f96384",
            backgroundColor: "#fbb0c2",
            yAxisID: "y1",
          },
        ],
      };

      const listPrice =
        filterData.map((data) => data.sell) +
        "," +
        filterData.map((data) => data.buy);
      let arrPrice = listPrice.split(",");
      arrPrice = arrPrice.map((data) => Number.parseFloat(data));
      let maxPrice = Math.max.apply(Math, arrPrice) * 1000 + 50;
      let minPrice = Math.min.apply(Math, arrPrice) * 1000 - 50;

      optionPrice.scales.y.max = maxPrice;
      optionPrice.scales.y.min = minPrice;
      optionPrice.scales.y1.min = minPrice;
      optionPrice.scales.y1.max = maxPrice;

      this.setState({ listData, isLoading: false, listDT: data, listEnd}, () => {
      CoreUI.fun_closeNotificationLoading(keyPLoading);
      });
    });
  }

  renderProvince() {
    if (!this.state.listDT) return;
    var newSelectPv = ['Hồ Chí Minh', 'Nha Trang', 'Cà Mau', 'Bình Phước', 'Huế', 'Biên Hòa', 'Quãng Ngãi', 'Miền Tây', 'Bạc Liêu', 'Long Xuyên', 'Đà  Nẵng', 'Hà Nội', 'Quy Nhơn', 'Hạ Long', 'Phan Rang', 'Quảng Nam'];
    return (
      <Select
        style={{ minWidth: "70%" }}
        defaultValue={this.state.selectProvince}
        onChange={(e) => this.onChangeSelectProvince(e)}
      >
        {newSelectPv.map((data) => (
          <Select.Option key={data} value={data}>
            {data}
          </Select.Option>
        ))}
      </Select>
    );
  }

  renderTypeGold() {
    if (!this.state.listDT) return;
    var newSelect = [];
    for (var i = 0; i < this.state.listDT.length; i++) {
      if (newSelect.indexOf(this.state.listDT[i].typeGold) === -1) {
        if (this.state.listDT[i].province === this.state.selectProvince) {
          newSelect.push(this.state.listDT[i].typeGold);
        }
      }
    }
    return (
      <Select
        style={{ width: "70%" }}
        defaultValue={this.state.selectType}
        onChange={(e) => this.onChangeSelectType(e)}
      >
        {newSelect.map((data) => (
          <Select.Option key={data} value={data}>
            {data}
          </Select.Option>
        ))}
      </Select>
    );
  }

  onChangeSelectProvince(value) {
    this.setState(
      {
        selectProvince: value,
      },
      () => {
        this.getDataPrice();
      }
    );
  }

  onChangeSelectType(value) {
    this.setState(
      {
        selectType: value,
      },
      () => {
        this.getDataPrice();
      }
    );
  }

  handleQueryChange = (e) => {
    this.setState({queryDay: e.target.value}, () => {
      this.getDataPrice();
    })
  }

  render() {
    return (
      <>
        <HeaderComponent />
        <div className="container">
          <h3 className="text-center mt-3">Biểu đồ giá vàng</h3>
          <div className="row mb-5">
            <div className="col-lg-6 mt-3">
              <span style={{ width: "20%" }}>
                Chọn thành phố : {this.renderProvince()}
              </span>
            </div>
            <div className="col-lg-6 mt-3">
              <span style={{ width: "20%" }}>
                Chọn loại vàng: {this.renderTypeGold()}
              </span>
            </div>
            <div className="col-lg-4 mt-3">
              <span>
                <h5>
                  Thời gian cập nhật:{" "}
                  <span>
                    {this.state.listEnd
                      ? moment(this.state.listEnd.updateAt).calendar()
                      : 0}{" "}
                  </span>
                </h5>
              </span>
            </div>
            <div className="col-lg-4 mt-3">
              <span>
                <h5>
                  Giá bán ra hiện tại:{" "}
                  <span style={{ color: "#36a2eb" }}>
                    {this.state.listEnd ? this.state.listEnd.sell : 0} tr đ
                  </span>
                </h5>
              </span>
            </div>
            <div className="col-lg-4 mt-3">
              <span>
                <h5>
                  Giá mua vào hiện tại:{" "}
                  <span style={{ color: "#f96384" }}>
                    {this.state.listEnd ? this.state.listEnd.buy : 0} tr đ
                  </span>
                </h5>
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12" style={{ textAlign: "right" }}>
              <Radio.Group value={this.state.queryDay} onChange={(e) => this.handleQueryChange(e)}>
                <Radio.Button value={1}>1D</Radio.Button>
                <Radio.Button value={3}>3D</Radio.Button>
                <Radio.Button value={7}>7D</Radio.Button>
                <Radio.Button value={30}>1M</Radio.Button>
                <Radio.Button value={90}>3M</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <Line data={this.state.listData} options={optionPrice}></Line>
        </div>
        <FooterComponents />
      </>
    );
  }
}

export default PriceGold;
