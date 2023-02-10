import { ActionType } from "../utils/actions-type";

const RealExamInitialState = {
  data: {},
};

const RealExamReducer = (state = RealExamInitialState, action) => {
  switch (action.type) {
    case ActionType.SET_REAL_EXAM:
      return Object.assign(
        {},
        {
          data: { ...action.value },
        }
      );
    case ActionType.RESET_REAL_EXAM:
      return Object.assign(
        {},
        {
          data: {},
        }
      );
    default:
      return state;
  }
};

export default RealExamReducer;
