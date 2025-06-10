// src/pages/mypage/MyInfoEditPage.jsx
// 빈칸 → undefined 로 변환하여 서버에 누락(null)로 전달
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useMyInfoQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useDeleteMeMutation,
} from '../../features/api/userApi';
import Button   from '../../ui/core/Button';
import useToast from '../../ui/feedback/useToast';

const clean = (v) => (v.trim() === '' ? undefined : v); // 빈칸 정리

export default function MyInfoEditPage() {
  const nav   = useNavigate();
  const toast = useToast();

  const { data: me, isFetching } = useMyInfoQuery();
  const [updateMe,   { isLoading }] = useUpdateMeMutation();
  const [changePw]                 = useChangePasswordMutation();
  const [deleteMe]                 = useDeleteMeMutation();

  const isOAuth = !!me?.oAuth2Id;
  const [form, setForm] = useState({
    receiverName:  me?.name            ?? '',
    address:       me?.address         ?? '',
    addressDetail: me?.addressDetail   ?? '',
    phone:         me?.phone           ?? '',
    newPw:         '',
    confirmPw:     '',
  });

  if (isFetching) return <p className="p-8 text-center">Loading…</p>;
  if (!me)        return <p className="p-8 text-center">정보를 가져올 수 없습니다.</p>;

  /* ---------- 정보 저장 ---------- */
  const saveInfo = async () => {
    try {
      await updateMe({
        userId:        me.userId,                // 필수
        name:          clean(form.receiverName),
        address:       clean(form.address),
        addressDetail: clean(form.addressDetail),
        phone:         clean(form.phone),
      }).unwrap();
      toast.push('정보가 수정되었습니다.');
      nav('..');                                // /mypage
    } catch {
      toast.push('수정 실패', 'error');
    }
  };

  /* ---------- 비밀번호 변경 ---------- */
  const changePassword = async () => {
    if (form.newPw !== form.confirmPw) {
      toast.push('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }
    await changePw({ userId: me.userId, password: form.newPw });
    toast.push('비밀번호가 변경되었습니다. 다시 로그인해 주세요.');
    window.location.href = '/auth/login';
  };

  /* ---------- 탈퇴 ---------- */
  const withdraw = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) return;
    await deleteMe();
    toast.push('계정이 탈퇴 처리되었습니다.');
    window.location.href = '/';
  };

  return (
    <section className="space-y-8">
      <h2 className="text-lg font-semibold">내 정보 수정</h2>

      {/* --- 개인정보 입력 --- */}
      <div className="space-y-2">
        <label className="block">받는 이</label>
        <input className="w-full rounded border p-2"
               value={form.receiverName}
               onChange={(e)=>setForm(v=>({...v,receiverName:e.target.value}))} />

        <label className="mt-4 block">기본 주소</label>
        <input className="w-full rounded border p-2"
               value={form.address}
               onChange={(e)=>setForm(v=>({...v,address:e.target.value}))} />

        <label className="mt-4 block">상세 주소</label>
        <input className="w-full rounded border p-2"
               value={form.addressDetail}
               onChange={(e)=>setForm(v=>({...v,addressDetail:e.target.value}))} />

        <label className="mt-4 block">연락처</label>
        <input className="w-full rounded border p-2"
               value={form.phone}
               onChange={(e)=>setForm(v=>({...v,phone:e.target.value}))}
               placeholder="010-0000-0000" />

        <Button size="sm" onClick={saveInfo} disabled={isLoading}>
          수정
        </Button>
      </div>

      {/* --- 비밀번호 변경(일반 계정) --- */}
      {!isOAuth && (
        <div className="space-y-2 border-t pt-6">
          <h3 className="font-semibold">비밀번호 변경</h3>
          <input type="password" className="w-full rounded border p-2"
                 placeholder="새 비밀번호"
                 value={form.newPw}
                 onChange={(e)=>setForm(v=>({...v,newPw:e.target.value}))}/>
          <input type="password" className="w-full rounded border p-2"
                 placeholder="새 비밀번호 확인"
                 value={form.confirmPw}
                 onChange={(e)=>setForm(v=>({...v,confirmPw:e.target.value}))}/>
          <Button size="sm" onClick={changePassword}>변경</Button>
        </div>
      )}

      {/* --- 탈퇴 --- */}
      <div className="border-t pt-6">
        <h3 className="font-semibold text-red-600">계정 탈퇴</h3>
        <Button size="sm" className="mt-2 bg-red-100 text-red-600 hover:bg-red-200"
                onClick={withdraw}>
          탈퇴하기
        </Button>
      </div>
    </section>
  );
}
