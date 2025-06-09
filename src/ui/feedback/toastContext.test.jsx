// toastContext.test.js – push → 토스트 생기는지
import { renderHook, act } from '@testing-library/react';
import { ToastProvider, useToast } from './toastContext.jsx';

test('push adds toast', () => {
  const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>;
  const { result } = renderHook(() => useToast(), { wrapper });

  act(() => result.current.push('hi', 'info', 10));
  expect(document.body.textContent).toMatch('hi');
});
