import { ajaxInstance } from "@/lib/ajaxConfig";
import type { Position } from "@/types/Position";
import { TableParams } from "@/types/Table";
import { mapTableParamsToApi, toURLSearchParams } from "@/utils/mapParam";

export const positionService = {
  getPosition: (params: TableParams<Position>, keyword: string) => {
    const apiParams = mapTableParamsToApi(params, keyword);
    const query = toURLSearchParams(apiParams);
    return ajaxInstance.get<{
      data: Position[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`positions?${query}`);
  },
  getPositionById: (id: number) =>
    ajaxInstance.get<{ data: Position; message: string }>(`positions/${id}`),
  createPosition: (payload: Position) =>
    ajaxInstance.post<{ message: string }>(`positions`, payload),
  updatePosition: (payload: Position) =>
    ajaxInstance.put<{ message: string }>(`positions/${payload.id}`, payload),
  deletePositionById: (id: number) =>
    ajaxInstance.del<{ message: string }>(`positions/${id}`),
};
