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
import { userService } from "@/services/userService";
import type { RootState } from "@/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/User";
import { Action } from "redux";

import {
  getUser,
  getUserSuccess,
  getUserError,
  addUser,
  addUserSuccess,
  addUserError,
  updateUser,
  updateUserSuccess,
  updateUserError,
  setLoading,
  getUserById,
  getUserByIdSuccess,
  getUserByIdError,
} from "@/redux/slices/userSlice";

const getUserEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(getUser.type),
    switchMap(() => {
      const params = state$.value.user.tableParams;
      const keyword = state$.value.user.keyword;
      return userService.getUser(params, keyword).pipe(
        map((res) => getUserSuccess(res.response)),
        catchError(() => of(getUserError("Fail to get users"))),
        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(500)))
      );
    })
  );

const getUserByIdEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(getUserById.type),
    switchMap((payload) => {
      const id = (payload as PayloadAction<number>).payload;
      return userService.getUserById(id).pipe(
        map((res) => getUserByIdSuccess(res.response)),
        catchError((error) => {
          const message = error?.response?.message || "Fail to get user";
          return of(getUserByIdError(message));
        }),
        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(500)))
      );
    })
  );

const createUserEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(addUser.type),
    switchMap((action) => {
      const payload = (action as PayloadAction<User>).payload;
      return userService
        .checkUser({
          username: payload.username,
          email: payload.email,
          id: null,
        })
        .pipe(
          switchMap((checkRes) => {
            // Nếu check không hợp lệ, throw lỗi
            if (checkRes.response.emailExists) {
              return of(addUserError("Email đã tồn tại"));
            }
            if (checkRes.response.usernameExists) {
              return of(addUserError("Username đã tồn tại"));
            }

            // Nếu check OK, gọi createUser
            return userService.createUser(payload).pipe(
              map((res) => addUserSuccess(res.response.message)),
              catchError((err) => {
                const message = err?.response?.message || "Lỗi khi tạo user";
                return of(addUserError(message));
              })
            );
          }),
          startWith(setLoading(true)),
          concatWith(of(setLoading(false)))
        );
    })
  );

const updateUserEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(updateUser.type),
    switchMap((action) => {
      console.log(action);
      const payload = (action as PayloadAction<User>).payload;
      console.log(payload);
      return userService
        .checkUser({
          username: payload.username,
          email: payload.email,
          id: payload.id,
        })
        .pipe(
          switchMap((checkRes) => {
            // Nếu check không hợp lệ, throw lỗi
            if (checkRes.response.emailExists) {
              return of(updateUserError("Email đã tồn tại"));
            }
            if (checkRes.response.usernameExists) {
              return of(updateUserError("Username đã tồn tại"));
            }

            // Nếu check OK, gọi createUser
            return userService.updateUser(payload).pipe(
              map((res) => updateUserSuccess(res.response.message)),
              catchError((err) => {
                const message = err?.response?.message || "Lỗi khi tạo user";
                return of(updateUserError(message));
              })
            );
          }),
          startWith(setLoading(true)),
          concatWith(of(setLoading(false)))
        );
    })
  );

export const userEpics = [
  getUserEpic,
  getUserByIdEpic,
  createUserEpic,
  updateUserEpic,
];
