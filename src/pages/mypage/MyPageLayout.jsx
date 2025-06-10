// src/pages/mypage/MyPageLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function MyPageLayout() {
  const { role } = useSelector((s) => s.auth);

  /** absolute = '/mypage' | '/mypage/admin' …, endOnly = true ⇢ root 탭 */
  const tab = (to, label, endOnly = false) => (
    <NavLink
      to={to}
      end={endOnly}
      className={({ isActive }) =>
        `px-4 py-2 ${
          isActive
            ? 'border-b-2 border-primary font-semibold'
            : 'text-gray-500 hover:text-primary/70'
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <nav className="flex gap-4 border-b">
        {tab('/mypage',          '내 정보', true)}
        {role === 'SELLER' && tab('/mypage/seller', '판매자')}
        {role === 'ADMIN'  && tab('/mypage/admin',  '관리자')}
      </nav>

      <Outlet />
    </div>
  );
}
