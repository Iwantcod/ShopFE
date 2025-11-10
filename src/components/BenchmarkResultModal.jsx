import PropTypes from 'prop-types';

import Modal from '../ui/dialog/Modal';
import { useGetBenchMarkQuery } from '../features/api/benchmarkApi';
import { openBenchmarkWindow } from '../lib/openBenchmarkWindow';

/**
 * 벤치마크 결과 모달
 * @param {object} props
 * @param {number} props.cpuSpecId
 * @param {number} props.graphicSpecId
 * @param {() => void} props.onClose
 */
export default function BenchmarkResultModal({ cpuSpecId, graphicSpecId, onClose }) {
  const { data, error, isLoading } = useGetBenchMarkQuery({ cpuSpecId, graphicSpecId });

  if (data) {
    openBenchmarkWindow(data);
  }

  return (
    <Modal title="벤치마크 결과" onClose={onClose}>
      {isLoading && <p className="p-4 text-center">로딩 중...</p>}
      {error && (
        <p className="p-4 text-center text-red-500">결과를 불러오지 못했습니다.</p>
      )}
      {data && (
        <div className="p-4 text-center text-sm text-gray-600">
          새 창에서 벤치마크 결과를 확인하세요.
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <button
          className="rounded bg-primary px-4 py-2 text-white"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </Modal>
  );
}

BenchmarkResultModal.propTypes = {
  cpuSpecId: PropTypes.number.isRequired,
  graphicSpecId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};
