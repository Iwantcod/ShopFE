// src/features/api/benchmarkApi.js
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '../../lib/baseQuery';

/**
 * 벤치마크 API Slice
 * CPU/GPU 조합에 대한 성능 평균 프레임 정보를 조회합니다.
 */
export const benchmarkApi = createApi({
  reducerPath: 'benchmarkApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    /**
     * CPU Spec ID와 Graphic Spec ID를 기반으로 벤치마크 정보를 가져옵니다.
     * @param {{ cpuSpecId: number, graphicSpecId: number }} arg
     * @returns {{
     *   benchmarkId: number,
     *   cpuSpecId: number,
     *   cpuModelName: string,
     *   graphicSpecId: number,
     *   graphicModelName: string,
     *   avgFrame1: number,
     *   avgFrame2: number,
     *   avgFrame3: number
     * }}
     * ```json
     * {
     *   "benchmarkId": 9007199254740991,
     *   "cpuSpecId": 9007199254740991,
     *   "cpuModelName": "string",
     *   "graphicSpecId": 9007199254740991,
     *   "graphicModelName": "string",
     *   "avgFrame1": 1073741824,
     *   "avgFrame2": 1073741824,
     *   "avgFrame3": 1073741824
     * }
     * ```
     */
    getBenchMark: build.query({
      query: ({ cpuSpecId, graphicSpecId }) =>
        `/api/benchmark?cpuSpecId=${cpuSpecId}&graphicSpecId=${graphicSpecId}`,
    }),
  }),
});

export const { useGetBenchMarkQuery } = benchmarkApi;
