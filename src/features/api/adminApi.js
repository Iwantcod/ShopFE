// src/features/api/adminApi.js – 관리자 전용 API
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '../../lib/baseQuery';
import toFormData from '../../lib/toFormData';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Category', 'Spec', 'SellerApproval', 'AdminProduct'],
  endpoints: (b) => ({
    /* ───────── 전체 상품 최신순 조회 ───────── */
   allProducts: b.query({
     query: (startOffset = 0) => `/api/admin/all-product/${startOffset}`,
     providesTags: (_r, _e, offset) => [
       { type: 'AdminProduct', id: `page-${offset}` },
     ],
   }),

    // 카테고리
    allCategories: b.query({
      query: () => '/api/category/all',
      providesTags: ['Category'],
    }),
    addCategory: b.mutation({
      query: (body) => ({
        url: '/api/admin/category',
        method: 'POST',
        body: toFormData(body),
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: b.mutation({
      query: (body) => ({
        url: '/api/admin/category',
        method: 'PATCH',
        body: toFormData(body),
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: b.mutation({
      query: (categoryId) => ({
        url: `/api/admin/category/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    // 스펙
    specList: b.query({
      query: ({ categoryName, page = 0 }) =>
        `/api/spec/${categoryName}/latest/${page}`,
      providesTags: ['Spec'],
    }),
    addSpec: b.mutation({
      query: ({ categoryName, body }) => ({
        url: `/api/admin/spec/${categoryName}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Spec'],
    }),
    updateSpec: b.mutation({
      query: ({ categoryName, body }) => ({
        url: `/api/admin/spec/${categoryName}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Spec'],
    }),

    // 판매자 승인
    sellerApprovalList: b.query({
      query: ({ page = 0 }) => `/api/admin/check-on-approval/${page}`,
      providesTags: ['SellerApproval'],
    }),
    approveSeller: b.mutation({
      query: (userId) => ({
        url: `/api/admin/approve-seller/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['SellerApproval'],
    }),
    disapproveSeller: b.mutation({
      query: (userId) => ({
        url: `/api/admin/disapprove-seller/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['SellerApproval'],
    }),

        /* ───────── 상품 삭제(OFF) ───────── */
   deleteProduct: b.mutation({
     query: (productId) => ({
       url: `/api/admin/product/${productId}`,
       method: 'DELETE',
     }),
     invalidatesTags: (_r, _e, id) => [
       { type: 'AdminProduct', id: 'page-0' }, // 첫 페이지 다시 불러오도록
       { type: 'AdminProduct', id: `page-${Math.floor(id / 10)}` }, // 대략적 무효화
     ],
   }),
  }),
});

export const {
  useAllProductsQuery,
  useDeleteProductMutation,
  useAllCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useSpecListQuery,
  useAddSpecMutation,
  useUpdateSpecMutation,
} = adminApi;
