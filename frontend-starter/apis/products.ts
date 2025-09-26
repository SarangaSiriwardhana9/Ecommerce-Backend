import { http } from '../http';
import { Paginated, Product } from '../types';

export interface ProductSearchParams {
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  rating?: number;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest';
}

export const productsApi = {
  search(params: ProductSearchParams) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) query.set(k, String(v));
    });
    return http.get<Paginated<Product>>(`/products?${query.toString()}`);
  },
  get(id: string) {
    return http.get<Product>(`/products/${id}`);
  },
  // Admin-only helpers (use only when authenticated as admin)
  create(body: Partial<Product>) {
    return http.post<Product>('/products', body);
  },
  update(id: string, body: Partial<Product>) {
    return http.patch<Product>(`/products/${id}`, body);
  },
  remove(id: string) {
    return http.delete<void>(`/products/${id}`);
  },
  archive(id: string) {
    return http.patch<Product>(`/products/${id}/archive`, {});
  },
};


