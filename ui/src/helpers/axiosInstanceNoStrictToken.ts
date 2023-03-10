import { HOST } from "../devConst";
import axios, { AxiosInstance } from "axios";
import { ICheckAuthData } from "../store/reducers/auth/authTypes";

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
  await refreshToken();
  let accessToken: string = "";
  if (localStorage.getItem("token"))
    accessToken = localStorage.getItem("token") as string;
  if (accessToken && accessToken.length > 0) {
    request.headers[HEADER] = `Bearer ${accessToken}`;
    return request;
  }
  return request;
});

export const axiosInstanceNoStrictToken = instanceToken;

let tokenUrl: string;
if (PRODUCTION) {
  tokenUrl = "/api/auth/token";
} else {
  tokenUrl = `${HOST}api/auth/token`;
}

function refreshToken() {
  return new Promise((resolve, reject) => {
    axios
      .post<ICheckAuthData>(tokenUrl)
      .then((res) => {
        const accessToken = res.data.token;
        localStorage.setItem("token", accessToken);
        resolve(true);
      })
      .catch((err) => {
        resolve(false);
      });
  });
}
