import { ActionType } from "../utils/actions-type";

const BlackMarketInitialState = {
  isBlackMarket: false,
}
const BlackMarket = (state = BlackMarketInitialState, action) => {
  switch (action.type) {
    case ActionType.POST_FILTER_UPDATE_BLACK_MARKET:
      return {
        isBlackMarket: action.value,
      }
    default:
      return state
  }
}

export default BlackMarket;