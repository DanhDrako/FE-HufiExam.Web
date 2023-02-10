import React, { Component } from 'react';
import SliderComponent from './SliderComponent';

function Author(props) {
  const active = props.isActive ? 'is-active' : '';
  return (
    <div className={"our-team " + active}>
      <div className="picture">
        <img className="img-fluid" src={props.img} alt='icon' />
      </div>
      <div className="team-content">
        <h3 className="name" style={{maxHeight: '33px', overflow: 'hidden'}}>{props.authorName}</h3>
        <h4 className="title" >{props.Class}</h4>
        <h4 className="title" >{props.title}</h4>
      </div>
      <ul className="social">
        <li><a href={props.facebook} className="fab fa-facebook-f" target="blank" aria-hidden="true"><span className='d-none'>fa</span></a></li>
        <li><a href={props.twitter} className="fab fa-twitter" target="blank" aria-hidden="true"><span className='d-none'>tw</span></a></li>
        <li><a href={props.github} className="fab fa-github" target="blank" aria-hidden="true"><span className='d-none'>gt</span></a></li>
        <li><a href={props.linkedin} className="fab fa-linkedin-in" target="blank" aria-hidden="true"><span className='d-none'>li</span></a></li>
      </ul>
    </div>
  )
}

class AuthorsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSelectedIndex: 0,
    }
  }

  authorThang(key) {
    return (
      <Author
        key={key}
        isActive={this.state.currentSelectedIndex === key}
        img='/image/authors/Author_Thang.png'
        authorName='Ngô Huy Thắng'
        Class='09DHTH8'
        title='Data Analist, Dev'
        facebook='https://www.facebook.com/profile.php?id=100039855851785'
        twitter='https://twitter.com/JonnyNgoChay'
        github='https://github.com/huytag'
        linkedin='https://docs.google.com/document/d/1yn_dcVdXzX_2pgCZNZtaB__UYOAgOwCF/edit'
      />
    );
  }

  // authorViet(key) {
  //   return (
  //     <Author
  //       key={key}
  //       isActive={this.state.currentSelectedIndex === key}
  //       img='/image/authors/Author_Viet.jpg'
  //       authorName='Viet Saclo'
  //       Class='08DHTH1'
  //       title='Grab Bike & Dev'
  //       facebook='https://www.facebook.com/vietsaclo'
  //       twitter=''
  //       github='https://github.com/vietsaclo'
  //       linkedin=''
  //     />
  //   );
  // }

  // authorKhiem(key) {
  //   return (
  //     <Author
  //       key={key}
  //       isActive={this.state.currentSelectedIndex === key}
  //       img='/image/authors/Author_Khiem.jpeg'
  //       authorName='Ngô Khiêm'
  //       Class='09DHTH2'
  //       title='Dev web'
  //       facebook='https://www.facebook.com/profile.php?id=100037808731302'
  //       twitter=''
  //       github=''
  //       linkedin=''
  //     />
  //   );
  // }

  // authorLen(key) {
  //   return (
  //     <Author
  //       key={key}
  //       isActive={this.state.currentSelectedIndex === key}
  //       img='/image/authors/Author_Len.jpeg'
  //       authorName='Ho Chi Len'
  //       Class='08DHTH1'
  //       title='Java developer'
  //       facebook='https://www.facebook.com/profile.php?id=100013366865362'
  //       twitter=''
  //       github=''
  //       linkedin=''
  //     />
  //   );
  // }

  // authorNam(key) {
  //   return (
  //     <Author
  //       key={key}
  //       isActive={this.state.currentSelectedIndex === key}
  //       img='/image/authors/Author_Nam.jpeg'
  //       authorName='Thanh Nam'
  //       Class='08DHTH1'
  //       title='Bách khoa cơ khí'
  //       facebook='https://www.facebook.com/nam.hoang.3094'
  //       twitter=''
  //       github=''
  //       linkedin=''
  //     />
  //   );
  // }

  // authorKhanh(key) {
  //   return (
  //     <Author
  //       key={key}
  //       isActive={this.state.currentSelectedIndex === key}
  //       img='/image/authors/Author_Khanh.jpeg'
  //       authorName='Huỳnh Ngọc Khánh'
  //       Class='08DHTH2'
  //       title='Advertiser'
  //       facebook='https://www.facebook.com/HuynhKhanh.99'
  //       twitter=''
  //       github=''
  //       linkedin=''
  //     />
  //   );
  // }

  getAuthors() {
    const result = [];
    result.push(this.authorThang(0));
    result.push(this.authorViet(1));
    result.push(this.authorKhiem(2));
    result.push(this.authorLen(3));
    result.push(this.authorNam(4));
    result.push(this.authorKhanh(5));
    return result;
  }

  onChange(index) {
    this.setState({ currentSelectedIndex: index });
  }

  render() {
    return (
      <div style={{ padding: '0px 20px' }}>
        <SliderComponent
          onChange={(index) => this.onChange(index)}
          datas={this.getAuthors()}
        />
      </div>
    );
  }
}

export default AuthorsComponent;