import api from "./api";

export async function Login(data) {
  const resp = await api.post("/api/auth", data);
  return resp.data;
}
// export async function LoginAdmin(data) {
//   const resp = await api.post("/admin/login", data);
//   return resp.data;
// }

export async function getMe() {
  const resp = await api.get("/auth/me");
  return resp.data;
}

export async function Register(data) {
  const resp = await api.post("/auth.register", data);
  return resp.data;
}
