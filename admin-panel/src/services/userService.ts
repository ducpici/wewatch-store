import { ajaxInstance } from "@/lib/ajaxConfig";
import type { User } from "@/types/User";
import { TableParams } from "@/types/Table";
import { mapTableParamsToApi, toURLSearchParams } from "@/utils/mapParam";

export const userService = {
  getUser: (params: TableParams<User>, keyword: string) => {
    const apiParams = mapTableParamsToApi(params, keyword);
    const query = toURLSearchParams(apiParams);
    return ajaxInstance.get<{
      message: string;
      data: User[];
      pagination: { total: number };
    }>(`users?${query}`);
  },
  getUserById: (id: number) => ajaxInstance.get<User>(`users/${id}`),

  createUser: (data: User) =>
    ajaxInstance.post<{ data: User; message: string }>(`users`, data),

  updateUser: (payload: User) =>
    ajaxInstance.put<{ payload: User; message: string }>(
      `users/${payload.id}`,
      payload
    ),

  checkUser: ({
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
    }>(`users/check?${params.toString()}`);
  },
};
