import { Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import { combineEpics } from "redux-observable";
import type { RootState } from "@/redux/store";
import { userEpics } from "./userEpic";
import { employeeEpics } from "./employeeEpic";
import { roleEpics } from "./roleEpic";
import { positionEpics } from "./positionEpic";

export const rootEpic: Epic<Action, Action, RootState> = combineEpics(
  ...userEpics,
  ...employeeEpics,
  ...roleEpics,
  ...positionEpics
);
