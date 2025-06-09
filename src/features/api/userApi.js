// src/features/api/userApi.js
// 내 정보 조회·수정·비밀번호 변경·탈퇴 – 빈칸은 전송 생략(FormData)
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '../../lib/baseQuery';
import toFormData from '../../lib/toFormData';


export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery:   baseQueryWithReauth,
  tagTypes: ['Me'],
  endpoints: (b) => ({
    /* 1) 내 정보 조회 */
    myInfo: b.query({
      query: () => '/api/user/my-info',
      providesTags: ['Me'],
    }),

    /* 2) 개인정보(주소·연락처 등) 수정 */
    updateMe: b.mutation({
      query: (payload) => ({
        url: '/api/user',
        method: 'PATCH',
        body: toFormData(payload),          // multipart/form-data
      }),
      invalidatesTags: ['Me'],
    }),

    /* 3) 비밀번호 변경 */
    changePassword: b.mutation({
      query: (payload) => ({
        url: '/api/user',
        method: 'PATCH',
        body: toFormData(payload),          // userId + password
      }),
    }),

    /* 4) 계정 탈퇴 */
    deleteMe: b.mutation({
      query: () => ({
        url: '/api/user/off',
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useMyInfoQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useDeleteMeMutation,
} = userApi;
