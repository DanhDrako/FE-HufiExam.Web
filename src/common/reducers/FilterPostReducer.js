import { ActionType } from "../utils/actions-type";
import { Apis } from "../utils/Apis";

const FilterPostReducerInitialState = {
  keyWord: '',
  cate: 0,
  tags: [],
  sort: 0,
  start: false,
  heart: false,
  page: 1,
  limit: Apis.NUM_PER_PAGE,
}
const FilterPostReducer = (state = FilterPostReducerInitialState, action) => {
  switch (action.type) {
    case ActionType.POST_FILTER_UPDATE:
      return Object.assign({}, state, {
        ...action.value,
      });
    case ActionType.POST_FILTER_RESET:
      return Object.assign({}, {...FilterPostReducerInitialState});
    default:
      return state
  }
}

export default FilterPostReducer;