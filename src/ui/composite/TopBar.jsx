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
        className="text-left font-medium text-[#b18ce0] hover:text-[#cba3f1]"
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
      <header className="sticky top-0 z-40 border-b border-[rgba(223,200,173,0.4)] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-[#3d2f23]">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f2d9c5] via-[#f2c8a2] to-[#e7b17c] text-base">
              ⚡
            </span>
            <span className="hidden sm:inline">Moduix</span>
          </Link>

          {/* ---------- 데스크톱 네비 ---------- */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#5d4e42] md:flex">
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
            className="rounded-xl border border-white/20 p-2 text-xl text-white md:hidden"
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
              className="relative h-full w-64 border-l border-white/10 bg-slate-900/95 p-6 backdrop-blur"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="mb-8 flex items-center justify-between">
                <span className="text-lg font-semibold text-white">메뉴</span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-2xl leading-none text-white"
                  aria-label="메뉴 닫기"
                >
                  ×
                </button>
              </header>

              {/* 모바일 네비 */}
              <nav className="flex flex-col gap-4 text-sm text-slate-200">
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
