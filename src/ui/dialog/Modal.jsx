import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({
  title,
  children,
  onClose,
  className = 'relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg',
}) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return createPortal(
    (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
          role="presentation"
        />

        {/* dialog */}
        <div className={`${className} max-h-[90vh] overflow-y-auto`}>
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
