import { http } from '../http';
import { setAuthToken } from '../http';
import { User } from '../types';

export interface SignupInput { email: string; password: string; name?: string }
export interface LoginInput { email: string; password: string }
export interface AuthResponse { user: User; accessToken: string }

export const authApi = {
  signup(input: SignupInput) {
    return http.post<AuthResponse>('/auth/signup', input);
  },
  async login(input: LoginInput) {
    const res = await http.post<AuthResponse>('/auth/login', input);
    setAuthToken(res.accessToken);
    return res;
  },
  logout() {
    setAuthToken(null);
    return Promise.resolve();
  },
};


