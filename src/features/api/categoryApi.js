// src/features/api/categoryApi.js
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '../../lib/baseQuery';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Category'],
  endpoints: (b) => ({
    /** 모든 카테고리 조회 – GET /api/category/all */
    allCategories: b.query({
      query: () => '/api/category/all',
      providesTags: ['Category'],
    }),
  }),
});

export const { useAllCategoriesQuery } = categoryApi;
