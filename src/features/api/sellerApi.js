import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '../../lib/baseQuery';
import toFormData from '../../lib/toFormData';

export const sellerApi = createApi({
  reducerPath: 'sellerApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['SellerProduct'],
  endpoints: (b) => ({
    myProducts: b.query({
      query: ({ userId, offset = 0 }) =>
        `/api/product/seller/${userId}/${offset}`,
      providesTags: (r = [], _e, a) => [
        ...r.map(({ productId }) => ({ type: 'SellerProduct', id: productId })),
        { type: 'SellerProduct', id: `page-${a.offset}` },
      ],
    }),
    addProduct: b.mutation({
      query: (body) => ({ url: '/api/seller/product', method: 'POST', body: toFormData(body) }),
      invalidatesTags: ['SellerProduct'],
    }),
    updateProduct: b.mutation({
      query: ({ productId, ...body }) => ({
        url: `/api/seller/product-update/${productId}`,
        method: 'POST',
        body: toFormData(body),
      }),
      invalidatesTags: (_r,_e,{ productId }) => [{ type:'SellerProduct', id:productId }],
    }),
    offProduct: b.mutation({
      query: (productId) => ({ url:`/api/seller/product/${productId}`, method:'PATCH' }),
      invalidatesTags: (_r,_e,id)=>[{ type:'SellerProduct', id }],
    }),
    invenUp: b.mutation({
      query: ({ productId, quantity }) => ({
        url: `/api/seller/inven-up/${productId}/${quantity}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_r,_e,{ productId }) => [{ type:'SellerProduct', id:productId }],
    }),
    invenDown: b.mutation({
      query: ({ productId, quantity }) => ({
        url: `/api/seller/inven-down/${productId}/${quantity}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_r,_e,{ productId }) => [{ type:'SellerProduct', id:productId }],
    }),
  }),
});

export const {
  useMyProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useOffProductMutation,
  useInvenUpMutation,
  useInvenDownMutation,
} = sellerApi;
