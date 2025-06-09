// src/features/api/orderApi.js
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '../../lib/baseQuery';

import { cartApi } from './cartApi';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Order', 'OrderList', 'OrderItems'],
  endpoints: (b) => ({
    preRequest: b.mutation({
      query: (body) => ({
        url: '/api/order/pre-request',
        method: 'POST',
        body,
      }),
    }),
    approve: b.mutation({
      query: (body) => ({
        url: '/api/order/approve-request',
        method: 'POST',
        body,
        responseHandler: 'text',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // 장바구니 태그 무효화
          dispatch(cartApi.util.invalidateTags(['Cart']));
        }
      },
      invalidatesTags: () => [{ type: 'OrderList' }],
    }),
    myOrders: b.query({
      query: () => '/api/order/my',
      providesTags: () => [{ type: 'OrderList' }],
    }),
    cancel: b.mutation({
      query: (orderId) => ({
        url: `/api/order/cancel/${orderId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, orderId) => [
        { type: 'OrderList' },
        { type: 'OrderItems', id: orderId },
      ],
    }),
    /** 특정 주문의 주문 요소 조회 */
    orderItems: b.query({
      query: (orderId) => `/api/order-item/${orderId}`,
      providesTags: (_result, _error, orderId) => [{ type: 'OrderItems', id: orderId }],
    }),
  }),
});

export const {
  usePreRequestMutation,
  useApproveMutation,
  useMyOrdersQuery,
  useCancelMutation,
  useOrderItemsQuery,
} = orderApi;
