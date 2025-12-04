import { ajaxInstance } from "@/lib/ajaxConfig";
import type { Employee } from "@/types/Employee";
import { TableParams } from "@/types/Table";
import { mapTableParamsToApi, toURLSearchParams } from "@/utils/mapParam";

export const employeeService = {
  getEmployee: (params: TableParams<Employee>, keyword: string) => {
    const apiParams = mapTableParamsToApi(params, keyword);
    const query = toURLSearchParams(apiParams);
    return ajaxInstance.get<{
      data: Employee[];
      pagination: { total: number };
    }>(`employees?${query}`);
  },
  getEmployeeById: (id: number) =>
    ajaxInstance.get<Employee>(`employees/${id}`),

  createEmployee: (data: Employee) =>
    ajaxInstance.post<{ data: Employee; message: string }>(`employees`, data),

  updateEmployee: (payload: Employee) =>
    ajaxInstance.put<{ payload: Employee; message: string }>(
      `employees/${payload.id}`,
      payload
    ),

  checkEmployee: ({
    username,
    email,
    id,
  }: {
    username: string;
    email: string;
    id?: number | null;
  }) => {
    const params = new URLSearchParams({ username, email });
    if (id !== null && id !== undefined) params.append("id", id.toString());
    return ajaxInstance.get<{
      emailExists: boolean;
      usernameExists: boolean;
    }>(`employees/check?${params.toString()}`);
  },
};
