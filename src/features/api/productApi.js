import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '../../lib/baseQuery';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'ProductList'],
  endpoints: (b) => ({

    list: b.query({
      query: ({ category, sort, offset = 0 }) =>
        `/api/product/${category}/${sort}/${offset}`,
      providesTags: (_r,_e,a)=>[
        { type: 'ProductList', id:`${a.category}-${a.sort}-${a.offset??0}` },
      ],
    }),

    getProductById: b.query({
      query: (id) => `/api/product/${id}`,
      providesTags: (_r,_e,id)=>[{ type: 'Product', id }],
    }),

    // (선택) 키워드·판매자 검색을 쓰려면 주석 해제
    searchByName: b.query({
      query: ({ keyword, offset = 0 }) =>
        `/api/product/name/${keyword}/${offset}`,
      providesTags: (_r,_e,q)=>[
        { type: 'ProductList', id:`search-${q.keyword}-${q.offset}` },
      ],
    }),
    listBySeller: b.query({
      query: ({ userId, offset = 0 }) =>
        `/api/product/seller/${userId}/${offset}`,
      providesTags: (_r,_e,q)=>[
        { type: 'ProductList', id:`seller-${q.userId}-${q.offset}` },
      ],
    }),
  }),
});

export const {
  useListQuery,
  useGetProductByIdQuery,
  useSearchByNameQuery,
  useListBySellerQuery,
} = productApi;

export const useLazyGetProductByIdQuery =
  productApi.endpoints.getProductById.useLazyQuery;
