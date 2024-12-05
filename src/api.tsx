import axios from "axios";

const API_URL = "https://fake-api-dfa7.onrender.com/products";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchProducts = () => {
  return api.get("/").then((response) => response.data);
};

export const addProduct = (product: any) => {
  return api.post("/", product).then((response) => response.data);
};

export const deleteProduct = (id: string) => {
  return api.delete(`/${id}`).then((response) => response.data);
};
