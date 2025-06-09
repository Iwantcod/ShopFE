// src/components/BenchmarkSelectModal.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

import Modal from '../ui/dialog/Modal';
import { useGetProductByIdQuery } from '../features/api/productApi';
import { useAllCategoriesQuery } from '../features/api/categoryApi';

/**
 * BenchmarkSelectModal
 * @param {object} props
 * @param {Array<{ productId: number, productName: string, categoryId: number }>} props.items
 * @param {() => void} props.onClose
 * @param {(cpuSpecId: number, graphicSpecId: number) => void} props.onConfirm
 */
export default function BenchmarkSelectModal({ items, onClose, onConfirm }) {
  const [activeTab, setActiveTab] = useState('cpu');
  const [selectedCpu, setSelectedCpu] = useState(null);
  const [selectedGpu, setSelectedGpu] = useState(null);

  // 모든 카테고리 데이터 조회
  const { data: categories = [] } = useAllCategoriesQuery();

  // 각 아이템에 대해 product.logicalFK과 categoryName 매핑
  const details = items.map((item) => {
    const { data: prod } = useGetProductByIdQuery(item.productId);
    const category = categories.find((c) => c.categoryId === item.categoryId);
    return {
      productId: item.productId,
      productName: item.productName,
      categoryName: category?.categoryName?.toLowerCase(),
      specId: prod?.logicalFK,
    };
  });

  const cpuOptions = details.filter((d) => d.categoryName === 'cpu');
  const gpuOptions = details.filter((d) => d.categoryName === 'graphic');
  const options = activeTab === 'cpu' ? cpuOptions : gpuOptions;

  const handleConfirm = () => {
    if (selectedCpu && selectedGpu) onConfirm(selectedCpu, selectedGpu);
  };

  return (
    <Modal title="벤치마크 스펙 선택" onClose={onClose}>
      {/* 탭 */}
      <div className="mb-4 flex gap-4 border-b">
        <button
          className={`flex-1 py-2 ${activeTab === 'cpu' ? 'border-b-2 border-primary font-semibold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('cpu')}
        >
          CPU
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === 'gpu' ? 'border-b-2 border-primary font-semibold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('gpu')}
        >
          GPU
        </button>
      </div>

      {/* 옵션 리스트 */}
      <ul className="mb-4 max-h-60 space-y-2 overflow-auto">
        {options.map((opt) => (
          <li key={opt.specId}>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={activeTab}
                value={opt.specId}
                checked={(activeTab === 'cpu' ? selectedCpu : selectedGpu) === opt.specId}
                onChange={() => {
                  if (activeTab === 'cpu') setSelectedCpu(opt.specId);
                  else setSelectedGpu(opt.specId);
                }}
              />
              <span>{opt.productName}</span>
            </label>
          </li>
        ))}
      </ul>

      {/* 확인 버튼 */}
      <div className="flex justify-end">
        <button
          type="button"
          className="rounded bg-primary px-4 py-2 text-white disabled:opacity-40"
          disabled={!selectedCpu || !selectedGpu}
          onClick={handleConfirm}
        >
          확인
        </button>
      </div>
    </Modal>
  );
}

BenchmarkSelectModal.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.number.isRequired,
      productName: PropTypes.string.isRequired,
      categoryId: PropTypes.number.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
