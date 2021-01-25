import ApiClient from "./ApiClient";
import config from "../../../config";

const apiClient = new ApiClient({
    baseUrl: process.env.API_URL,
});

export default apiClient;