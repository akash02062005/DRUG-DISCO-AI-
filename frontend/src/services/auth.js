import { api } from './api';

const KEY = 'dd_token';
const USER_KEY = 'dd_user';

export const auth = {
  isAuthenticated() { return !!localStorage.getItem(KEY); },
  user() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
    catch { return null; }
  },
  async login(email, password) {
    const res = await api.login(email, password);
    localStorage.setItem(KEY, res.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    return res.user;
  },
  async register(email, password, name) {
    const res = await api.register(email, password, name);
    localStorage.setItem(KEY, res.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    return res.user;
  },
  logout() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(USER_KEY);
  },
};
