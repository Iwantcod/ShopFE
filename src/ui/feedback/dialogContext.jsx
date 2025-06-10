// dialogContext.jsx – 전역 모달(Dialog) 관리 컨텍스트·훅
import { createContext, useContext, useState } from 'react';

const DialogCtx = createContext();

/** useDialog: { open(<JSX>), close() } 반환 */
export function useDialog() {
  return useContext(DialogCtx);
}

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const value = {
    open: (node) => setDialog(node),
    close: () => setDialog(null),
  };

  return (
    <DialogCtx.Provider value={value}>
      {children}
      {dialog}
    </DialogCtx.Provider>
  );
}
