// SpecDetailModal.jsx — 스펙 상세 모달
import Modal from '../../../ui/dialog/Modal';
import { useSpecByIdQuery } from '../../../features/api/specApi';
import SkeletonTable from '../../../ui/composite/SkeletonTable';

import { LABELS } from './specLabels';

function buildRows(detail, category) {
  if (!detail) return [];
  const rows = [
    ['모델명', detail.modelName],
    ['제조사', detail.manufacturer],
  ];
  const extra = LABELS[category] || {};
  Object.entries(extra).forEach(([k, l]) => {
    if (detail[k] != null) rows.push([l, detail[k]]);
  });
  return rows;
}

export default function SpecDetailModal({ category, specId, onClose, onConfirm }) {
  const cat = category?.toLowerCase();
  const skip = !cat || !specId;

  const { data, isLoading, error } = useSpecByIdQuery(
    { category: cat, id: specId },
    { skip },
  );

  const rows = buildRows(data, cat);

  return (
    <Modal title="스펙 상세" onClose={onClose}>
      {isLoading ? (
        <SkeletonTable rows={4} />
      ) : error || rows.length === 0 ? (
        <p className="p-4 text-center text-sm text-red-500">데이터를 불러오지 못했습니다.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.map(([label, val]) => (
              <tr key={label} className="border-b last:border-none">
                <th className="w-40 py-1 font-medium text-gray-600">{label}</th>
                <td className="whitespace-pre-wrap break-all py-1">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button className="btn-secondary" onClick={onClose}>취소</button>
        <button className="btn-primary" onClick={() => onConfirm({id: specId, name: data?.modelName})}>선택</button>
      </div>
    </Modal>
  );
}
