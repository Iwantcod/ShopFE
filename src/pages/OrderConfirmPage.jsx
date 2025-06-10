// src/pages/OrderConfirmPage.jsx — orderAddressDetail 표시 + preRequest
import { useNavigate } from 'react-router-dom';

import { usePreRequestMutation, useApproveMutation } from '../features/api/orderApi';
import { useMyQuery } from '../features/api/cartApi';
import Button   from '../ui/core/Button';
import useToast from '../ui/feedback/useToast';

export default function OrderConfirmPage() {
  const nav = useNavigate();
  const toast = useToast();
  const [preRequest, { isLoading }] = usePreRequestMutation();
  const [approveReq,  { isLoading: appLoading  }] = useApproveMutation();

  const payload = JSON.parse(sessionStorage.getItem('ORDER_PAYLOAD') ?? '{}');
  if (!payload.orderItems)
    return <p className="p-8 text-center">주문 정보가 없습니다.</p>;

  const { data: cart = [], isFetching } = useMyQuery();
  if (isFetching) return <p className="p-8 text-center">Loading…</p>;
  if (!cart.length) return <p className="p-8 text-center">장바구니가 없습니다.</p>;

  const amount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePay = async () => {
    try {
       /* ① pre-request → orderId, amount 수령 */
      const { orderId } = await preRequest({ ...payload, amount }).unwrap();
     
      /* ② [PG TODO] 실제 PG 결제 진행 후 paymentKey 획득
         - 현재 단계에선 SDK 미연동: 가상의 paymentKey 사용 */
      const paymentKey = 'TEST-PAYMENT-KEY'; // 추후 실제 결제 키(PG 사에서 발급)로 교체 필요

       /* ③ approve-request 최종 승인 */
      await approveReq({ paymentKey, orderId, amount }).unwrap();

      /* ④ 성공 화면 */
      nav('/orders', { replace: true });
      toast.push('주문이 완료되었습니다.');
    } catch {
      toast.push('결제 요청 실패', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4">
      <h1 className="text-xl font-semibold">주문 확인</h1>

      <div className="space-y-1 rounded bg-gray-50 p-4 text-sm">
        <p><strong>주소:</strong> {payload.orderAddress}</p>
        <p><strong>상세 주소:</strong> {payload.orderAddressDetail}</p> {/* ← 변경 */}
        <p><strong>연락처:</strong> {payload.phone}</p>
        <p><strong>결제수단:</strong> {payload.payment === 'CARD' ? '카드' : '계좌'}</p>
      </div>

      <table className="w-full text-sm">
        <thead><tr><th>상품</th><th>수량</th><th>가격</th></tr></thead>
        <tbody>
          {cart.map((c) => (
            <tr key={c.productId}>
              <td>{c.productName}</td>
              <td className="text-center">{c.quantity}</td>
              <td className="text-right">{(c.price * c.quantity).toLocaleString()}원</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-right text-lg font-bold">
        결제 금액: {amount.toLocaleString()}원
      </p>

      <Button className="w-full py-3" onClick={handlePay} disabled={isLoading}>
        결제하기
      </Button>
    </div>
  );
}
