import { HOST } from "../devConst";
import axios, { AxiosInstance } from "axios";
import { checkAuthData } from "../store/reducers/auth/authTypes";

const PRODUCTION: boolean =
  process.env.NODE_ENV === "production" ? true : false;
const HEADER: string = "Authorization";

let instanceToken: AxiosInstance;
if (PRODUCTION) {
  instanceToken = axios.create({
    timeout: 5000,
  });
} else {
  axios.defaults.withCredentials = true; // Разрешение на куки
  instanceToken = axios.create({
    baseURL: HOST,
    timeout: 5000,
  });
}

instanceToken.interceptors.request.use(async (request) => {
  let accessToken: string = "";
  if (localStorage.getItem("token"))
    accessToken = localStorage.getItem("token") as string;
  if (accessToken && accessToken.length > 0) {
    request.headers[HEADER] = `Bearer ${accessToken}`;
    return request;
  }
  return request;
});

instanceToken.interceptors.response.use(
  (response) => response,
  async (err) => {
    try {
      if (err.response?.status != 401) return Promise.reject(err);
      await refreshToken();
      const originalRequestConfig = err.config;
      delete originalRequestConfig.headers[HEADER];
      return instanceToken.request(originalRequestConfig);
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const axiosInstanceToken = instanceToken;

let tokenUrl: string;
if (PRODUCTION) {
  tokenUrl = "/api/auth/token";
} else {
  tokenUrl = `${HOST}api/auth/token`;
}

function refreshToken() {
  return new Promise((resolve, reject) => {
    axios
      .post<checkAuthData>(tokenUrl)
      .then((res) => {
        const accessToken = res.data.token;
        localStorage.setItem("token", accessToken);
        resolve(accessToken);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
