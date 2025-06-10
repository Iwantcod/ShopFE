import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '../../lib/baseQuery';

export const specApi = createApi({
  reducerPath: 'specApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Spec', 'SpecList'],
  endpoints: (b) => ({
    /* 1) ID별 상세 */
    specById: b.query({
      query: ({ category, id }) => `/api/spec/${category}/id/${id}`,
      providesTags: (_r,_e,{ id }) => [{ type:'Spec', id }],
    }),
    /* 2) 최신순 */
    latestSpecs: b.query({
      query: ({ category, offset }) =>
        `/api/spec/${category}/latest/${offset}`,
      providesTags: (_r,_e,{ category, offset })=>[
        { type:'SpecList', id:`${category}-latest-${offset}` },
      ],
    }),
    /* 3) 모델명 검색 */
    searchSpecsByName: b.query({
      query: ({ category, modelName, offset }) =>
        `/api/spec/${category}/name/${modelName}/${offset}`,
      providesTags: (_r,_e,p)=>[
        { type:'SpecList',
          id:`${p.category}-search-${p.modelName}-${p.offset}` },
      ],
    }),
  }),
});

export const {
  useSpecByIdQuery,
  useLatestSpecsQuery,
  useSearchSpecsByNameQuery,
} = specApi;
