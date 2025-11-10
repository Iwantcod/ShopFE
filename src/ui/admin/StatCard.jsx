// StatCard.jsx – 관리자 대시보드에서 사용하는 간단한 카드
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function StatCard({ title, value, caption, to }) {
  const content = (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      {caption && <p className="mt-1 text-xs text-gray-500">{caption}</p>}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block transition hover:-translate-y-0.5">
        {content}
      </Link>
    );
  }

  return content;
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  caption: PropTypes.string,
  to: PropTypes.string,
};
