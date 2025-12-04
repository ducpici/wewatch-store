import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import employeeSlice from "./slices/employeeSlice";
import roleSlice from "./slices/roleSlice";
import positionSlice from "./slices/positionSlice";
import { rootEpic } from "./epics/rootEpic";

const rootReducer = combineReducers({
  user: userSlice,
  employee: employeeSlice,
  role: roleSlice,
  position: positionSlice,
});

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
