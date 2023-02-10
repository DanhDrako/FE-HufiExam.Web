import { ActionType } from '../utils/actions-type';
import { LocalStorageKeys } from '../utils/keys';

const initialState = {
  user: {
    userId: null,
    userName: null,
    role: null,
  },
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionType.USER_LOGIN:
      return Object.assign({}, state, {
        user: { ...action.user },
      });

    case ActionType.USER_LOGOUT:
      // fun_removeUserLoginLocalStorage();
      localStorage.removeItem(LocalStorageKeys.USERID);
      localStorage.removeItem(LocalStorageKeys.USERNAME);
      localStorage.removeItem(LocalStorageKeys.ROLE);
      // fun_removeTokenAndRefreshTokenLocalStorage();
      localStorage.removeItem(LocalStorageKeys.TOKEN);
      localStorage.removeItem(LocalStorageKeys.TOKEN_REFRESH);
      return Object.assign({}, state, {
        user: { ...initialState },
      });

    default:
      return state;
  }
}

export default reducer;