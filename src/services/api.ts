import axios from "axios";

const api = axios.create({
  baseURL: "https://sua-api-externa.com/api", // substitua pela URL real
  timeout: 10000,
});

export default api;
