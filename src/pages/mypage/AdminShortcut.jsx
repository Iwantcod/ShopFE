// src/pages/mypage/AdminShortcut.jsx
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';

export default function AdminShortcut() {
  return (
    <div className="p-8 text-center">
      {/* 절대 경로 → /admin 대시보드 */}
      <Link
        to="/admin"
        className="inline-flex items-center gap-1 text-primary hover:text-primary/80"
      >
        <FiUser /> 관리자 대시보드로 이동
      </Link>
    </div>
  );
}
