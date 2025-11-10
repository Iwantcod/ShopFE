import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';

import Button from '../../ui/core/Button';
import { useMyProductsQuery } from '../../features/api/sellerApi';

const toNumber = (value) => Number(value ?? 0) || 0;

export default function SellerDashboardHome() {
  const { userId } = useSelector((s) => s.auth);
  const queryArg = userId ? { userId, offset: 0 } : skipToken;
  const {
    data: products = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useMyProductsQuery(queryArg);

  const summary = useMemo(() => {
    if (!products.length) {
      return {
        totalProducts: 0,
        totalInventory: 0,
        lowStockCount: 0,
        soldOut: 0,
        avgPrice: 0,
        totalVolume: 0,
      };
    }

    const totalProducts = products.length;
    const totalInventory = products.reduce((sum, p) => sum + toNumber(p.inventory), 0);
    const lowStockCount = products.filter((p) => toNumber(p.inventory) <= 5).length;
    const soldOut = products.filter((p) => toNumber(p.inventory) === 0).length;
    const totalVolume = products.reduce((sum, p) => sum + toNumber(p.volume), 0);
    const avgPrice = Math.round(
      products.reduce((sum, p) => sum + toNumber(p.price), 0) / totalProducts,
    );

    return {
      totalProducts,
      totalInventory,
      lowStockCount,
      soldOut,
      avgPrice,
      totalVolume,
    };
  }, [products]);

  const lowStockItems = useMemo(
    () =>
      products
        .filter((p) => toNumber(p.inventory) <= 5)
        .sort((a, b) => toNumber(a.inventory) - toNumber(b.inventory))
        .slice(0, 5),
    [products],
  );

  const recentProducts = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
        )
        .slice(0, 5),
    [products],
  );

  const bestSellers = useMemo(
    () =>
      products
        .filter((p) => toNumber(p.volume) > 0)
        .sort((a, b) => toNumber(b.volume) - toNumber(a.volume))
        .slice(0, 5),
    [products],
  );

  const busy = isLoading || isFetching;

  if (!userId) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
        판매자 정보를 확인할 수 없습니다. 다시 로그인해 주세요.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">판매자 대시보드</h1>
          <p className="text-sm text-gray-500">
            상품 현황과 재고를 한눈에 살피고 필요한 작업으로 이동하세요.
          </p>
        </div>
        <Link
          to="/seller/products/new"
          className="btn-primary inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium"
        >
          + 새 상품 등록
        </Link>
      </header>

      {isError && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>상품 정보를 불러오는 중 오류가 발생했습니다.</span>
          <Button variant="danger" size="sm" onClick={() => refetch?.()}>
            다시 시도
          </Button>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="등록된 상품"
          value={`${summary.totalProducts}개`}
          caption={`총 판매량 ${summary.totalVolume.toLocaleString()}건`}
        />
        <MetricCard
          title="총 재고"
          value={`${summary.totalInventory.toLocaleString()}개`}
          caption={`${summary.lowStockCount}건 긴급 재고`}
        />
        <MetricCard
          title="평균 판매가"
          value={`${summary.avgPrice.toLocaleString()}원`}
          caption="정가를 주기적으로 점검하세요."
        />
        <MetricCard
          title="품절 상품"
          value={`${summary.soldOut}개`}
          caption="품절 노출을 최소화하세요."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardPanel
          title="재고 부족 상품"
          description="재고가 5개 이하인 상품을 우선 보충하세요."
          actionLabel="상품 목록"
          actionTo="/seller/products"
          isLoading={busy}
        >
          {lowStockItems.length === 0 ? (
            <p className="text-sm text-gray-500">모든 상품이 충분한 재고를 보유하고 있습니다.</p>
          ) : (
            <ul className="divide-y">
              {lowStockItems.map((item) => (
                <li key={item.productId} className="flex items-center justify-between gap-4 py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      재고 {toNumber(item.inventory).toLocaleString()}개 · 가격{' '}
                      {toNumber(item.price).toLocaleString()}원
                    </p>
                  </div>
                  <Link
                    to={`/seller/products/${item.productId}/edit`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    재고 조정
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </DashboardPanel>

        <DashboardPanel
          title="최근 등록/수정 상품"
          description="가장 최근에 업데이트한 상품 5개입니다."
          actionLabel="전체 보기"
          actionTo="/seller/products"
          isLoading={busy}
        >
          {recentProducts.length === 0 ? (
            <p className="text-sm text-gray-500">아직 등록된 상품이 없습니다.</p>
          ) : (
            <ul className="divide-y">
              {recentProducts.map((item) => (
                <li key={item.productId} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(item.createdAt)} · {toNumber(item.price).toLocaleString()}원
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    재고 {toNumber(item.inventory).toLocaleString()}개
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardPanel>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardPanel
          title="판매량 상위 상품"
          description="판매량 기준 Top 5"
          actionLabel={bestSellers.length ? '상품 목록' : undefined}
          actionTo={bestSellers.length ? '/seller/products' : undefined}
          isLoading={busy}
        >
          {bestSellers.length === 0 ? (
            <p className="text-sm text-gray-500">판매량 데이터가 아직 없습니다.</p>
          ) : (
            <ul className="divide-y">
              {bestSellers.map((item, idx) => (
                <li key={item.productId} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-400">{idx + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        누적 판매 {toNumber(item.volume).toLocaleString()}건
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/seller/products/${item.productId}/edit`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    상세 보기
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </DashboardPanel>

        <DashboardPanel title="빠른 작업" description="자주 사용하는 관리 기능으로 이동하세요.">
          <div className="grid gap-3 md:grid-cols-2">
            <QuickAction
              title="상품 등록"
              description="새로운 상품을 업로드합니다."
              to="/seller/products/new"
            />
            <QuickAction
              title="상품 목록 관리"
              description="재고와 판매 상태를 점검하세요."
              to="/seller/products"
            />
            <QuickAction
              title="내 정보 관리"
              description="판매자 정보를 업데이트합니다."
              to="/mypage/seller"
            />
            <QuickAction
              title="주문 현황"
              description="주문 페이지에서 처리 단계 확인"
              to="/orders"
            />
          </div>
        </DashboardPanel>
      </section>
    </div>
  );
}

function MetricCard({ title, value, caption }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      {caption && <p className="mt-1 text-xs text-gray-400">{caption}</p>}
    </div>
  );
}

function DashboardPanel({ title, description, children, actionLabel, actionTo, isLoading }) {
  return (
    <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        {actionLabel && actionTo && (
          <Link to={actionTo} className="text-sm font-medium text-primary hover:underline">
            {actionLabel}
          </Link>
        )}
      </div>
      {isLoading ? (
        <p className="text-sm text-gray-500">데이터를 불러오는 중입니다…</p>
      ) : (
        children
      )}
    </section>
  );
}

function QuickAction({ title, description, to }) {
  return (
    <Link
      to={to}
      className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white"
    >
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </Link>
  );
}

const formatDate = (iso) => {
  if (!iso) return '날짜 미확인';
  try {
    return new Date(iso).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '날짜 미확인';
  }
};
