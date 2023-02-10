import { ActionType } from "../utils/actions-type"

const PostDetailReducerInitialState = {
  data: {},
}
const PostDetailReducer = (state = PostDetailReducerInitialState, action) => {
  switch (action.type) {
    case ActionType.POST_DETAIL_VIEW:
      return Object.assign({}, state, {
        data: {...action.data},
      });
    default:
      return state
  }
}

export default PostDetailReducer;