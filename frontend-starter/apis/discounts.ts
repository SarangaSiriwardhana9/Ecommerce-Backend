import { http } from '../http';
import { Discount } from '../types';

export const discountsApi = {
  get(code: string) {
    return http.get<Discount>(`/discounts/${encodeURIComponent(code)}`);
  },
  // Admin
  create(body: Partial<Discount>) {
    return http.post<Discount>('/discounts', body);
  },
};


