import { http } from '../http';
import { Order } from '../types';

export const ordersApi = {
  checkout(body: {
    shippingName: string;
    phone: string;
    shippingAddress: {
      line1: string; line2?: string; city: string; state: string; postalCode: string; country: string;
    };
    notes?: string;
    email?: string;
  }) {
    return http.post<Order>('/orders', body);
  },
  list() {
    return http.get<Order[]>('/orders');
  },
  // Admin
  updateStatus(id: string, status: string, trackingNumber?: string, internalNotes?: string) {
    return http.patch<Order>(`/orders/${id}/status/${status}`, { trackingNumber, internalNotes });
  },
};


