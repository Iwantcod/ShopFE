// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import { normalizeRole } from '../../lib/normalizeRole';

const initialState = {
  role: null,                  // 'USER' | 'SELLER' | 'ADMIN' | null
  userId: null,                // number | null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** 로그인 이후 헤더 값으로 상태 설정 */
    setRole(state, { payload }) {
      if (payload) {
        state.role = normalizeRole(payload.role);
        state.userId = payload.userId;
      } else {
        // payload 가 없으면 초기화
        Object.assign(state, initialState);
      }
    },

    /** 로그아웃 또는 토큰 만료 시 초기화 */
    resetAuth() {
      // 쿠키도 제거
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      return initialState;
    },
  },
});

export const { setRole, resetAuth } = authSlice.actions;  // named export
export default authSlice.reducer;
