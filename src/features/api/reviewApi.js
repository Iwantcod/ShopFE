// reviewApi.js — 리뷰 RTK Query slice

import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '../../lib/baseQuery';
import toFormData from '../../lib/toFormData';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Review', 'ReviewList'],

  endpoints: (b) => ({
    /* ① 리뷰 목록 (10개 페이징) */
    list: b.query({
      query: ({ productId, offset = 0 }) =>
        `/api/review/${productId}/${offset}`,
      providesTags: (_r, _e, q) => [
        { type: 'ReviewList', id: `${q.productId}-${q.offset}` },
      ],
    }),

    /* ② 리뷰 작성 (FormData 전송) */
    add: b.mutation({
      query: (payload) => ({
        url: '/api/review',
        method: 'POST',
        body: toFormData(payload),
      }),
      invalidatesTags: (_r, _e, p) => [
        { type: 'ReviewList', id: `${p.productId}-0` },
      ],
    }),

    /* ③ 리뷰 수정 (FormData 전송) */
    update: b.mutation({
      query: ({ reviewId, ...payload }) => ({
        url: `/api/review/${reviewId}`,
        method: 'PATCH',
        body: toFormData(payload),
      }),
      invalidatesTags: (_r, _e, p) => [{ type: 'Review', id: p.reviewId }],
    }),

    /* ④ 리뷰 삭제 */
    remove: b.mutation({
      query: (reviewId) => ({
        url: `/api/review/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Review', id }],
    }),

    /* ⑤ 리뷰 작성 권한 확인 */
    writePermission: b.query({
      query: (productId) => `/api/review/write-permission/${productId}`,
      // 200 OK면 true
      transformResponse: (_data, _meta) => true,
      // 401 Unauthorized면 false, 다른 에러면 throw
      transformErrorResponse: (error) => {
        if (error.status === 401) return false;
        throw error;
      },
    }),
  }),
});

/* ----------------------------------------------------------------------
   ⬇️ 엔드포인트 이름 → 원하는 훅 이름으로 “별칭” 매핑
   -------------------------------------------------------------------- */
export const {
  useListQuery:      useReviewListQuery,      // list   → useReviewListQuery
  useAddMutation:    useAddReviewMutation,    // add    → useAddReviewMutation
  useUpdateMutation: useUpdateReviewMutation, // update → useUpdateReviewMutation
  useRemoveMutation: useDeleteReviewMutation, // remove → useDeleteReviewMutation
  useWritePermissionQuery,
} = reviewApi;
