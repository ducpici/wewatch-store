import { ajax } from "rxjs/ajax";
const API_URL = import.meta.env.VITE_API_BASE_URL;

type AjaxHeaders = Record<string, string>;
type AjaxBody = Record<string, unknown> | string | null | undefined;

const getAuthHeaders = (): AjaxHeaders => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const ajaxInstance = {
  get: <T>(
    url: string,
    headers: AjaxHeaders = {}
  ): ReturnType<typeof ajax<T>> =>
    ajax<T>({
      url: `${API_URL}${url}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...headers,
      },
    }),

  post: <T>(
    url: string,
    body?: AjaxBody,
    headers: AjaxHeaders = {}
  ): ReturnType<typeof ajax<T>> =>
    ajax<T>({
      url: `${API_URL}${url}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...headers,
      },
      body,
    }),

  put: <T>(
    url: string,
    body?: AjaxBody,
    headers: AjaxHeaders = {}
  ): ReturnType<typeof ajax<T>> =>
    ajax<T>({
      url: `${API_URL}${url}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...headers,
      },
      body,
    }),

  patch: <T>(
    url: string,
    body?: AjaxBody,
    headers: AjaxHeaders = {}
  ): ReturnType<typeof ajax<T>> =>
    ajax<T>({
      url: `${API_URL}${url}`,
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
      ...getAuthHeaders(),
      body,
    }),

  del: <T>(
    url: string,
    headers: AjaxHeaders = {}
  ): ReturnType<typeof ajax<T>> =>
    ajax<T>({
      url: `${API_URL}${url}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...headers,
      },
    }),
};
