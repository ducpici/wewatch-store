import { ajaxInstance } from "@/lib/ajaxConfig";
import type { Role } from "@/types/Role";
import { TableParams } from "@/types/Table";
import { mapTableParamsToApi, toURLSearchParams } from "@/utils/mapParam";

export const roleService = {
  getAllRole: () => {
    return ajaxInstance.get<{ data: Role[]; pagination: { total: number } }>(
      "roles"
    );
  },
  getRole: (params: TableParams<Role>, keyword: string) => {
    const apiParams = mapTableParamsToApi(params, keyword);
    const query = toURLSearchParams(apiParams);
    return ajaxInstance.get<{ data: Role[]; pagination: { total: number } }>(
      `roles?${query}`
    );
  },

  createRole: (payload: Role) =>
    ajaxInstance.post<{ message: string }>(`roles`, payload),
  updateRole: (payload: Role) =>
    ajaxInstance.put<{ message: string }>(`roles/${payload.id}`, payload),
  getRoleById: (id: number) =>
    ajaxInstance.get<{ message: string; data: Role }>(`roles/${id}`),
};
