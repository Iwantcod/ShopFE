// ProductListPage.jsx — currentData 기반 404 처리
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';

import { useListQuery } from '../features/api/productApi';
import CategoryTabs  from '../ui/composite/CategoryTabs';
import FilterSelect  from '../ui/composite/FilterSelect';
import ProductGrid   from '../ui/composite/ProductGrid';
import Pagination    from '../ui/composite/Pagination';

export default function ProductListPage() {
  const { category = 'cpu' } = useParams();
  const [qs, setQs] = useSearchParams();
  const sort = qs.get('sort') ?? 'popular';
  const page = Number(qs.get('page') ?? 0);

  /* -------- 쿼리 -------- */
  const {
    currentData,          // ★ 이번 요청이 성공하면 배열, 실패·로딩이면 undefined
    error,
    isFetching,
  } = useListQuery(category ? { category, sort, offset: page } : skipToken);

  const is404 = error && (error.status ?? error.originalStatus) === 404;
  const showLastMsg = !isFetching && is404;            // 404 확정
  const items = currentData ?? [];                     // 실패 땐 빈 배열

  /* -------- 네비게이션 -------- */
  const nav  = useNavigate();
  const toCat = (c)=>nav(`/products/${c}?sort=${sort}&page=0`,{replace:true});
  const toSort=(s)=>setQs({sort:s,page:0});
  const toPage=(p)=>setQs({sort,page:p});

  return (
    <section className="space-y-6">
      <CategoryTabs active={category} onChange={toCat} />

      <div className="flex justify-end">
        <FilterSelect value={sort} onChange={toSort} />
      </div>

      {showLastMsg ? (
        <div className="py-24 text-center text-gray-500">마지막 페이지입니다.</div>
      ) : (
        <ProductGrid items={items} isLoading={isFetching} />
      )}

      <Pagination
        current={page}
        maxPage={showLastMsg ? page : Infinity}      // page 자체를 끝으로 고정
        onChange={toPage}
        disabled={isFetching || showLastMsg}         // ›, » 영구 잠금
      />
    </section>
  );
}
