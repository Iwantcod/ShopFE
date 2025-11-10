// cartApi.js — 장바구니 RTK Query slice (useAddCartMutation 자동 생성)

 
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '../../lib/baseQuery';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Cart'],

  endpoints: (b) => ({
    /* ----------------------------------------------------------------
       ① POST /api/cart/add  →  useAddCartMutation
       ---------------------------------------------------------------- */
    addCart: b.mutation({
      query: ({ productId, quantity }) => ({
        url: '/api/cart/add',
        method: 'POST',
        body: { productId, quantity },
      }),
      invalidatesTags: ['Cart'],
    }),

    /* ----------------------------------------------------------------
       ② GET /api/cart/my  →  useMyQuery
       ---------------------------------------------------------------- */
    my: b.query({
      async queryFn(_arg, _api, _extra, baseQuery) {
        const result = await baseQuery('/api/cart/my');
        if (result.error) {
          const status = result.error.status ?? result.error.originalStatus;
          if (status === 404) {
            return { data: [] };
          }
          return { error: result.error };
        }
        return { data: result.data ?? [] };
      },
      providesTags: ['Cart'],
    }),

    /* ----------------------------------------------------------------
       ③ PATCH /api/cart/up/{cartId}  →  useUpMutation
       ---------------------------------------------------------------- */
    up: b.mutation({
      query: (cartId) => ({
        url: `/api/cart/up/${cartId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Cart'],
    }),

    /* ----------------------------------------------------------------
       ④ PATCH /api/cart/down/{cartId}  →  useDownMutation
       ---------------------------------------------------------------- */
    down: b.mutation({
      query: (cartId) => ({
        url: `/api/cart/down/${cartId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Cart'],
    }),

    /* ----------------------------------------------------------------
       ⑤ DELETE /api/cart/{cartId}  →  useRemoveMutation
       ---------------------------------------------------------------- */
    remove: b.mutation({
      query: (cartId) => ({
        url: `/api/cart/${cartId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

/* ---------- 자동 생성 훅 export ---------- */
export const {
  useAddCartMutation, // 장바구니에 상품 추가
  useMyQuery,         // 내 장바구니 목록 조회
  useUpMutation,      // 수량 +1
  useDownMutation,    // 수량 -1
  useRemoveMutation,  // 항목 삭제
} = cartApi;
