// src/pages/mypage/MyInfoPage.jsx
import { Link } from 'react-router-dom';

import { useMyInfoQuery } from '../../features/api/userApi';

export default function MyInfoPage() {
  const { data: me, isFetching } = useMyInfoQuery();
  if (isFetching) return <p className="p-8 text-center">Loading…</p>;
  if (!me)        return <p className="p-8 text-center">정보를 가져올 수 없습니다.</p>;

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">내 정보</h2>
      <div className="space-y-1 rounded border p-4">
        <p><strong>유저네임:</strong> {me.username}</p>
        <p><strong>이메일:</strong> {me.email}</p>
        <p><strong>등급:</strong> {me.role}</p>
      </div>

      <h3 className="mt-6 text-lg font-semibold">기본 배송지 · 연락처</h3>
      <div className="space-y-1">
        <p><strong>받는 이:</strong> {me.name ?? <span className="text-gray-400">미등록</span>}</p>
        <p><strong>주소:</strong> {me.address ?? <span className="text-gray-400">미등록</span>}</p>
        <p><strong>상세 주소:</strong> {me.addressDetail ?? <span className="text-gray-400">미등록</span>}</p>
        <p><strong>연락처:</strong> {me.phone ?? <span className="text-gray-400">미등록</span>}</p>
      </div>

      {/* ✨ 수정 페이지로 이동 */}
      <div className="text-right">
        <Link to="edit" className="rounded bg-primary px-4 py-1 text-sm text-white">
          수정
        </Link>
      </div>
    </section>
  );
}
