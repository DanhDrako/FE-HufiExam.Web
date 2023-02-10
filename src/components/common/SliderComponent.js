import React, { Component } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import loadable from '@loadable/component';

const Slider = loadable(() => import('react-slick'));

class SliderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        dots: this.props.dots || false,
        infinite: false,
        speed: 500,
        slidesToShow: this.props.numDisplay,
        slidesToScroll: this.props.numDisplay,
        initialSlide: 0,
        margin: 10,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      }
    }
  }

  render() {
    return (
      <Slider {...this.state.settings}>
        {this.props.datas}
      </Slider>
    );
  }
}

export default SliderComponent;