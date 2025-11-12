// src/pages/orders/OrderItemsModal.jsx
import { Link } from 'react-router-dom';

import Modal from '../../ui/dialog/Modal';
import SkeletonTable from '../../ui/composite/SkeletonTable';
import { useOrderItemsQuery } from '../../features/api/orderApi';

export default function OrderItemsModal({ orderId, onClose }) {
  const { data = [], isLoading, error } = useOrderItemsQuery(orderId, {
    skip: !orderId,
  });

  return (
    <Modal title="주문 상세" onClose={onClose}>
      {isLoading ? (
        <SkeletonTable rows={4} />
      ) : error ? (
        <p className="p-4 text-center text-sm text-red-500">
          데이터를 불러오지 못했습니다.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left font-medium">
              <th className="py-1">상품</th>
              <th className="py-1">수량</th>
            </tr>
          </thead>
          <tbody>
            {data.map((it) => (
              <tr key={it.productId} className="border-b last:border-none">
                <td className="py-1">
                  <Link
                    to={`/product/${it.productId}`}
                    className="text-[#b36f3b] hover:underline"
                    onClick={onClose}
                  >
                    {it.productName}
                  </Link>
                </td>
                <td className="py-1">{it.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Modal>
  );
}
