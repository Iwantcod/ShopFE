// src/components/BenchmarkResultModal.jsx
import PropTypes from 'prop-types';

import Modal from '../ui/dialog/Modal';
import { useGetBenchMarkQuery } from '../features/api/benchmarkApi';

/**
 * 벤치마크 결과 모달
 * @param {object} props
 * @param {number} props.cpuSpecId
 * @param {number} props.graphicSpecId
 * @param {() => void} props.onClose
 */
export default function BenchmarkResultModal({ cpuSpecId, graphicSpecId, onClose }) {
  const { data, error, isLoading } = useGetBenchMarkQuery({ cpuSpecId, graphicSpecId });

  return (
    <Modal title="벤치마크 결과" onClose={onClose}>
      {isLoading && <p className="p-4 text-center">로딩 중...</p>}
      {error && (
        <p className="p-4 text-center text-red-500">결과를 불러오지 못했습니다.</p>
      )}
      {data && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b font-medium">
              <th className="py-2 text-left">항목</th>
              <th className="py-2 text-right">값</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-1">CPU 모델명</td>
              <td className="py-1 text-right">{data.cpuModelName}</td>
            </tr>
            <tr className="border-b">
              <td className="py-1">GPU 모델명</td>
              <td className="py-1 text-right">{data.graphicModelName}</td>
            </tr>
            <tr className="border-b">
              <td className="py-1">평균 FPS 1</td>
              <td className="py-1 text-right">{data.avgFrame1}</td>
            </tr>
            <tr className="border-b">
              <td className="py-1">평균 FPS 2</td>
              <td className="py-1 text-right">{data.avgFrame2}</td>
            </tr>
            <tr>
              <td className="py-1">평균 FPS 3</td>
              <td className="py-1 text-right">{data.avgFrame3}</td>
            </tr>
          </tbody>
        </table>
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
