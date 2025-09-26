import { http } from '../http';
import { Review } from '../types';

export const reviewsApi = {
  create(body: { productId: string; rating: number; title?: string; body: string; authorName?: string; authorEmail?: string }) {
    return http.post<Review>('/reviews', body);
  },
  listForProduct(productId: string) {
    return http.get<Review[]>(`/reviews/product/${productId}`);
  },
  aggregate(productId: string) {
    return http.get<{ average: number; count: number }>(`/reviews/product/${productId}/aggregate`);
  },
  // Admin moderation
  moderate(id: string, status: 'pending' | 'approved' | 'rejected') {
    return http.patch<Review>(`/reviews/${id}/moderate`, { status });
  },
};


