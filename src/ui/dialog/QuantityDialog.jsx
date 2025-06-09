// QuantityDialog.jsx — 수량 선택 모달(Headless UI Dialog 대신 간단 자체 구현)
import { useState } from 'react';
import PropTypes from 'prop-types';

export default function QuantityDialog({ onClose, onConfirm }) {
  const [qty, setQty] = useState(1);

  /* 숫자 1 이상만 입력 허용 */
  const changeQty = (e) => setQty(Math.max(1, Number(e.target.value)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[320px] space-y-4 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold">수량 선택</h3>

        <input
          type="number"
          min={1}
          value={qty}
          onChange={changeQty}
          className="w-full rounded border px-3 py-2"
        />

        <div className="flex justify-end gap-2">
          <button
            className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-200"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="rounded bg-primary px-4 py-2 text-white"
            onClick={() => onConfirm(qty)}
          >
            담기
          </button>
        </div>
      </div>
    </div>
  );
}

QuantityDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
