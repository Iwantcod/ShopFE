// src/ui/composite/Pagination.jsx — « ‹ 현재 › » 네비게이터 (API 호출용 onChange)
import PropTypes from 'prop-types';

/**
 * current   현재 페이지(0‑based)
 * maxPage   마지막 페이지(0‑based, Infinity 가능)
 * onChange  (page:number) → 부모 컴포넌트에서 URL 파라미터 & RTK Query 호출 담당
 * disabled  전체 버튼 비활성
 */
export default function Pagination({ current, maxPage = Infinity, onChange, disabled }) {
  /* page 범위를 0~maxPage 로 한정 */
  const clamp = (p) => Math.max(0, Math.min(maxPage, p));
  const go     = (p) => !disabled && onChange(clamp(p));

  /* Tailwind 버튼 공통 스타일 */
  const baseBtn   =
    'inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition';
  const hoverCls  = 'hover:bg-primary/10 hover:text-primary';
  const disableCls = 'disabled:opacity-30 disabled:pointer-events-none';

  return (
    <nav className="my-6 flex select-none items-center justify-center gap-2">
      {/* << 10 페이지 뒤로 */}
      <button
        className={`${baseBtn} ${hoverCls} ${disableCls}`}
        aria-label="10페이지 뒤로"
        onClick={() => go(current - 10)}
        disabled={disabled || current === 0}
      >
        «
      </button>

      {/* < 1 페이지 뒤로 */}
      <button
        className={`${baseBtn} ${hoverCls} ${disableCls}`}
        aria-label="1페이지 뒤로"
        onClick={() => go(current - 1)}
        disabled={disabled || current === 0}
      >
        ‹
      </button>

      {/* 현재 페이지 표시 */}
      <span className="inline-flex h-8 min-w-[40px] items-center justify-center rounded-lg bg-primary px-2 text-white">
        {current + 1}
      </span>

      {/* 1 페이지 앞으로 > */}
      <button
        className={`${baseBtn} ${hoverCls} ${disableCls}`}
        aria-label="1페이지 앞으로"
        onClick={() => go(current + 1)}
        disabled={disabled || current >= maxPage}
      >
        ›
      </button>

      {/* 10 페이지 앞으로 >> */}
      <button
        className={`${baseBtn} ${hoverCls} ${disableCls}`}
        aria-label="10페이지 앞으로"
        onClick={() => go(current + 10)}
        disabled={disabled || current >= maxPage}
      >
        »
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  current: PropTypes.number.isRequired,
  maxPage: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
