// src/pages/CartPage.jsx
import { Link, useNavigate } from 'react-router-dom';

import {
  useMyQuery,
  useUpMutation,
  useDownMutation,
  useRemoveMutation,
} from '../features/api/cartApi';

export default function CartPage() {
  // ① 장바구니 목록 조회
  const { data: items = [], isLoading } = useMyQuery();
  const [upCart]      = useUpMutation();     // 수량 +1
  const [downCart]    = useDownMutation();   // 수량 –1
  const [removeCart]  = useRemoveMutation(); // 항목 삭제
  const navigate      = useNavigate();

  if (isLoading) {
    return <p className="p-8 text-center">Loading…</p>;
  }

  // 합계 계산
  const total = items.reduce((sum, c) => sum + c.price * c.quantity, 0);

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
                {/* 상품명 → 상세 페이지 링크 */}
                <td>
                  <Link to={`/product/${c.productId}`} className="hover:underline">
                    {c.productName}
                  </Link>
                </td>

                {/* 수량 증감 버튼 */}
                <td className="whitespace-nowrap">
                  <button onClick={() => downCart(c.cartId)} className="px-2">
                    -
                  </button>
                  {c.quantity}
                  <button onClick={() => upCart(c.cartId)} className="px-2">
                    +
                  </button>
                </td>

                {/* 개별 합계 = 단가 × 수량 */}
                <td>{(c.price * c.quantity).toLocaleString()}원</td>

                {/* 삭제 */}
                <td>
                  <button onClick={() => removeCart(c.cartId)} className="text-red-600 hover:underline">
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

      {/* 합계 및 주문 버튼 */}
      <div className="flex items-center justify-between">
        <span className="font-bold">합계:&nbsp;{total.toLocaleString()}원</span>

        <button
          disabled={!items.length}
          className="rounded bg-primary px-6 py-2 text-white disabled:opacity-40"
          onClick={() => navigate('/order')}
        >
          주문하기
        </button>
      </div>
    </section>
  );
}
