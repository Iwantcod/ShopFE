// PaginationControls.jsx – <, >, <<, >> 버튼·페이지 표시
import Button from '../core/Button';

export default function PaginationControls({
  page,
  maxPage,
  onChange,
  className = '',
}) {
  const first = page <= 1;
  const last = page >= maxPage;

  const jump = (delta) => () => onChange(page + delta);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button size="sm" disabled={first} onClick={jump(-10)}>
        «
      </Button>
      <Button size="sm" disabled={first} onClick={jump(-1)}>
        ‹
      </Button>
      <span className="w-10 text-center tabular-nums">
        {page} / {maxPage}
      </span>
      <Button size="sm" disabled={last} onClick={jump(1)}>
        ›
      </Button>
      <Button size="sm" disabled={last} onClick={jump(10)}>
        »
      </Button>
    </div>
  );
}
