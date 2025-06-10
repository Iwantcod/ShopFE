// ToastCenter.jsx – 화면 상단 중앙에 토스트 리스트 표시
import Button from '../core/Button';

export default function ToastCenter({ items }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white shadow ${
            t.type === 'error'
              ? 'bg-red-600'
              : t.type === 'success'
              ? 'bg-emerald-600'
              : 'bg-gray-800'
          }`}
        >
          <span>{t.msg}</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              items.splice(
                items.findIndex((x) => x.id === t.id),
                1,
              )
            }
          >
            닫기
          </Button>
        </div>
      ))}
    </div>
  );
}
