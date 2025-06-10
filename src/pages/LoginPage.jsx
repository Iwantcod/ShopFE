import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLoginMutation } from '../features/api/authApi';

export default function LoginPage() {
  const formRef = useRef(null);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* HTMLFormElement → FormData */
    const formData = new FormData(formRef.current);

    try {
      await login(formData).unwrap();      // ← 그대로 전달
      navigate('/products/cpu', { replace: true });
    } catch {
      alert('아이디/비밀번호를 확인하세요');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded bg-white p-8 shadow-card"
      >
        <h1 className="text-center text-xl font-semibold">로그인</h1>

        {/* name 속성이 중요합니다 */}
        <input
          name="email"
          type="email"
          placeholder="이메일"
          required
          className="w-full rounded border px-3 py-2 ring-1 ring-stone-200 focus:ring-primary"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          className="w-full rounded border px-3 py-2 ring-1 ring-stone-200 focus:ring-primary"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-primary py-2 font-medium text-white hover:bg-primary-dark"
        >
          {isLoading ? '로그인 중…' : '로그인'}
        </button>

        {/* 하단 추가 버튼들 */}
        <div className="text-center text-sm text-gray-500">또는</div>
        <button
          type="button"
          onClick={() => navigate('/auth/join')}
          className="w-full rounded border py-2 font-medium hover:bg-stone-100"
        >
          회원가입
        </button>
        <button
          type="button"
          onClick={() =>
            window.open(
              '/oauth2/authorization/google', // 추후 수정: 현재 oauth2 페이지를 api 요청하는 것이 아니라 단순 페이지 전환만 하도록 되어있음. https://www.andypjt.site/oauth2/authorization/google
              '_blank',
              'width=500,height=600',
            )
          }
          className="w-full rounded bg-red-500 py-2 font-medium text-white hover:bg-red-600"
        >
          구글 계정으로 로그인
        </button>
      </form>
    </div>
  );
}
