import { http } from '../http';
import { User } from '../types';

export const usersApi = {
  me() {
    return http.get<User | null>('/users/me');
  },
};


