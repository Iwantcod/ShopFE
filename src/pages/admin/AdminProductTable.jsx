// src/pages/admin/AdminProductTable.jsx
import { useState } from 'react';

import DataTable      from '../../ui/composite/DataTable';
import Pagination     from '../../ui/composite/Pagination';
import SkeletonTable  from '../../ui/composite/SkeletonTable';
import useToast   from '../../ui/feedback/useToast';
import {
  useAllProductsQuery,
  useDeleteProductMutation,
} from '../../features/api/adminApi';

export default function AdminProductTable() {
  const toast = useToast();
  const [page, setPage] = useState(0);

  /* 전체‧최신순 상품 10개 페이징 */
const {
    data: products = [],
    isLoading,
    isError,
  } = useAllProductsQuery(page * 10);

  const [deleteProduct] = useDeleteProductMutation();

  const columns = [
    { key: 'productId', header: 'ID' },
    { key: 'name',      header: '상품명' },
    { key: 'price',     header: '가격', render: (r) => r.price.toLocaleString() + '원' },
    { key: 'inventory', header: '재고' },
    { key: 'volume',    header: '판매량' },
    { key: 'createdAt', header: '등록일' },
  ];

  if (isLoading) return <SkeletonTable rows={10} />;

  const list = Array.isArray(products.items) ? products.items : products;
  const hasNext = Array.isArray(list) && list.length === 10;
  const maxPage = hasNext ? Infinity : page;

  return (
    <>
      <h1 className="mb-4 text-xl font-semibold">전체 상품 목록</h1>

      {/* 업로드 버튼 제거 – 관리자 업로드 불가 */}

      <DataTable
        columns={columns}
        data={list}
        /* 수정 아이콘 X, 삭제만 가능 */
        onDelete={async (row) => {
          try {
            await deleteProduct(row.productId).unwrap();
            toast.success('삭제 완료');
          } catch {
            toast.error('삭제 실패');
          }
        }}
      />

      <Pagination current={page} maxPage={maxPage} onChange={setPage} disabled={false} />
    </>
  );
}
