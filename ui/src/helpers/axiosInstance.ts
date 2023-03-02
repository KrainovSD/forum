import { HOST } from "../devConst";
import axios, { AxiosInstance } from "axios";

const PRODUCTION = process.env.NODE_ENV === "production" ? true : false;
let instance: AxiosInstance;
if (PRODUCTION) {
  instance = axios.create({
    timeout: 5000,
  });
} else {
  instance = axios.create({
    timeout: 5000,
    baseURL: HOST,
  });
}

export const axiosInstance = instance;
