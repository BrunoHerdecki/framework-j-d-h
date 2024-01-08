import axios, { AxiosInstance } from "axios";

class HttpService {
  private readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  get(endpoint: string, params?: object) {
    return this.axiosInstance.get(endpoint, { params });
  }

  post(endpoint: string, data: object) {
    return this.axiosInstance.post(endpoint, data);
  }

  put(endpoint: string, data: object) {
    return this.axiosInstance.put(endpoint, data);
  }

  patch(endpoint: string, data: object) {
    return this.axiosInstance.patch(endpoint, data);
  }

  delete(endpoint: string) {
    return this.axiosInstance.delete(endpoint);
  }
}

const httpService = new HttpService("https://jsonplaceholder.typicode.com/");

export default httpService;
