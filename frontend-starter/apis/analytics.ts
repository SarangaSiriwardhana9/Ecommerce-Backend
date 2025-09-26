import { http } from '../http';

type EventType = 'product_view' | 'add_to_cart' | 'checkout_start' | 'order_complete';

export const analyticsApi = {
  record(type: EventType, payload: Record<string, any> = {}) {
    return http.post('/analytics/event', { type, payload });
  },
};


