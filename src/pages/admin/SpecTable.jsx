// src/pages/admin/SpecTable.jsx
import { useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';

import {
  useAllCategoriesQuery,
  useSpecListQuery,
  useAddSpecMutation,
} from '../../features/api/adminApi';
import Button from '../../ui/core/Button';
import useToast from '../../ui/feedback/useToast';

export default function SpecTable() {
  const toast = useToast();
  const { data: categories = [] } = useAllCategoriesQuery();
  const [categoryName, setCategoryName] = useState('');
  const [page, setPage] = useState(0);
  const [bodyInput, setBodyInput] = useState('');
  const [addSpec, { isLoading: adding }] = useAddSpecMutation();

  const { data: specs = [], isLoading, isError } = useSpecListQuery(
    categoryName ? { categoryName, page } : skipToken,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName) {
      toast.push('카테고리를 선택하세요.', 'error');
      return;
    }
    let payload;
    try {
      payload = JSON.parse(bodyInput || '{}');
    } catch {
      toast.push('JSON 형식이 잘못되었습니다.', 'error');
      return;
    }
    try {
      await addSpec({ categoryName, body: payload }).unwrap();
      toast.push('스펙이 등록되었습니다.');
      setBodyInput('');
    } catch {
      toast.error('스펙 등록에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">모델 스펙 관리</h1>
        <p className="text-sm text-gray-500">카테고리를 선택하고 JSON 형식으로 스펙을 등록하세요.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">카테고리 선택</label>
          <select
            className="rounded border px-3 py-2"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              setPage(0);
            }}
          >
            <option value="">카테고리를 선택하세요</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryName?.toLowerCase()}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">스펙 JSON</label>
          <textarea
            value={bodyInput}
            onChange={(e) => setBodyInput(e.target.value)}
            rows={6}
            className="w-full rounded border px-3 py-2 font-mono text-sm"
            placeholder='{"specName":"예시"}'
          />
          <Button type="submit" disabled={adding} className="w-full">
            {adding ? '등록 중…' : '스펙 등록'}
          </Button>
        </form>
      </div>

      <section className="rounded-lg border border-gray-200">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h2 className="text-lg font-semibold">스펙 목록</h2>
          {categoryName && (
            <span className="text-sm text-gray-500">{categoryName.toUpperCase()} 카테고리</span>
          )}
        </div>

        {!categoryName ? (
          <p className="p-4 text-sm text-gray-500">카테고리를 선택하면 스펙 목록을 확인할 수 있습니다.</p>
        ) : isLoading ? (
          <p className="p-4 text-sm text-gray-500">불러오는 중…</p>
        ) : isError ? (
          <p className="p-4 text-sm text-red-500">스펙을 불러올 수 없습니다.</p>
        ) : (
          <div className="divide-y">
            {specs.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">등록된 스펙이 없습니다.</p>
            ) : (
              specs.map((spec) => (
                <details key={spec.id ?? spec.specId ?? Math.random()} className="p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-800">
                    {spec.specName ?? spec.id ?? '스펙'}
                  </summary>
                  <pre className="mt-2 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-700">
                    {JSON.stringify(spec, null, 2)}
                  </pre>
                </details>
              ))
            )}
          </div>
        )}
      </section>

      {categoryName && (
        <div className="flex justify-end gap-2 text-sm">
          <button
            type="button"
            className="rounded border border-gray-300 px-3 py-1"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            이전
          </button>
          <span className="self-center text-gray-500">페이지 {page + 1}</span>
          <button
            type="button"
            className="rounded border border-gray-300 px-3 py-1"
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
