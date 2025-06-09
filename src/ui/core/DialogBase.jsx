// DialogBase.jsx – 모달 공통 레이아웃(제목/본문/푸터)
export default function DialogBase({ title, children, footer, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <header className="mb-4 flex justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </header>
        <section className="space-y-4">{children}</section>
        {footer && <footer className="mt-6 flex justify-end gap-2">{footer}</footer>}
      </div>
    </div>
  );
}
