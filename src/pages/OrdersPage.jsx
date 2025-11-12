// src/pages/orders/OrdersPage.jsx
import { useState } from 'react';

import { useMyOrdersQuery, useCancelMutation } from '../features/api/orderApi';
import Button from '../ui/core/Button';
import BenchmarkSelectModal from '../components/BenchmarkSelectModal';
import BenchmarkResultModal from '../components/BenchmarkResultModal';

import OrderItemsModal from './orders/OrderItemsModal';

const statusLabel = {
  PROCESSING:  '배송 준비 중',
  IN_DELIVERY: '배송 중',
  DELIVERED:   '배송 완료',
  RETURNING:   '반품 중',
  CANCELED:    '취소',
  CONFIRMED:   '구매 확정',
};

const fmt = (iso) =>
  new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

export default function OrdersPage() {
  const { data = [], isFetching } = useMyOrdersQuery();
  const [cancelOrder] = useCancelMutation();
  const [detailId, setDetailId]       = useState(null);
  const [openSelect, setOpenSelect]   = useState(false);
  const [benchParams, setBenchParams] = useState(null);

  if (isFetching) return <p className="p-8 text-center">Loading…</p>;
  if (!data.length) return <p className="p-8 text-center">주문 내역이 없습니다.</p>;

  // flat orderItems
  const flatItems = data.flatMap((o) => o.orderItems || []);

  // 벤치마크 가능 여부
  const cpuItems = flatItems.filter((it) => it.categoryIdName === 'cpu' || it.categoryName === 'cpu');
  const gpuItems = flatItems.filter((it) => it.categoryName === 'graphic');
  const canBenchmark = cpuItems.length > 0 && gpuItems.length > 0;

  return (
    <div className="mx-auto max-w-screen-lg space-y-6 p-4">
      <div className="flex justify-end">
        <button
          disabled={!canBenchmark}
          className="bg-secondary rounded px-4 py-2 text-white disabled:opacity-40"
          onClick={() => setOpenSelect(true)}
        >
          벤치마크 확인
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="w-20 text-center">상세</th>
            <th className="w-28">주문번호</th>
            <th className="w-44">주문 일자</th>
            <th className="w-40 text-right">총 주문 금액</th>
            <th className="w-32 text-center">상태</th>
            <th className="w-28 text-center">취소</th>
          </tr>
        </thead>
        <tbody>
          {data.map((o) => (
            <tr key={o.orderId} className="border-b">
              <td className="text-center">
                <Button
                  size="xs"
                  className="bg-[#f8ebe0] px-3 py-1 text-[#8a684f] hover:bg-[#f3dfcf]"
                  onClick={() => setDetailId(o.orderId)}
                >
                  상세
                </Button>
              </td>
              <td>{o.orderId}</td>
              <td>{fmt(o.requestedAt)}</td>
              <td className="text-right">{o.amount.toLocaleString()}원</td>
              <td className="text-center">{statusLabel[o.deliveryStatus]}</td>
              <td className="text-center">
                {o.deliveryStatus === 'PROCESSING' && (
                  <Button
                    size="xs"
                    className="bg-red-100 px-4 py-1 text-red-600 hover:bg-red-200"
                    onClick={async () => {
                      try {
                        await cancelOrder(o.orderId).unwrap();
                      } catch {
                        // TODO: toast 연동 시 에러 안내
                      }
                    }}
                  >
                    취소
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {detailId && (
        <OrderItemsModal
          orderId={detailId}
          onClose={() => setDetailId(null)}
        />
      )}

      {openSelect && (
        <BenchmarkSelectModal
          items={flatItems.map((it) => ({ productId: it.productId, productName: it.productName, categoryId: it.categoryId }))}
          onClose={() => setOpenSelect(false)}
          onConfirm={(cpuId, gpuId) => {
            setBenchParams({ cpuSpecId: cpuId, graphicSpecId: gpuId });
            setOpenSelect(false);
          }}
        />
      )}

      {benchParams && (
        <BenchmarkResultModal
          cpuSpecId={benchParams.cpuSpecId}
          graphicSpecId={benchParams.graphicSpecId}
          onClose={() => setBenchParams(null)}
        />
      )}
    </div>
  );
}
