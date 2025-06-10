import { render, fireEvent } from '@testing-library/react';
import PaginationControls from './PaginationControls';

test('<< 버튼은 10 페이지 감소', () => {
  const spy = vi.fn();
  const { getByText } = render(
    <PaginationControls page={15} maxPage={20} onChange={spy} />,
  );
  fireEvent.click(getByText('«'));
  expect(spy).toHaveBeenCalledWith(5);
});
