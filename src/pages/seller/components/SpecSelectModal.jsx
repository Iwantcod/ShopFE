// SpecSelectModal.jsx — 선택한 카테고리의 모델 정보 리스트 모달
import { useLatestSpecsQuery } from '../../../features/api/specApi';
import Modal from '../../../ui/dialog/Modal';
import SkeletonTable from '../../../ui/composite/SkeletonTable';
import useToast from '../../../ui/feedback/useToast';

export default function SpecSelectModal({ category, onClose, onSelect }) {
  const toast = useToast();

  // 카테고리 미선택 상태는 상위에서 토스트 처리 후 모달을 열지 않으므로 null 반환
  if (!category) return null;

  // 최신 스펙 불러오기
  const {
    data: specs = [],
    isLoading,
    error,
  } = useLatestSpecsQuery({ category: category.toLowerCase(), offset: 0 });

  const pickId = (row) => row.productSpecId ?? row.id; // API 필드 호환

  return (
    <Modal title="모델 정보" onClose={onClose}>
      {isLoading ? (
        <SkeletonTable rows={6} />
      ) : error ? (
        <p className="p-4 text-center text-sm text-red-500">목록을 불러오지 못했습니다.</p>
      ) : (
        <ul>
          {specs.map((s) => {
            const sid = pickId(s);
            return (
              <li key={sid}>
                <button
                  type="button"
                  onClick={() => onSelect({ id: sid, cat: category.toLowerCase(), name: s.modelName })}
                  className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                >
                  {s.modelName ?? '(모델명 없음)'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
