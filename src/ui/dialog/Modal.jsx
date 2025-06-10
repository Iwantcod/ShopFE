import { createPortal } from 'react-dom';

export default function Modal({ title, children, onClose }) {
  return createPortal(
    (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
          role="presentation"
        />

        {/* dialog */}
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </header>

          {children}
        </div>
      </div>
    ),
    document.body,
  );
}
