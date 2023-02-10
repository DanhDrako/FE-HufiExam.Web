import { ActionType, AdminRouterType } from "../utils/actions-type"

const nameInitialState = {
  router: AdminRouterType.DASHBOARD,
}

const reducer = (state = nameInitialState, action) => {
  switch (action.type) {
    case ActionType.ADMIN_ROUTER_UPDATE:
      return Object.assign({}, state, {
        router: action.router || state.router,
        data: null,
      });
    case ActionType.ADMIN_ROUTER_UPDATE_UPDATE_POST:
      return Object.assign({}, state, {
        router: action.router || state.router,
        data: action.data,
      });
      
    default:
      return state
  }
}

export default reducer;