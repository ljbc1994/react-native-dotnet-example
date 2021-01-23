import ApiClient from "./ApiClient";
import config from "../../../config";

const apiClient = new ApiClient({
    baseUrl: config.API_URL,
});

export default apiClient;