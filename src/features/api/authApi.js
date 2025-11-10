import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '../../lib/baseQuery';
import { setRole } from '../auth/authSlice';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (b) => ({

    /* POST /api/auth/login */
    login: b.mutation({
      query: (formData) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: formData,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const role   = res.meta.response.headers.get('Auth-Role');
        const userId = res.meta.response.headers.get('Auth-User-Id');
        dispatch(setRole({ role, userId }));
      },
    }),

    /* POST /api/auth/logout  ← GET → POST 으로 수정 */
    logout: b.mutation({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(setRole(null));
      },
    }),

    /* POST /api/auth/join */
    join: b.mutation({
      query: (formData) => ({
        url: '/api/auth/join',
        method: 'POST',
        body: formData,
      }),
    }),

    /* POST /api/auth/join/seller */
    joinSeller: b.mutation({
      query: (formData) => ({
        url: '/api/auth/join/seller',
        method: 'POST',
        body: formData,
      }),
    }),

    /* POST /api/auth/join-complete */
    joinComplete: b.mutation({
      query: (formData) => ({
        url: '/api/auth/join-complete',
        method: 'POST',
        body: formData,
      }),
    }),

    /* GET /api/auth/dup-email/{email} */
    checkEmailDup: b.query({
      query: (email) => `/api/auth/dup-email/${encodeURIComponent(email)}`,
    }),

    /* GET /api/auth/dup-username/{username} */
    checkUsernameDup: b.query({
      query: (username) =>
        `/api/auth/dup-username/${encodeURIComponent(username)}`,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useJoinMutation,
  useJoinSellerMutation,
  useJoinCompleteMutation,
  useLazyCheckEmailDupQuery,
  useLazyCheckUsernameDupQuery,
} = authApi;
