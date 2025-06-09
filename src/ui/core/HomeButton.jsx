// src/ui/core/HomeButton.jsx
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';        // ← Feather Home 아이콘

export default function HomeButton() {
  return (
    <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80">
      <FiHome size={20} />                      {/* 집 아이콘 */}
      <span className="sr-only">홈으로</span>   {/* 접근성용 숨김 텍스트 */}
    </Link>
  );
}