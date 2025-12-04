import { Epic, ofType } from "redux-observable";
import {
  switchMap,
  map,
  catchError,
  of,
  concatWith,
  startWith,
  delay,
} from "rxjs";
import { roleService } from "@/services/roleService";
import type { RootState } from "@/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";
import { Role } from "@/types/Role";
import { Action } from "redux";
import { TableParams } from "@/types/Table";

import {
  getAllRole,
  getRole,
  getRoleSuccess,
  getRoleError,
  addRole,
  addRoleSuccess,
  addRoleError,
  updateRole,
  updateRoleSuccess,
  updateRoleError,
  setLoading,
  getRoleById,
  getRoleByIdSuccess,
  getRoleByIdError,
} from "@/redux/slices/roleSlice";

const getRoleEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(getRole.type),
    switchMap(() => {
      const params = state$.value.role.tableParams;
      const keyword = state$.value.role.keyword;
      return roleService.getRole(params, keyword).pipe(
        map((res) => getRoleSuccess(res.response)),
        catchError(() => of(getRoleError("Fail to get role"))),
        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(500)))
      );
    })
  );

const getAllRoleEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(getAllRole.type),
    switchMap(() =>
      roleService.getAllRole().pipe(
        map((res) => getRoleSuccess(res.response)),
        catchError(() => of(getRoleError("Fail to get all roles"))),
        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(500)))
      )
    )
  );

const getRoleByIdEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(getRoleById.type),
    switchMap((payload) => {
      const id = (payload as PayloadAction<number>).payload;
      return roleService.getRoleById(id).pipe(
        map((res) => getRoleByIdSuccess(res.response)),
        catchError(() => of(getRoleByIdError("Fail to get role"))),
        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(500)))
      );
    })
  );

const createRoleEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(addRole.type),
    switchMap((action) => {
      const payload = (action as PayloadAction<Role>).payload;
      return roleService.createRole(payload).pipe(
        map((res) => addRoleSuccess(res.response.message)),
        catchError(() => of(addRoleError("Fail to add role"))),
        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(500)))
      );
    })
  );

const updateRoleEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(updateRole.type),
    switchMap((action) => {
      const { data, id } = (action as PayloadAction<{ data: Role; id: number }>)
        .payload;

      const payload = {
        ...data,
        id: id,
      };
      return roleService.updateRole(payload).pipe(
        map((res) => updateRoleSuccess(res.response.message)),
        catchError(() => of(updateRoleError("Fail to update role"))),
        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(500)))
      );
    })
  );

export const roleEpics = [
  getRoleEpic,
  getAllRoleEpic,
  getRoleByIdEpic,
  createRoleEpic,
  updateRoleEpic,
];
