import { ActionType } from "../utils/actions-type";

const UserChatWithReducerInitialState = {

}

const UserChatWithReducer = (state = UserChatWithReducerInitialState, action) => {
  switch (action.type) {
    case ActionType.OPEN_MESSAGE_BOX:
      return Object.assign({}, {
        ...state, ...action.value,
      });
    case ActionType.CLOSE_MESSAGE_BOX:
      return Object.assign({}, {
        ...UserChatWithReducerInitialState,
      });
    default:
      return Object.assign({}, { ...UserChatWithReducerInitialState })
  }
}

export default UserChatWithReducer;