import { ActionType } from "../utils/actions-type"

const SearchPostNumInitialState = {
  isLoading: false,
  number: 0,
}

const SearchPostNum = (state = SearchPostNumInitialState, action) => {
  switch (action.type) {
    case ActionType.SEARCH_POST_NUM_UPDATE:
      return Object.assign({}, state, {
        ...action.value,
      });
    default:
      return state
  }
}

export default SearchPostNum;