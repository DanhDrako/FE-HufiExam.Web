import React, { Component } from 'react';
import ExamTest from '../../components/common/ExamTest';
import SlogantComponent from '../../components/common/SlogantComponent';
import Footer from '../../components/home/footer/FooterComponents';
import Header from '../../components/home/header/HeaderComponent';

class ExamPage extends Component {
  render() {
    return (
      <>
        <Header />
        <SlogantComponent />
        
        <ExamTest />

        <Footer />
      </>
    );
  }
}

export default ExamPage;