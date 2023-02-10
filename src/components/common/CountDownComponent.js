import React, { Component } from 'react';

const initialState = {
  hour: 0,
  minute: 0,
  second: 0,
  isFinish: false,
}

class CountDownComponent extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.timeDown = Number.parseInt(this.props.timeDown);
    this.state = {
      ...initialState,
    }
  }


  componentDidMount() {
    this.timer = setInterval(() => {
      var h = Math.floor(this.timeDown / 3600);
      var m = Math.floor(this.timeDown % 3600 / 60);
      var s = Math.floor(this.timeDown % 3600 % 60);

      this.timeDown -= 1;
      if (this.timeDown === 0) {
        clearInterval(this.timer);
        this.setState({
          isFinish: true,
        }, () => {
          this.props.onFinish({h, m, s});
        });
      }
      else {
        this.setState({
          hour: h,
          minute: m,
          second: s,
        });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.props.onFinish({
      h: this.state.hour,
      m: this.state.minute,
      s: this.state.second,
    });
  }

  render() {
    return (
      <span className={this.props.className}>
        {`${this.state.hour} : ${this.state.minute} : ${this.state.second} s`}
      </span>
    );
  }
}

export default CountDownComponent;