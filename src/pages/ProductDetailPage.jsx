// src/pages/ProductDetailPage.jsx
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useGetProductByIdQuery } from '../features/api/productApi';
import { useAddCartMutation }   from '../features/api/cartApi';
import { useSpecByIdQuery }     from '../features/api/specApi';
import Button                   from '../ui/core/Button';
import QuantityDialog           from '../ui/dialog/QuantityDialog';
import ReviewSection            from '../ui/composite/ReviewSection';
import useToast                 from '../ui/feedback/useToast';
import getImageUrl              from '../lib/getImageUrl';

export default function ProductDetailPage() {
  const { id } = useParams();
  const toast  = useToast();
  const { role } = useSelector((s) => s.auth);

  const { data: product, isLoading: pLoad } = useGetProductByIdQuery(id, { skip: !id });
  const { data: spec } = useSpecByIdQuery(
    product ? { category: product.categoryName, id: product.logicalFK } : null,
    { skip: !product }
  );

  const [addCart] = useAddCartMutation();
  const [openQty, setOpenQty] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const addToCart = async (qty) => {
    try {
      await addCart({ productId: id, quantity: qty }).unwrap();
      toast.push('장바구니에 추가되었습니다.');
    } catch {
      toast.push('장바구니 추가 실패', 'error');
    }
  };

  const fmt = (iso) =>
    new Date(iso).toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });

  if (pLoad || !product) return <div className="p-8 text-center">Loading…</div>;

  return (
    <div className="mx-auto max-w-6xl p-4">
      {/* 메인 섹션: 이미지 (왼쪽) + 스티키 정보 (오른쪽) */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* 상세 이미지 영역 */}
        <div className="flex-1">
          <img
            src={getImageUrl(product.descriptionImageUrl)}
            alt="상품 상세 이미지"
            className="mx-auto max-w-[800px] rounded-lg shadow"
          />
        </div>

        {/* 상품 정보: 스크롤 시에도 고정 */}
        <aside className="w-full space-y-4 self-start lg:sticky lg:top-20 lg:w-1/3">
          <h1 className="text-xl font-semibold">{product.name}</h1>
          <p className="text-gray-500">판매자: {product.sellerUserName}</p>
          <p className="text-2xl font-bold text-primary">
            {product.price.toLocaleString()}원
          </p>

          {/* 장바구니 추가 버튼 */}
          <Button onClick={() => setOpenQty(true)}>장바구니 추가</Button>

          <br></br>
          {/* 리뷰 보기 버튼: 장바구니 버튼 바로 아래 */}
          <Button onClick={() => setShowReview((v) => !v)}>
            리뷰 보기
          </Button>
        </aside>
      </div>

      {/* 리뷰 섹션: 버튼 클릭 시 보여줌 */}
      {showReview && <ReviewSection productId={id} />}

      {/* 상세 스펙 */}
      {spec && (
        <section className="mt-8">
          <h2 className="mb-2 text-lg font-semibold">상세 스펙</h2>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(spec).map(([k, v]) => (
                <tr key={k} className="border-b">
                  <th className="w-1/3 py-1 text-left font-medium capitalize">
                    {k}
                  </th>
                  <td className="py-1">{String(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* 수량 선택 다이얼로그 */}
      {openQty && (
        <QuantityDialog
          onClose={() => setOpenQty(false)}
          onConfirm={(q) => {
            addToCart(q);
            setOpenQty(false);
          }}
        />
      )}
    </div>
  );
}
