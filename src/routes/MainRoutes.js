import React, { Component } from 'react';
import { Route } from "react-router-dom";
import loadable from '@loadable/component';
import LoadingV2Component from '../components/common/LoadingV2Component';

const HomePage = loadable(() => import('../pages/home/Home'), {
  fallback: <LoadingV2Component />
});
const BlackMarketPage = loadable(() => import('../pages/black-market/BlackMarketPage'), {
  fallback: <LoadingV2Component />
});
const GuidePage = loadable(() => import('../pages/others/GuidePage'), {
  fallback: <LoadingV2Component />
});
const PostDetailPage = loadable(() => import('../pages/post-detail/PostDetail'), {
  fallback: <LoadingV2Component />
});
const ProfilePage = loadable(() => import('../pages/others/ProfilePage'), {
  fallback: <LoadingV2Component />
});
const RulePage = loadable(() => import('../pages/others/RulePage'), {
  fallback: <LoadingV2Component />
});
const Examquiz = loadable(() => import('../pages/others/Examquiz'), {
  fallback: <LoadingV2Component />
});
const Infoexam = loadable(() => import('../pages/others/Infoexam'), {
  fallback: <LoadingV2Component />
});
const UserActivePage = loadable(() => import('../pages/results/UserActivePage'), {
  fallback: <LoadingV2Component />
});
const UserPostPage = loadable(() => import('../pages/user-post/UserPostPage'), {
  fallback: <LoadingV2Component />
});
const UserResetPasswordPage = loadable(() => import('../pages/results/UserResetPasswordPage'), {
  fallback: <LoadingV2Component />
});
const Suggesstion = loadable(() => import('../pages/suggestion/Suggestion'), {
  fallback: <LoadingV2Component />
});
const AfterExam = loadable(() => import('../pages/others/AfterExam'), {
  fallback: <LoadingV2Component />
});
const FacebookLogedPage = loadable(() => import('../pages/results/FacebookLogedPage'), {
  fallback: <LoadingV2Component />
});
const GoogleLogedPage = loadable(() => import('../pages/results/GoogleLogedPage'), {
  fallback: <LoadingV2Component />
});
const AdminV2Page = loadable(() => import('../pages/admin-v2/AdminV2Page'), {
  fallback: <LoadingV2Component />
});
const RankExamPage = loadable(() => import('../pages/rank/RankPage'), {
  fallback: <LoadingV2Component />
});
const DonatePage = loadable(() => import('../pages/donate/DonatePage'), {
  fallback: <LoadingV2Component />
});
const ExamPage = loadable(() => import('../pages/exam/ExamPage'), {
  fallback: <LoadingV2Component />
});
const RealExamquiz = loadable(() => import('../pages/others/RealExamquiz'), {
  fallback: <LoadingV2Component />
});
const PriceGold = loadable(() => import('../pages/price-gold/PriceGold'), {
  fallback: <LoadingV2Component />
});
class MainRoutes extends Component {
  render() {
    return (
      <>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/post/:slug.:id' component={PostDetailPage} />
        <Route exact path='/user-post' component={UserPostPage} />
        <Route exact path='/black-market' component={BlackMarketPage} />
        <Route exact path='/user/active/:token' component={UserActivePage} />
        <Route exact path='/user/reset-password/:token' component={UserResetPasswordPage} />
        <Route exact path='/rule' component={RulePage} />
        <Route exact path='/guide' component={GuidePage} />
        <Route exact path='/examquiz/:postId/:numberQa/:numberTime/:numberSkip/:isRandom/:title' component={Examquiz} />
        <Route exact path='/realexamquiz' component={RealExamquiz} />
        <Route exact path='/afterexam' component={AfterExam} />
        <Route exact path='/infoexam' component={Infoexam} />
        <Route exact path='/profile' component={ProfilePage} />
        <Route exact path='/suggestion' component={Suggesstion} />
        <Route path='/auth/facebook' component={FacebookLogedPage} />
        <Route path='/auth/google' component={GoogleLogedPage} />
        <Route exact path='/admin-v2' component={AdminV2Page} />
        <Route exact path='/rank' component={RankExamPage} />
        <Route exact path='/donate' component={DonatePage} />
        <Route exact path='/exam' component={ExamPage} />
        <Route exact path='/price-gold' component={PriceGold} />
      </>
    );
  }
}

export default MainRoutes;