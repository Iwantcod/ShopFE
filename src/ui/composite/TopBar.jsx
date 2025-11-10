// src/ui/composite/TopBar.jsx
// 반응형 헤더: 로고 · 네비 · 로그인/로그아웃 · 모바일 Drawer + “마이페이지” 링크
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';

import Button from '../core/Button';
import { logout } from '../../features/auth/authService';
import CustomEstimateModal from '../../components/CustomEstimateModal';

export default function TopBar() {
  const { role } = useSelector((s) => s.auth);         // null | USER | SELLER | ADMIN
  const [open, setOpen] = useState(false);
  const [estimateOpen, setEstimateOpen] = useState(false);
  const navigate = useNavigate();

  const openEstimateModal = () => {
    if (!role) {
      navigate('/auth/login');
      return;
    }
    setEstimateOpen(true);
  };

  const renderCommonLinks = (onNavigate) => (
    <>
      <button
        type="button"
        onClick={() => {
          if (onNavigate) onNavigate();
          openEstimateModal();
        }}
        className="text-left font-medium hover:underline"
      >
        맞춤 견적
      </button>
      <Link to="/cart" onClick={onNavigate}>
        장바구니
      </Link>
      <Link to="/orders" onClick={onNavigate}>
        주문내역
      </Link>
      {/* ✅ 로그인 상태일 때만 마이페이지 노출 */}
      {role && (
        <Link to="/mypage" onClick={onNavigate}>
          마이페이지
        </Link>
      )}
    </>
  );

  /* ---------------- 권한별 링크 ---------------- */
  const extraLink =
    role === 'SELLER' ? (
      <Link to="/seller" onClick={() => setOpen(false)}>
        판매 관리
      </Link>
    ) : role === 'ADMIN' ? (
      <Link to="/admin" onClick={() => setOpen(false)}>
        관리자
      </Link>
    ) : null;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white ring-1 ring-stone-100">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4">
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-1 font-bold">
            🖥️ <span className="hidden sm:inline">Shop</span>
          </Link>

          {/* ---------- 데스크톱 네비 ---------- */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {renderCommonLinks()}
            {extraLink}
          </nav>

          {/* ---------- 로그인 / 로그아웃 버튼 ---------- */}
          <div className="hidden md:block">
            {role ? (
              <Button size="sm" variant="secondary" onClick={logout}>
                로그아웃
              </Button>
            ) : (
              <Link to="/auth/login">
                <Button size="sm">로그인</Button>
              </Link>
            )}
          </div>

          {/* ---------- 모바일 버거 아이콘 ---------- */}
          <button
            onClick={() => setOpen(true)}
            className="rounded p-2 text-xl md:hidden"
            aria-label="메뉴 열기"
          >
            ☰
          </button>
        </div>

        {/* ---------- 모바일 Drawer ---------- */}
        {open && (
          <div
            className="fixed inset-0 z-50 md:hidden"
            aria-modal="true"
            role="dialog"
            onClick={() => setOpen(false)}
          >
            {/* 반투명 배경 */}
            <div className="absolute inset-0 bg-black/60" />

            {/* 사이드 패널 */}
            <aside
              className="relative h-full w-64 bg-white p-6 dark:bg-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="mb-8 flex items-center justify-between">
                <span className="text-lg font-semibold">메뉴</span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-2xl leading-none"
                  aria-label="메뉴 닫기"
                >
                  ×
                </button>
              </header>

              {/* 모바일 네비 */}
              <nav className="flex flex-col gap-4 text-sm">
                {renderCommonLinks(() => setOpen(false))}
                {extraLink}
              </nav>

              {/* 모바일 로그인/로그아웃 버튼 */}
              <div className="mt-8">
                {role ? (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                  >
                    로그아웃
                  </Button>
                ) : (
                  <Link to="/auth/login" onClick={() => setOpen(false)}>
                    <Button className="w-full">로그인</Button>
                  </Link>
                )}
              </div>
            </aside>
          </div>
        )}
      </header>
      {estimateOpen && (
        <CustomEstimateModal onClose={() => setEstimateOpen(false)} />
      )}
    </>
  );
}
