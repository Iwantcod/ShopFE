// src/ui/feedback/useToast.js  — ToastContext 헬퍼 훅 (re-export)
import { useContext } from 'react';

import { ToastCtx } from './toastContext';   // 이미 존재하는 Provider

/** 컴포넌트 내부에서 toast.push(msg, type?) 를 호출하기 위한 헬퍼 */
export default function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('ToastProvider 안에서만 사용하세요.');
  return ctx;
}
