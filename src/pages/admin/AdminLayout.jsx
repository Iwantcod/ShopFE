// File: src/pages/admin/AdminLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';

import HomeButton from '../../ui/core/HomeButton';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 space-y-2 bg-gray-100 p-4 dark:bg-gray-900">
        <HomeButton />
        <NavLink to="/admin"               className="block hover:underline">대시보드</NavLink>
        <NavLink to="/admin/categories"    className="block hover:underline">카테고리</NavLink>
        <NavLink to="/admin/specs"         className="block hover:underline">모델 스펙</NavLink>
        <NavLink to="/admin/seller-approval" className="block hover:underline">판매자 승인</NavLink>
        <NavLink to="/admin/products"       className="block">상품 목록</NavLink> 
      </aside>
      <main className="flex-1 bg-white p-6 dark:bg-gray-800">
        <Outlet />
      </main>
    </div>
  );
}
