// src/pages/seller/ProductTable.jsx
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';     

import SkeletonTable from '../../ui/composite/SkeletonTable';
import DataTable from '../../ui/composite/DataTable';
import { useMyProductsQuery } from '../../features/api/sellerApi';
import { useOffProductMutation }   from '../../features/api/sellerApi';
import Pagination from '../../ui/composite/Pagination';

export default function ProductTable() {
  const { userId } = useSelector((s) => s.auth);
  const [page, setPage] = useState(0);
  const { data = [], isLoading } = useMyProductsQuery({ userId, page });
  const [offProduct] = useOffProductMutation();

  const columns = [
    { key: 'productId', header: 'ID' },
    { key: 'name', header: '상품명' },
    { key: 'price', header: '가격', render: (r) => r.price.toLocaleString() + '원' },
    { key: 'inventory', header: '재고' },
    { key: 'volume', header: '판매량' },
    { key: 'createdAt', header: '등록일' },
  ];

  if (isLoading) return <SkeletonTable rows={10} />;

  return (
    <>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-semibold">내 상품 목록</h2>
        <Link to="new" className="btn-primary">+ 새 상품</Link>
      </div>
      <DataTable
        columns={columns}
        data={data}
        onEdit={(row) => navigate(`${row.productId}/edit`)}
        onDelete={(row) => offProduct(row.productId)}
      />
      <Pagination page={page} onChange={setPage} disabled={data.length < 10} />
    </>
  );
}
