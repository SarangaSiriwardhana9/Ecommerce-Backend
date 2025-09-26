import { http } from '../http';
import { Category } from '../types';

export const categoriesApi = {
  list() {
    return http.get<Category[]>('/categories');
  },
  tree() {
    return http.get<Category[]>('/categories/tree');
  },
  get(id: string) {
    return http.get<Category>(`/categories/${id}`);
  },
  // Admin
  create(body: Partial<Category>) {
    return http.post<Category>('/categories', body);
  },
  update(id: string, body: Partial<Category>) {
    return http.patch<Category>(`/categories/${id}`, body);
  },
  remove(id: string) {
    return http.delete<void>(`/categories/${id}`);
  },
};


