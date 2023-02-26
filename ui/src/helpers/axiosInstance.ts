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
    baseURL: "http://192.168.0.102:3000/",
  });
}

export const axiosInstance = instance;
