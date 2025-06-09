// src/ui/composite/ReviewSection.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  useReviewListQuery,
  useAddReviewMutation,
  useWritePermissionQuery,
} from '../../features/api/reviewApi';
import Button     from '../core/Button';

import Pagination from './Pagination';

const fmt = (iso) =>
  new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });

export default function ReviewSection({ productId }) {
  const [page, setPage]           = useState(0);
  const [newComment, setComment]  = useState('');
  const { data: canWrite }        = useWritePermissionQuery(productId);
  const [addReview, { isLoading }] = useAddReviewMutation();

  const {
    currentData: reviews = [],
    error,
    isFetching,
  } = useReviewListQuery({ productId, offset: page });

  const is404    = error && (error.status ?? error.originalStatus) === 404;
  const showLast = !isFetching && is404;

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await addReview({ productId, comment: newComment.trim() }).unwrap();
      setComment('');
      setPage(0);
    } catch {
      // 에러 처리 (toast 등)
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">리뷰</h2>

      {showLast ? (
        <div className="py-8 text-center text-gray-500">
          마지막 페이지입니다.
        </div>
      ) : (
        reviews.map((r) => (
          <article key={r.reviewId} className="rounded border p-3">
            <header className="mb-1 text-sm font-medium text-gray-600">
              {r.username} · {fmt(r.createdAt)}
            </header>
            <p>{r.comment}</p>
          </article>
        ))
      )}

      <Pagination
        current={page}
        maxPage={showLast ? page : Infinity}
        onChange={setPage}
        disabled={isFetching || showLast}
      />

      {canWrite ? (
        <div className="mt-4 space-y-2">
          <textarea
            rows={3}
            className="w-full rounded border p-2 focus:outline-none focus:ring"
            placeholder="리뷰를 작성하세요..."
            value={newComment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !newComment.trim()}
          >
            {isLoading ? '등록 중...' : '리뷰 등록'}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          리뷰 작성 권한이 없습니다.
        </p>
      )}
    </section>
  );
}

ReviewSection.propTypes = {
  productId: PropTypes.string.isRequired,
};
