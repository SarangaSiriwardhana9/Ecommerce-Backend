import { http } from '../http';
import { Cart } from '../types';

export const cartApi = {
  get() {
    return http.get<Cart>('/cart');
  },
  addItem(body: { productId: string; variantId: string; quantity: number }) {
    return http.post<Cart>('/cart/items', body);
  },
  updateItem(productId: string, variantId: string, quantity: number) {
    return http.patch<Cart>(`/cart/items/${productId}/${variantId}`, { quantity });
  },
  removeItem(productId: string, variantId: string) {
    return http.delete<Cart>(`/cart/items/${productId}/${variantId}`);
  },
};


