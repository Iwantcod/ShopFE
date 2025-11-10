// recommendApi.js — 맞춤 견적 관련 RTK Query slice
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '../../lib/baseQuery';

export const recommendApi = createApi({
  reducerPath: 'recommendApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Recommendation', 'Usage'],
  endpoints: (build) => ({
    /**
     * GET /api/recommended-usage/all
     * 용도 셀렉트 박스를 위한 전체 용도 목록
     */
    getUsageList: build.query({
      query: () => '/api/recommended-usage/all',
      providesTags: ['Usage'],
    }),

    /**
     * GET /api/product/recommend/{usageId}/{budget}
     * 용도+예산 조합으로 추천 견적 조회
     */
    getRecommendation: build.query({
      query: ({ usageId, budget }) =>
        `/api/product/recommend/${usageId}/${budget}`,
      providesTags: (_res, _err, arg) => [
        { type: 'Recommendation', id: `${arg.usageId}-${arg.budget}` },
      ],
    }),
  }),
});

export const { useGetUsageListQuery, useLazyGetRecommendationQuery } = recommendApi;
