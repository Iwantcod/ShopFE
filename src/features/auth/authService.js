import api from '../../lib/api';
import { store } from '../../app/store';

import { resetAuth } from './authSlice';

export async function logout() {
  try {
    await api.post('/api/auth/logout');   // 서버가 쿠키 만료(Expires=0)
  } finally {
    store.dispatch(resetAuth());
    window.location.href = '/auth/login'; // 항상 로그인 페이지로 이동
  }
}
