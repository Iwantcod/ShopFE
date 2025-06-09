// File: src/pages/seller/SellerLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';

import HomeButton from '../../ui/core/HomeButton';

/** 판매자 영역 공통 레이아웃 – 사이드바 + Outlet */
export default function SellerLayout() {
  return (
    <div className="flex min-h-screen">
      {/* ───────── Left Sidebar ───────── */}
      <aside className="w-52 space-y-2 bg-gray-100 p-4 dark:bg-gray-900">
        <HomeButton />
        <NavLink to="/seller"          className="block hover:underline">대시보드</NavLink>
        <NavLink to="/seller/products" className="block hover:underline">상품 목록</NavLink>
      </aside>

      {/* ───────── Main Content ───────── */}
      <main className="flex-1 bg-white p-6 dark:bg-gray-800">
        <Outlet />
      </main>
    </div>
  );
}
