import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function RecentProducts({ items }) {
  if (!items.length) {
    return <p className="text-sm text-gray-500">상품 정보가 없습니다.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
          <tr>
            <th className="px-4 py-2">상품명</th>
            <th className="px-4 py-2 text-right">가격</th>
            <th className="px-4 py-2">등록일</th>
          </tr>
        </thead>
        <tbody>
          {items.map((product) => (
            <tr key={product.productId} className="border-t">
              <td className="px-4 py-2">
                <Link to={`/product/${product.productId}`} className="text-primary hover:underline">
                  {product.name}
                </Link>
              </td>
              <td className="px-4 py-2 text-right">{product.price.toLocaleString()}원</td>
              <td className="px-4 py-2 text-gray-500">{product.createdAt ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

RecentProducts.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      createdAt: PropTypes.string,
    }),
  ).isRequired,
};
