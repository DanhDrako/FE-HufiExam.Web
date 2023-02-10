import { ActionType } from "../utils/actions-type";
import { Apis } from "../utils/Apis";

const ManagePostReducerInitialState = {
  keyWord: '',
  cate: -1,
  tags: [],
  unCommited: false,
  page: 1,
  limit: Apis.NUM_PER_PAGE,
}
const ManagePostReducer = (state = ManagePostReducerInitialState, action) => {
  switch (action.type) {
    case ActionType.POST_MANAGE_UPDATE:
      return Object.assign({}, state, {
        ...action.value,
      });
    default:
      return state
  }
}

export default ManagePostReducer;