import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_MOCKAPI_URL;

export const mockApiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
