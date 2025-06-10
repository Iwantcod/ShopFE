// lib/baseQuery.js
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import { resetAuth } from '../features/auth/authSlice';
import { API_URL } from '../config';


const rawBase = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',     // ★ 쿠키 동봉
});

// lib/baseQuery.js (보완 버전)
export const baseQueryWithReauth = async (args, api, extra) => {
  const url =
    typeof args === 'string'
      ? args
      : typeof args === 'object' && args.url
      ? args.url
      : '';

  let res = await rawBase(args, api, extra);

  if (res.error?.status === 401 && !url.startsWith('/api/auth')) {
    if (Cookies.get('refresh_token')) {
      const refresh = await rawBase('/api/auth/refresh', api, extra);
      if (refresh.data) res = await rawBase(args, api, extra);
    }
    if (res.error?.status === 401) {
      await rawBase(
        { url: '/api/auth/logout', method: 'POST' }, // ← POST 로 전송
        api,
        extra,
      );
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      api.dispatch(resetAuth());
      window.location.href = '/auth/login';
    }
  }

  return res;
};
