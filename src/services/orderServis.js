import api from "./api";

export async function getOrder() {
  const resp = await api.get("/order");
  return resp.data;
}
export async function getOrderById(id) {
  const resp = await api.get(`/order/${id}`);
  return resp.data;
}
export async function createOrder(data) {
  const resp = await api.post("/order", data);
  return resp.data;
}
