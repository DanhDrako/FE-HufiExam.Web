import { ActionType } from "../utils/actions-type"

const MessageNotificationInitialState = {
  totalCountUnRead: 0,
  listUsers: [],
}

const MessageNotification = (state = MessageNotificationInitialState, action) => {
  switch (action.type) {
    case ActionType.RECIVE_MESSAGE: {
      // caculate unRead.
      const from = action.value.user.username;
      const userNameChatWith = action.value.userNameChatWith;
      if (from === userNameChatWith) return state;
      const findUser = state.listUsers.find((v) => v.user.username === from);
      if (findUser) {
        findUser.user.countUnRead += 1;
      } else {
        const newObj = { ...action.value };
        newObj.user['countUnRead'] = 1;
        state.listUsers.unshift(newObj);
      }
      state.totalCountUnRead += 1;
      return Object.assign({}, state, {
        ...state,
      });
    }

    case ActionType.RELOAD_USERS_CHAT_HISTORIES: {
      return Object.assign({}, state, {
        totalCountUnRead: action.totalCountUnRead,
        listUsers: action.listUsers,
      });
    }

    case ActionType.MAKE_READ_MESSAGE: {
      // upload reduce countRead message;
      const from = action.value.from;
      const findUser = state.listUsers.find((v) => v.user.username === from);
      let countUnRead = 0;
      if (findUser) {
        countUnRead = findUser.user.countUnRead;
        findUser.user.countUnRead = 0;
      }
      state.totalCountUnRead -= countUnRead;
      return Object.assign({}, state, {
        ...state,
      });
    }
    default:
      return state
  }
}

export default MessageNotification;