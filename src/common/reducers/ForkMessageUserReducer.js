import { ActionType } from "../utils/actions-type";

const ForkMessageUserInitialState = {
  user: {

  }
}

const ForkMessageUser = (state = ForkMessageUserInitialState, action) => {
  switch (action.type) {
    case ActionType.FORK_MESSAGE_USER:
      return Object.assign({}, {
        user: { ...action.user },
      });
    case ActionType.RESET_FORK_MESSAGE_USER:
      return Object.assign({}, { user: {} });
    default:
      return state
  }
}

export default ForkMessageUser;