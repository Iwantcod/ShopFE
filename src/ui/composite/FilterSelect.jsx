// src/ui/composite/FilterSelect.jsx  —  판매량·가격·최신 정렬 선택 드롭다운
import PropTypes from 'prop-types';

const sorts = [
  { key: 'popular', label: '판매량순' },
  { key: 'latest', label: '최신순' },
  { key: 'lowest-price', label: '낮은 가격순' },
  { key: 'highest-price', label: '높은 가격순' },
];

export default function FilterSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border px-2 py-1"
    >
      {sorts.map((s) => (
        <option key={s.key} value={s.key}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
FilterSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
