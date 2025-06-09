import axios from 'axios';

import { logout } from '../features/auth/authService'; // 호출만 사용
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,          // 쿠키 자동 전송
});

/* --- 401 처리용 리프레시 뮤텍스 --- */
let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status !== 401) throw err;

    /* ① 리프레시 시도 (중복 방지) */
    if (!refreshPromise) refreshPromise = tryRefresh();
    const refreshOk = await refreshPromise;
    refreshPromise = null;

    if (!refreshOk) {
      await logout();            // refresh 404 등 실패 → 로그아웃 처리
      throw err;
    }

    /* ② 원 요청 재시도 */
    try {
      return await api(err.config);
    } catch (retryErr) {
      if (retryErr.response?.status === 401) {
        await logout();          // 재시도도 401 → 로그아웃
      }
      throw retryErr;
    }
  },
);

/* 리프레시 함수: 성공 true, 404 실패 false */
async function tryRefresh() {
  try {
    await axios.get('/api/auth/refresh', { withCredentials: true });
    return true;                 // 쿠키 재발급 성공
  } catch (e) {
    if (e.response?.status === 404) return false;
    throw e;                     // 네트워크 오류 등은 상위에서 처리
  }
}

export default api;
