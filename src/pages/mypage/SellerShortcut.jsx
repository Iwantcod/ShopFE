// src/pages/mypage/SellerShortcut.jsx
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

export default function SellerShortcut() {
  return (
    <div className="p-8 text-center">
      {/* 절대 경로 → /seller 대시보드 */}
      <Link
        to="/seller"
        className="inline-flex items-center gap-1 text-primary hover:text-primary/80"
      >
        <FiHome /> 판매자 대시보드로 이동
      </Link>
    </div>
  );
}
