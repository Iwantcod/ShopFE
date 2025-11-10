import { useEffect, useMemo, useState } from 'react';

import { useAddCartMutation } from '../features/api/cartApi';
import {
  useGetUsageListQuery,
  useLazyGetRecommendationQuery,
} from '../features/api/recommendApi';
import { useLazyGetBenchMarkQuery } from '../features/api/benchmarkApi';
import Button from '../ui/core/Button';
import Modal from '../ui/dialog/Modal';
import useToast from '../ui/feedback/useToast';
import { openBenchmarkWindow } from '../lib/openBenchmarkWindow';

const PRODUCT_FIELDS = [
  { key: 'cpuProduct', label: 'CPU' },
  { key: 'graphicProduct', label: '그래픽카드' },
  { key: 'mainboardProduct', label: '메인보드' },
  { key: 'memoryProduct', label: '메모리' },
  { key: 'storageProduct', label: '저장장치' },
  { key: 'powerProduct', label: '파워' },
  { key: 'caseProduct', label: '케이스' },
  { key: 'coolerProduct', label: '쿨러' },
];

function formatPrice(value) {
  if (value == null) return '-';
  return `${Number(value).toLocaleString()}원`;
}

export default function CustomEstimateModal({ onClose }) {
  const toast = useToast();
  const {
    data: usageList = [],
    isLoading: usageLoading,
    error: usageError,
  } = useGetUsageListQuery();
  const [triggerRecommend, recommendState] = useLazyGetRecommendationQuery();
  const {
    data: recommendation,
    isFetching: recommendLoading,
    error: recommendError,
    reset: resetRecommendation,
  } = recommendState;
  const [triggerBenchmark, { isFetching: benchmarkLoading }] = useLazyGetBenchMarkQuery();
  const [addCart, { isLoading: cartLoading }] = useAddCartMutation();

  const [selectedUsage, setSelectedUsage] = useState('');
  const [budget, setBudget] = useState('');
  const [inputsHidden, setInputsHidden] = useState(false);

  useEffect(() => {
    if (usageList.length && !selectedUsage) {
      setSelectedUsage(String(usageList[0].usageId));
    }
  }, [usageList, selectedUsage]);

  const usageOptions = useMemo(
    () => usageList.map((usage) => ({ value: usage.usageId, label: usage.usageName })),
    [usageList],
  );

  const productList = useMemo(
    () =>
      PRODUCT_FIELDS.map((info) => ({
        ...info,
        product: recommendation?.[info.key] ?? null,
      })),
    [recommendation],
  );

  const totalPrice = recommendation?.totalPrice ?? null;

  const handleGenerate = async () => {
    if (!selectedUsage) {
      toast.push('용도를 선택해주세요.', 'error');
      return;
    }
    const numBudget = Number(budget);
    if (!Number.isFinite(numBudget) || numBudget <= 0) {
      toast.push('예산을 숫자로 입력해주세요.', 'error');
      return;
    }

    try {
      const result = await triggerRecommend({
        usageId: Number(selectedUsage),
        budget: numBudget,
      }).unwrap();
      if (result) {
        setInputsHidden(true);
      }
    } catch (err) {
      console.error(err);
      toast.push('추천 견적을 불러오지 못했습니다.', 'error');
    }
  };

  const handleAddCart = async () => {
    const items = productList
      .map((entry) => entry.product)
      .filter(Boolean);

    if (!items.length) {
      toast.push('추가할 상품이 없습니다.', 'error');
      return;
    }

    const uniqueItems = Array.from(new Map(items.map((it) => [it.productId, it])).values());

    try {
      await Promise.all(
        uniqueItems.map((item) =>
          addCart({ productId: item.productId, quantity: 1 }).unwrap(),
        ),
      );
      toast.push('견적 상품을 장바구니에 담았습니다.');
    } catch (err) {
      console.error(err);
      toast.push('장바구니 추가에 실패했습니다.', 'error');
    }
  };

  const handleBenchmark = async () => {
    const cpuSpecId = recommendation?.cpuProduct?.logicalFK;
    const graphicSpecId = recommendation?.graphicProduct?.logicalFK;

    if (!cpuSpecId || !graphicSpecId) {
      toast.push('CPU와 그래픽카드가 모두 포함된 견적만 성능을 확인할 수 있습니다.', 'error');
      return;
    }

    try {
      const data = await triggerBenchmark({ cpuSpecId, graphicSpecId }).unwrap();
      openBenchmarkWindow(data);
    } catch (err) {
      console.error(err);
      toast.push('벤치마크 정보를 불러오지 못했습니다.', 'error');
    }
  };

  return (
    <Modal
      title="맞춤 견적"
      onClose={onClose}
      className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg"
    >
      <div className="space-y-6">
        {!inputsHidden && (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-600">용도</span>
                <select
                  value={selectedUsage}
                  onChange={(e) => setSelectedUsage(e.target.value)}
                  disabled={usageLoading}
                  className="rounded border px-3 py-2"
                >
                  {usageOptions.length === 0 ? (
                    <option value="">용도 정보를 불러오지 못했습니다.</option>
                  ) : (
                    usageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))
                  )}
                </select>
                {usageError && (
                  <span className="text-xs text-red-500">
                    용도 정보를 불러오지 못했습니다. 새로고침 후 다시 시도하세요.
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-medium text-gray-600">예산 (원)</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="예: 1500000"
                  className="rounded border px-3 py-2"
                />
              </label>
            </section>

            <div className="flex justify-end gap-2">
              <Button
                onClick={handleGenerate}
                disabled={recommendLoading || usageLoading}
              >
                {recommendLoading ? '불러오는 중…' : '맞춤 견적 생성'}
              </Button>
            </div>
          </>
        )}

        {inputsHidden && (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded bg-gray-300 px-4 py-2 text-gray-900 hover:bg-gray-400"
              onClick={() => {
                resetRecommendation?.();
                setInputsHidden(false);
                setBudget('');
                if (usageList.length) {
                  setSelectedUsage(String(usageList[0].usageId));
                }
              }}
            >
              조건 다시 선택
            </button>
          </div>
        )}

        {recommendError && (
          <p className="rounded bg-red-50 px-4 py-3 text-sm text-red-600">
            추천 견적을 가져오는 도중 오류가 발생했습니다.
          </p>
        )}

        {recommendation && inputsHidden && (
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">견적 요약</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {productList.map(({ key, label, product }) =>
                product ? (
                  <button
                    key={key}
                    type="button"
                    className="flex h-full w-full cursor-pointer flex-col items-start gap-2 rounded-lg border border-gray-200 p-4 text-left transition hover:border-primary hover:shadow"
                    onClick={() =>
                      window.open(`/product/${product.productId}`, '_blank', 'noopener')
                    }
                  >
                    <span className="text-xs font-semibold uppercase text-primary">
                      {label}
                    </span>
                    <span className="text-base font-medium">{product.name}</span>
                    <span className="text-sm text-gray-500">
                      {product.sellerUserName ?? '판매자 정보 없음'}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {formatPrice(product.price)}
                    </span>
                  </button>
                ) : (
                  <div
                    key={key}
                    className="flex h-full flex-col justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500"
                  >
                    <span className="font-semibold text-gray-600">{label}</span>
                    <span className="mt-2">해당 카테고리 상품이 포함되지 않았습니다.</span>
                  </div>
                ),
              )}
            </div>

            <footer className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 md:flex-row md:items-center md:justify-between">
              <Button
                variant="secondary"
                className="bg-gray-300 text-gray-900 hover:bg-gray-400"
                onClick={handleBenchmark}
                disabled={benchmarkLoading}
              >
                {benchmarkLoading ? '조회 중…' : '성능 확인'}
              </Button>

              <div className="text-center text-lg font-semibold text-gray-800">
                총 가격: {formatPrice(totalPrice)}
              </div>

              <Button onClick={handleAddCart} disabled={cartLoading}>
                {cartLoading ? '담는 중…' : '장바구니'}
              </Button>
            </footer>
          </section>
        )}
      </div>
    </Modal>
  );
}
