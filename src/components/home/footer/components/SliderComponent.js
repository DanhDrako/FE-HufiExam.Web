import React, { Component } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  initialSlide: 0,
  margin: 10,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        initialSlide: 0,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 0,
        infinite: true,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        infinite: true,
      }
    }
  ]
};

class SliderComponent extends Component {
  constructor(props) {
    super(props);
    this.slider = React.createRef();
  }

  componentDidMount() {
    if (this.slider) this.slider.slickPlay();
  }

  render() {
    return (
      <Slider
        afterChange={(index) => this.props.onChange(index)}
        ref={(ref) => this.slider = ref} {...settings}>
        {this.props.datas}
      </Slider>
    );
  }
}

export default SliderComponent;