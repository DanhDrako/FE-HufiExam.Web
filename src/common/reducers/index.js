import { combineReducers } from "redux";
import userReducer from './UserReducer';
import AdminRouterReducer from './AdminRouterReducer';
import PostDetailReducer from './PostDetailReducer';
import FilterPostReducer from './FilterPostReducer';
import ManagePostReducer from './ManagePostReducer';
import BlackMarketReducer from './BlackMarketReducer';
import SearchPostNum from "./SearchPostNumReducer";
import UserChatWithReducer from './UserChatWithReducer';
import MessageNotification from './MessageNotificationReducer';
import ForkMessageUser from './ForkMessageUserReducer';
import RealExamReducer from "./RealExamrankReducer";

export default combineReducers({
  user: userReducer,
  adminRouter: AdminRouterReducer,
  postDetail: PostDetailReducer,
  filterPost: FilterPostReducer,
  managePost: ManagePostReducer,
  blackMarket: BlackMarketReducer,
  searchPostNum: SearchPostNum,
  UserChatWith: UserChatWithReducer,
  messNof: MessageNotification,
  forkMess: ForkMessageUser,
  realExam: RealExamReducer,
});