// src/pages/admin/AdminDashboardHome.jsx
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useAllCategoriesQuery, useAllProductsQuery } from '../../features/api/adminApi';
import StatCard from '../../ui/admin/StatCard';
import RecentProducts from '../../components/admin/RecentProducts';

export default function AdminDashboardHome() {
  const { data: categories = [], isLoading: categoriesLoading } = useAllCategoriesQuery();
  const {
    data: products = [],
    isLoading: productsLoading,
  } = useAllProductsQuery(0);

  const stats = [
    {
      title: '카테고리 수',
      value: categoriesLoading ? '불러오는 중…' : categories.length,
      caption: '카테고리를 관리하세요',
      to: '/admin/categories',
    },
    {
      title: '최근 상품',
      value: products.length ? `${products.length}개 로드됨` : '데이터 없음',
      caption: '전체 목록 보기',
      to: '/admin/products',
    },
    {
      title: '모델 스펙',
      value: '카테고리별 관리',
      caption: '카테고리 선택 후 등록',
      to: '/admin/specs',
    },
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">관리자 대시보드</h1>
        <p className="text-sm text-gray-500">
          핵심 정보를 빠르게 확인하고, 필요한 관리 기능으로 이동하세요.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">최근 등록된 상품</h2>
          <Link to="/admin/products" className="text-sm text-primary hover:underline">
            전체 보기
          </Link>
        </div>
        {productsLoading || categoriesLoading ? (
          <p className="text-sm text-gray-500">상품 정보를 불러오는 중입니다…</p>
        ) : (
          <RecentProducts items={products.slice(0, 5)} />
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">빠른 작업</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <QuickAction
            title="카테고리 추가"
            description="새 카테고리를 생성합니다."
            to="/admin/categories"
          />
          <QuickAction
            title="모델 스펙 등록"
            description="카테고리별 스펙 정보를 관리하세요."
            to="/admin/specs"
          />
          <QuickAction
            title="상품 목록 관리"
            description="상품을 확인하고 OFF 처리할 수 있습니다."
            to="/admin/products"
          />
        </div>
      </section>
    </div>
  );
}

function QuickAction({ title, description, to }) {
  return (
    <Link
      to={to}
      className="rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5"
    >
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  );
}

QuickAction.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};
