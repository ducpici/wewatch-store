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
import { employeeService } from "@/services/employeeService";
import type { RootState } from "@/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";
import { Employee } from "@/types/Employee";
import { Action } from "redux";

import {
  getEmployee,
  getEmployeeSuccess,
  getEmployeeError,
  addEmployee,
  addEmployeeSuccess,
  addEmployeeError,
  updateEmployee,
  updateEmployeeSuccess,
  updateEmployeeError,
  setLoading,
  getEmployeeById,
  getEmployeeByIdSuccess,
} from "@/redux/slices/employeeSlice";

const getEmployeeEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(getEmployee.type),
    switchMap(() => {
      const params = state$.value.user.tableParams;
      const keyword = state$.value.user.keyword;
      return employeeService.getEmployee(params, keyword).pipe(
        map((res) => getEmployeeSuccess(res.response)),
        catchError(() => of(getEmployeeError("Fail to get profile"))),
        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(500)))
      );
    })
  );

const getEmployeeByIdEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(getEmployeeById.type),
    switchMap((payload) => {
      const id = (payload as PayloadAction<number>).payload;
      return employeeService.getEmployeeById(id).pipe(
        map((res) => getEmployeeByIdSuccess(res.response)),
        catchError(() => of(getEmployeeError("Fail to get profile"))),
        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(500)))
      );
    })
  );

const createEmployeeEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(addEmployee.type),
    switchMap((action) => {
      const payload = (action as PayloadAction<Employee>).payload;
      return employeeService
        .checkEmployee({
          username: payload.username,
          email: payload.email,
          id: null,
        })
        .pipe(
          switchMap((checkRes) => {
            // Nếu check không hợp lệ, throw lỗi
            if (checkRes.response.emailExists) {
              return of(addEmployeeError("Email đã tồn tại"));
            }
            if (checkRes.response.usernameExists) {
              return of(addEmployeeError("Employeename đã tồn tại"));
            }

            // Nếu check OK, gọi createEmployee
            return employeeService.createEmployee(payload).pipe(
              map((res) => addEmployeeSuccess(res.response.message)),
              catchError((err) => {
                const message = err?.response?.message || "Lỗi khi tạo user";
                return of(addEmployeeError(message));
              })
            );
          }),
          startWith(setLoading(true)),
          concatWith(of(setLoading(false)))
        );
    })
  );

const updateEmployeeEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(updateEmployee.type),
    switchMap((action) => {
      console.log(action);
      const payload = (action as PayloadAction<Employee>).payload;
      console.log(payload);
      return employeeService
        .checkEmployee({
          username: payload.username,
          email: payload.email,
          id: payload.id,
        })
        .pipe(
          switchMap((checkRes) => {
            // Nếu check không hợp lệ, throw lỗi
            if (checkRes.response.emailExists) {
              return of(updateEmployeeError("Email đã tồn tại"));
            }
            if (checkRes.response.usernameExists) {
              return of(updateEmployeeError("Employeename đã tồn tại"));
            }

            // Nếu check OK, gọi createEmployee
            return employeeService.updateEmployee(payload).pipe(
              map((res) => updateEmployeeSuccess(res.response.message)),
              catchError((err) => {
                const message = err?.response?.message || "Lỗi khi tạo user";
                return of(updateEmployeeError(message));
              })
            );
          }),
          startWith(setLoading(true)),
          concatWith(of(setLoading(false)))
        );
    })
  );

export const employeeEpics = [
  getEmployeeEpic,
  getEmployeeByIdEpic,
  createEmployeeEpic,
  updateEmployeeEpic,
];
