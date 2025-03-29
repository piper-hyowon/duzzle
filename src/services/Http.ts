import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";

const RequestUrl = import.meta.env.VITE_REQUEST_URL;

const instance = axios.create({
  baseURL: RequestUrl,
});

type HTTPRequestConfig = AxiosRequestConfig;

const api = (axios: AxiosInstance) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return {
    async get<T>(uri: string, params: object = {}): Promise<T> {
      const url: string = `${uri}?${Object.entries(params)
        .filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
        .map(([key, value]) => `${key}=${value}`)
        .join("&")}`;

      return <T>(await axios.get(url)).data.data;
    },
    delete: <T>(url: string, config: HTTPRequestConfig = {}) => {
      return axios.delete<T>(url, config);
    },
    put: <T>(url: string, body: unknown, config: HTTPRequestConfig = {}) => {
      return axios.put<T>(url, body, config);
    },
    patch: <T>(url: string, body: unknown, config: HTTPRequestConfig = {}) => {
      return axios.patch<T>(url, body, config);
    },

    async post<T>(
      url: string,
      body: object = {},
      headers?: RawAxiosRequestHeaders
    ): Promise<T> {
      const data = (await axios.post(url, body, { headers })).data;

      return data;
    },
  };
};

export const Http = api(instance);
