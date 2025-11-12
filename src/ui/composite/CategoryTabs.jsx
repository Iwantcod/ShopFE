// src/ui/composite/CategoryTabs.jsx  —  카테고리 버튼 리스트(8개)·선택 상태 관리
import PropTypes from 'prop-types';

// src/ui/composite/CategoryTabs.jsx — 8개 카테고리 버튼
import { CATEGORIES } from '../../constants/categories';

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="flex justify-center gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((c) => (
        <button
          key={c.key}
          onClick={() => onChange(c.key)}
          className={
            'rounded px-3 py-1 text-sm transition ' +
            (active === c.key
              ? 'bg-[#f4cfa7] text-[#4a3425]'
              : 'bg-white/70 text-[#6d5a4c] hover:bg-[#f8efe3]')
          }
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
CategoryTabs.propTypes = {
  active: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
