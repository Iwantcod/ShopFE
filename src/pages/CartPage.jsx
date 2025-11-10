// src/pages/CartPage.jsx
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  useMyQuery,
  useUpMutation,
  useDownMutation,
  useRemoveMutation,
} from '../features/api/cartApi';
import { useLazyGetProductByIdQuery } from '../features/api/productApi';
import { useLazyGetBenchMarkQuery } from '../features/api/benchmarkApi';
import { useAllCategoriesQuery } from '../features/api/categoryApi';
import useToast from '../ui/feedback/useToast';
import { openBenchmarkWindow } from '../lib/openBenchmarkWindow';

export default function CartPage() {
  const { data: items = [], isLoading } = useMyQuery();
  const [upCart] = useUpMutation();
  const [downCart] = useDownMutation();
  const [removeCart] = useRemoveMutation();
  const navigate = useNavigate();
  const [fetchProduct] = useLazyGetProductByIdQuery();
  const [fetchBenchmark] = useLazyGetBenchMarkQuery();
  const { data: categories = [] } = useAllCategoriesQuery();
  const categoryMap = useMemo(() => {
    const mapping = new Map();
    categories.forEach((cat) => {
      mapping.set(cat.categoryId, (cat.categoryName || '').toLowerCase());
    });
    return mapping;
  }, [categories]);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);
  const toast = useToast();

  if (isLoading) {
    return <p className="p-8 text-center">Loading…</p>;
  }

  const total = items.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const handleBenchmarkClick = async () => {
    if (!items.length || benchmarkLoading) return;
    setBenchmarkLoading(true);

    try {
      let cpuSpecId = null;
      let graphicSpecId = null;

      for (const item of items) {
        if (cpuSpecId && graphicSpecId) break;

        try {
          const detail = await fetchProduct(item.productId).unwrap();
          const categoryNameRaw =
            categoryMap.get(item.categoryId) ??
            detail?.categoryName ??
            detail?.categoryIdName ??
            '';
          const categoryName = categoryNameRaw.toLowerCase();
          const specId =
            detail?.logicalFK ??
            detail?.logicalFk ??
            detail?.specId ??
            detail?.specID ??
            null;

          if (!specId) continue;

          if (!cpuSpecId && categoryName === 'cpu') {
            cpuSpecId = Number(specId);
          } else if (
            !graphicSpecId &&
            (categoryName === 'graphic' || categoryName === 'gpu')
          ) {
            graphicSpecId = Number(specId);
          }
        } catch {
          // ignore individual failures
        }
      }

      if (!cpuSpecId || !graphicSpecId) {
        toast.push('CPU와 그래픽카드를 모두 담아야 성능을 확인할 수 있습니다.', 'error');
        return;
      }

      try {
        const data = await fetchBenchmark({ cpuSpecId, graphicSpecId }).unwrap();
        openBenchmarkWindow(data);
      } catch (err) {
        const status = err?.status ?? err?.originalStatus;
        if (status === 404) {
          toast.push('해당 조합에 맞는 성능 정보가 없습니다.', 'error');
        } else {
          toast.push('성능 정보를 가져오지 못했습니다.', 'error');
        }
      }
    } catch {
      toast.push('성능 정보를 가져오지 못했습니다.', 'error');
    } finally {
      setBenchmarkLoading(false);
    }
  };

  return (
    <section className="space-y-6 p-4">
      <h1 className="text-xl font-semibold">장바구니</h1>

      {items.length > 0 ? (
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-1/2" />
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/12" />
          </colgroup>
          <thead>
            <tr>
              <th className="w-1/2 text-left">상품</th>
              <th className="w-1/4 text-left">수량</th>
              <th className="w-1/4 text-left">가격</th>
              <th className="w-1/12" />
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.cartId} className="border-b">
                <td>
                  <Link to={`/product/${c.productId}`} className="hover:underline">
                    {c.productName}
                  </Link>
                </td>
                <td className="whitespace-nowrap">
                  <button onClick={() => downCart(c.cartId)} className="px-2">
                    -
                  </button>
                  {c.quantity}
                  <button onClick={() => upCart(c.cartId)} className="px-2">
                    +
                  </button>
                </td>
                <td>{(c.price * c.quantity).toLocaleString()}원</td>
                <td>
                  <button
                    onClick={() => removeCart(c.cartId)}
                    className="text-red-600 hover:underline"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="p-8 text-center text-gray-500">장바구니가 비어있습니다.</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-bold">합계:&nbsp;{total.toLocaleString()}원</span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!items.length || benchmarkLoading}
            className="rounded bg-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={handleBenchmarkClick}
          >
            {benchmarkLoading ? '확인 중…' : '성능 확인'}
          </button>
          <button
            disabled={!items.length}
            className="rounded bg-primary px-6 py-2 text-white disabled:opacity-40"
            onClick={() => navigate('/order')}
          >
            주문하기
          </button>
        </div>
      </div>
    </section>
  );
}
