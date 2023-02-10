import React, { Component } from 'react';

class SliderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChange: false,
    }
  }

  getCard() {
    if (this.state.isChange)
      return (
        <>
          <img src="/image/0xDHTH.jpg" className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <h5>CHANGE LOGO HERE</h5>
            <p>Some representative placeholder content for the first slide.</p>
          </div>
        </>
      );
    else
      return (
        <>
          <img src="/image/0xDHTH.jpg" className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <h5><span className="badge bg-primary text-white">First slide label</span></h5>
            <p><span className="badge bg-primary text-white">Some representative placeholder content for the first slide.</span></p>
          </div>
        </>
      );
  }

  render() {
    return (
      <div id="carouselExampleDark" className="mt-4 mb-4 carousel carousel-dark slide" data-bs-ride="carousel">
        <div id="list-btn-dots-slider" className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to={0} className="active" aria-current="true" aria-label="Slide 1" />
          <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to={1} aria-label="Slide 2" />
          <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to={2} aria-label="Slide 3" />
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval={10000}>
            {this.getCard()}
          </div>
          <div className="carousel-item" data-bs-interval={2000}>
            <img src="/image/0xDHTH.jpg" className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5><span className="badge bg-primary text-white">Second slide label</span></h5>
              <p><span className="badge bg-primary text-white">Some representative placeholder content for the second slide.</span></p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="/image/0xDHTH.jpg" className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5><span className="badge bg-primary text-white">Third slide label</span></h5>
              <p><span className="badge bg-primary text-white">Some representative placeholder content for the third slide.</span></p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    );
  }
}

export default SliderComponent;