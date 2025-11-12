// src/ui/core/ProductCard.jsx  —  상품 썸네일·제목·가격·판매자 표시 카드
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import getImageUrl from '../../lib/getImageUrl';

export default function ProductCard({ p }) {
  return (
    <Link
      to={`/product/${p.productId}`}
      className="flex flex-col gap-2 rounded-md border border-[rgba(223,200,173,0.6)] bg-white/90 p-4 hover:border-[#d8a170]"
    >
      <img
        src={getImageUrl(p.productImageUrl)}
        alt={p.name}
        className="aspect-square w-full object-cover"
      />
      <h3 className="truncate text-sm font-medium">{p.name}</h3>
      <p className="text-xs text-gray-500">{p.sellerUserName}</p>
      <p className="mt-auto text-right font-semibold">
        {p.price.toLocaleString()}원
      </p>
    </Link>
  );
}
ProductCard.propTypes = {
  p: PropTypes.shape({
    productId: PropTypes.number,
    productImageUrl: PropTypes.string,
    name: PropTypes.string,
    sellerUserName: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
};
