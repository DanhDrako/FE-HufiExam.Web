import './css-system/App.css';
import { BrowserRouter as Router, } from 'react-router-dom';
import React, { Component } from 'react';
import MainRouter from './routes/MainRoutes';
// import moment from 'moment';
// import FACTORY from './common/FACTORY';

class App extends Component {
  componentDidMount() {
    try {
      if (this.refBtnOpen)
        this.refBtnOpen.click();
    } catch { }
  }

  // showEvents() {
  //   const format = 'DD/MM/YYYY HH:mm:ss';
  //   const endDateUTC = '19/09/2021 18:00:00';

  //   const currentDateString = moment.utc(new Date()).format(format);
  //   const endDateString = moment.utc(endDateUTC, format).format(format);

  //   const diff = moment.utc(endDateString, format).diff(moment.utc(currentDateString, format));
  //   FACTORY.GET_PUBLIC_MODULES().then((PublicModules) => {
  //     PublicModules.fun_log({
  //       current: currentDateString,
  //       end: endDateString,
  //       diff: diff,
  //       diffSmood: PublicModules.fun_getTimeRemaining(null, diff),
  //     }, 'App.js', 24);
  //   });

  //   if (diff < 0) return '';

  //   return (
  //     <div>
  //       {/* Button trigger modal */}
  //       <button
  //         ref={(ref) => this.refBtnOpen = ref}
  //         type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#promo-modal-event">
  //         promo events
  //       </button>
  //       {/* Modal */}
  //       <div className="modal fade" id="promo-modal-event" tabIndex={-1} aria-labelledby="promo-modal-eventLabel" aria-hidden="true">
  //         <div className="modal-dialog modal-dialog-centered modal-promo">
  //           <div className="modal-content">
  //             <div className="modal-body modal-body-promo">
  //               <a href="https://www.facebook.com/groups/myhufier.all.in.one/?ref=web_social_plugin" target="blank">
  //                 <img alt='event-15/08' src="/image/images/event-15_08.jpg" className="w-100" />
  //               </a>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  render() {
    return (
      <Router>
        {/* {this.showEvents()} */}
        <MainRouter />
      </Router>
    );
  }
}

export default App;
