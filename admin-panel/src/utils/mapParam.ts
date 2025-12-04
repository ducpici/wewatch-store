import { TableParams } from "@/types/Table";

export const toURLSearchParams = <T extends Record<string, unknown>>(
  record: T
) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  }
  return params;
};

// map tableParams -> query API
export const mapTableParamsToApi = <T>(
  params: TableParams<T>,
  keyword?: string
) => {
  const { pagination, filters, sortField, sortOrder, ...restParams } = params;
  const result: Record<string, unknown> = {};
  result.limit = pagination?.pageSize;
  result.page = pagination?.current;

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        result[key] = Array.isArray(value) ? value[0] : value;
      }
    });
  }

  if (sortField) {
    result.orderby = sortField;
    result.order = sortOrder === "ascend" ? "asc" : "desc";
  }

  if (keyword) {
    result.keyword = keyword;
  }

  Object.entries(restParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  });

  return result;
};
