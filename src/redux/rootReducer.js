import {all} from "redux-saga/effects";
import {combineReducers} from "redux";

import * as auth from "./authRedux";
import * as user from "./userRedux";
import * as common from "./commonRedux";


export const rootReducer = combineReducers({
  auth: auth.reducer,
  user: user.reducer,
  common: common.reducer,
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
