// dialogContext.test.jsx – open/close 동작 테스트
import { renderHook, act } from '@testing-library/react';
import { DialogProvider, useDialog } from './dialogContext';

test('open & close dialog', () => {
  const wrapper = ({ children }) => <DialogProvider>{children}</DialogProvider>;
  const { result } = renderHook(() => useDialog(), { wrapper });

  act(() => result.current.open(<div>모달</div>));
  expect(document.body.textContent).toMatch('모달');

  act(() => result.current.close());
  expect(document.body.textContent).not.toMatch('모달');
});
