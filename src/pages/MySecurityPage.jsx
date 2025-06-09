// src/pages/MySecurityPage.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useChangePasswordMutation, useDeleteMeMutation } from '../features/api/userApi';
import Button from '../ui/core/Button';
import useToast from '../ui/feedback/useToast';

export default function MySecurityPage() {
  const { userId } = useSelector((s)=>s.auth); // 또는 me.oAuth2Id 로 판별
  const { data: me } = useSelector((s)=>s.userApi.queries) || {}; // simplify
  const isOAuth = !!me?.oAuth2Id;
  const toast   = useToast();

  const [pwForm, setPwForm] = useState({ current:'', next:'', confirm:'' });
  const [changePw] = useChangePasswordMutation();
  const [deleteMe] = useDeleteMeMutation();

  const pwValid = pwForm.next && pwForm.next === pwForm.confirm;

  const submitPw = async () => {
    try {
      await changePw({ userId, password: pwForm.next }).unwrap();
      toast.push('비밀번호가 변경되었습니다. 다시 로그인해 주세요.');
      window.location.href = '/auth/login';
    } catch { toast.push('변경 실패', 'error'); }
  };

  const withdraw = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) return;
    await deleteMe();
    toast.push('계정이 탈퇴 처리되었습니다.');
    window.location.href = '/';
  };

  return (
    <section className="space-y-6">
      {!isOAuth && (
        <>
          <h2 className="text-lg font-semibold">비밀번호 변경</h2>
          <div className="space-y-2">
            <input type="password" placeholder="새 비밀번호" className="w-full rounded border p-2"
                   value={pwForm.next} onChange={e=>setPwForm(v=>({...v,next:e.target.value}))} />
            <input type="password" placeholder="새 비밀번호 확인" className="w-full rounded border p-2"
                   value={pwForm.confirm} onChange={e=>setPwForm(v=>({...v,confirm:e.target.value}))}/>
            <Button size="sm" onClick={submitPw} disabled={!pwValid}>변경</Button>
          </div>
        </>
      )}

      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold text-red-600">계정 탈퇴</h2>
        <p className="text-sm text-gray-500">탈퇴 즉시 계정이 삭제되며 복구할 수 없습니다.</p>
        <Button size="sm" className="mt-2 bg-red-100 text-red-600 hover:bg-red-200" onClick={withdraw}>
          탈퇴하기
        </Button>
      </div>
    </section>
  );
}
