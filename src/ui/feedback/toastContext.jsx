// toastContext.jsx – Toast 전역 상태·훅 제공
import { createContext, useContext, useState } from 'react';

import ToastCenter from './ToastCenter'; 
export const ToastCtx = createContext(null);  

/** Toast 호출용 커스텀 훅 */
export function useToast() {
  return useContext(ToastCtx); // { push(info|error), success, error }
}

/** Provider – 최상위(App)에서 감싸기 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /** 공통 추가 함수 */
  function push(msg, type = 'info', ms = 3000) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);

    // n초 후 자동 제거
    window.setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      ms,
    );
  }

  const ctx = {
    push,
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error', 4000),
  };

  return (
    <ToastCtx.Provider value={ctx}>
      {children}
      <ToastCenter items={toasts} />
    </ToastCtx.Provider>
  );
}
