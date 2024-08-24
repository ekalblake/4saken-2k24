import axios, { AxiosInstance } from "axios";
import { API_URL, CLIENT_URL } from "../constants/constants";

const axiosInstance: AxiosInstance = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": CLIENT_URL,
		"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
	},
});

export default axiosInstance;
