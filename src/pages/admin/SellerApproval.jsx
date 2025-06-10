// src/pages/admin/SellerApproval.jsx
import {
  useSellerApprovalListQuery,
  useApproveSellerMutation,
  useDisapproveSellerMutation,
} from '../../features/api/adminApi';
import DataTable from '../../ui/composite/DataTable';
import Pagination from '../../ui/composite/Pagination';
import useToast from '../../ui/feedback/useToast';

export default function SellerApproval() {
  const toast = useToast();
  const [page, setPage] = useState(0);
  const { data = [] } = useSellerApprovalListQuery({ page });
  const [approveSeller] = useApproveSellerMutation();
  const [disapproveSeller] = useDisapproveSellerMutation();

  const columns = [
    { key: 'businessId', header: 'ID' },
    { key: 'businessName', header: '상호명' },
    { key: 'businessNumber', header: '사업자번호' },
    { key: 'bankName', header: '은행' },
    { key: 'bankAccount', header: '계좌' },
  ];

  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">판매자 권한 승인 대기</h2>
      <DataTable
        columns={columns}
        data={data}
        onEdit={async (row) => {
          try {
            await approveSeller(row.userId).unwrap();
            toast.success('승인 완료');
          } catch {
            toast.error('승인 실패');
          }
        }}
        onDelete={async (row) => {
          try {
            await disapproveSeller(row.userId).unwrap();
            toast.success('권한 회수 완료');
          } catch {
            toast.error('권한 회수 실패');
          }
        }}
      />
      <Pagination page={page} onChange={setPage} disabled={data.length < 10} />
    </>
  );
}
