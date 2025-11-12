// src/ui/composite/ProductGrid.jsx  —  ProductCard 2~4열 그리드 + 로딩/빈 상태
import PropTypes from 'prop-types';

import ProductCard from '../core/ProductCard';

export default function ProductGrid({ items, isLoading }) {
  if (isLoading) return <div className="p-8 text-center">Loading…</div>;
  if (!items.length) return <div className="p-8 text-center">결과가 없습니다.</div>;

  const rows = Math.ceil(items.length / 5) || 0;
  const visibleRows = Math.min(rows, 2);
  const limitedItems = items.slice(0, visibleRows * 5);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {limitedItems.map((p) => (
        <ProductCard key={p.productId} p={p} />
      ))}
    </div>
  );
}
ProductGrid.propTypes = {
  items: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
};
