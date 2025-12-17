import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";


function getToken() {
  return localStorage.getItem("token") || "";
}

const api = axios.create({
  baseURL: API_BASE
});

api.interceptors.request.use((config) => {
  const token = getToken();
  const url = (config.url || "").toString();
  const isLogin = url.includes("/auth/login");
  if (token && !isLogin) {
    if (!config.headers) config.headers = {} as any;
    const h = config.headers as any;
    if (typeof h.set === "function") h.set("Authorization", `Bearer ${token}`);
    else h["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload = error.response?.data;
    const message =
      (typeof payload === "string" && payload) ||
      (Array.isArray(payload?.message) ? payload.message.join(", ") : payload?.message) ||
      payload?.error ||
      error.message;
    return Promise.reject(new Error(message || "Request failed"));
  }
);

export async function login(username: string, password: string): Promise<string> {
  console.log('login', username, password);
  const { data } = await api.post<{ access_token: string }>("/auth/login", { username, password });
  return data.access_token;
}

import type { Product } from "@/types/product";

export type BackendProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  videos?: string[];
  category: string;
  tags?: string[];
  inStock?: boolean;
  colors?: string[];
  sizes?: string[];
  specifications?: Record<string, string>;
  rating?: number;
  reviewCount?: number;
};

export async function getProducts(): Promise<BackendProduct[]> {
  const { data } = await api.get<BackendProduct[]>("/products");
  return data;
}

export async function getProduct(id: string): Promise<BackendProduct> {
  const { data } = await api.get<BackendProduct>(`/products/${id}`);
  return data;
}

export async function createProduct(payload: Partial<Product>) {
  const { data } = await api.post<BackendProduct>("/products", payload);
  return data;
}

export async function updateProduct(id: string, payload: Partial<Product>) {
  const { data } = await api.put<BackendProduct>(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: string) {
  const { data } = await api.delete<{ success: boolean }>(`/products/${id}`);
  return data;
}

export async function uploadMedia(file: File, folder?: string) {
  const form = new FormData();
  form.append("file", file);
  if (folder) form.append("folder", folder);
  const { data } = await api.post<{ public_id: string; resource_type: "image" | "video" }>(`/media/upload`, form);
  return data;
}

export async function getUploadSignature(folder?: string, publicId?: string, type?: "image" | "video") {
  const { data } = await api.post<{ upload_url: string; timestamp: number; signature: string; api_key: string; cloud_name: string; folder?: string; public_id?: string; access_mode: string }>(
    "/media/sign-upload",
    { folder, public_id: publicId, type }
  );
  return data;
}

export async function uploadMediaDirect(file: File, folder?: string): Promise<{ public_id: string; resource_type: "image" | "video" }> {
  const type: "image" | "video" = file.type.startsWith("video") ? "video" : "image";
  const sig = await getUploadSignature(folder, undefined, type);
  const fd = new FormData();
  fd.append("file", file);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("signature", sig.signature);
  fd.append("api_key", sig.api_key);
  if (sig.folder) fd.append("folder", sig.folder);
  fd.append("access_mode", sig.access_mode);
  const { data } = await axios.post(sig.upload_url, fd);
  return { public_id: data.public_id, resource_type: data.resource_type };
}
