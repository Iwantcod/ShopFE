// src/pages/OrderFormPage.jsx — orderAddressDetail 필드 반영
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

import { useMyQuery } from '../features/api/cartApi';
import Button   from '../ui/core/Button';
import useToast from '../ui/feedback/useToast';

const phoneRegex = /^0\d{1,2}-\d{3,4}-\d{4}$/;

/* ⬇️ 상세 주소 필드명을 orderAddressDetail 로 정의 */
const schema = z.object({
  orderAddress:        z.string().min(5, '주소를 입력하세요'),
  orderAddressDetail:  z.string().min(1, '상세 주소를 입력하세요'),
  phone:               z.string().regex(phoneRegex, '예: 010-1234-5678'),
  payment:             z.enum(['CARD', 'ACCOUNT']),
});

export default function OrderFormPage() {
  const nav   = useNavigate();
  const toast = useToast();
  const { data: cart = [], isFetching } = useMyQuery();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (d) =>
        setValue('orderAddress', `${d.address} (${d.zonecode})`),
    }).open();
  };

  const onSubmit = (v) => {
    if (!cart.length) {
      toast.push('장바구니가 비었습니다', 'error');
      return;
    }
    sessionStorage.setItem(
      'ORDER_PAYLOAD',
      JSON.stringify({
        ...v,                              // orderAddressDetail 포함
        orderItems: cart.map(({ productId, quantity }) => ({ productId, quantity })),
      }),
    );
    nav('/order/confirm');
  };

  if (isFetching) return <p className="p-8 text-center">Loading…</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg space-y-6 p-4">
      <h1 className="text-xl font-semibold">배송 및 결제 정보</h1>

      {/* 기본 주소 */}
      <div className="space-y-2">
        <label className="block font-medium">주소</label>
        <div className="flex gap-2">
          <input
            {...register('orderAddress')}
            className="flex-1 rounded border px-3 py-2"
            placeholder="도로명 주소"
          />
          <Button type="button" onClick={openPostcode}>우편번호</Button>
        </div>
        {errors.orderAddress && <p className="text-sm text-red-500">{errors.orderAddress.message}</p>}
      </div>

      {/* 상세 주소 */}
      <div className="space-y-2">
        <label className="block font-medium">상세 주소 (동/호수)</label>
        <input
          {...register('orderAddressDetail')}
          className="w-full rounded border px-3 py-2"
          placeholder="예) 101동 1001호"
        />
        {errors.orderAddressDetail && (
          <p className="text-sm text-red-500">{errors.orderAddressDetail.message}</p>
        )}
      </div>

      {/* 연락처 */}
      <div className="space-y-2">
        <label className="block font-medium">연락처 <span className="text-xs text-gray-500">(예: 010-1234-5678)</span></label>
        <input
          {...register('phone')}
          className="w-full rounded border px-3 py-2"
          placeholder="010-1234-5678"
          pattern="0\d{1,2}-\d{3,4}-\d{4}"
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
      </div>

      {/* 결제수단 */}
      <div className="space-y-2">
        <label className="block font-medium">결제 수단</label>
        <select {...register('payment')} className="w-full rounded border p-2">
          <option value="CARD">카드</option>
          <option value="ACCOUNT">계좌</option>
        </select>
      </div>

      <Button className="w-full py-3">다음 단계</Button>
    </form>
  );
}

if (!window.daum?.Postcode) {
  const s = document.createElement('script');
  s.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  document.body.appendChild(s);
}
