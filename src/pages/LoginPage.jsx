import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../ui/core/Button';
import { useLoginMutation } from '../features/api/authApi';
import { API_URL } from '../config';

export default function LoginPage() {
  const formRef = useRef(null);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      await login(formData).unwrap();
      navigate('/products/cpu', { replace: true });
    } catch {
      alert('아이디/비밀번호를 확인하세요');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-0 h-72 w-72 rounded-full bg-white/70 blur-[140px]" />
        <div className="absolute right-10 top-8 h-80 w-80 rounded-full bg-[#f8e4cc] blur-[150px]" />
      </div>
      <div className="relative z-10 grid w-full max-w-6xl gap-12 lg:grid-cols-[1.1fr_420px]">
        <section className="hidden flex-col justify-center rounded-3xl bg-white/40 p-10 lg:flex">
          <p className="text-sm uppercase tracking-[0.3em] text-[#b4855b]">Welcome back</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#3f2f23]">
            당신의 컴퓨터 쇼핑을
            <br />
            한 단계 더 매끄럽게.
          </h1>
        </section>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full rounded-3xl border border-[rgba(223,200,173,0.45)] bg-white/85 p-8 backdrop-blur"
        >
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b4855b]">
              Sign in
            </p>
            <h2 className="text-2xl font-semibold text-[#3d2e24]">계정으로 로그인</h2>
            <p className="text-sm text-[#826f60]">등록된 이메일과 비밀번호를 입력하세요.</p>
          </div>

          <div className="mt-8 space-y-4">
            <label className="space-y-2 text-sm text-[#5a4c40]">
              <span>이메일</span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-2xl border border-[#e6d3c0] bg-white/70 px-4 py-3 text-sm text-[#3a2d24] placeholder:text-[#b79f8b] focus:border-[#c08a5d] focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-[#5a4c40]">
              <span>비밀번호</span>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-2xl border border-[#e6d3c0] bg-white/70 px-4 py-3 text-sm text-[#3a2d24] placeholder:text-[#b79f8b] focus:border-[#c08a5d] focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-8 space-y-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '로그인 중…' : '로그인'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => navigate('/auth/join/type')}
            >
              회원가입
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full border-[#e3c7a6] bg-[#fff5ea] text-[#6b4c37] hover:bg-[#f7e5d1]"
              onClick={() => {
                const target = `${API_URL}/oauth2/authorization/google`;
                window.location.assign(target);
              }}
            >
              <span className="mr-2 inline-flex items-center justify-center">
                <img src="/googleIcon.png" alt="Google" className="h-5 w-5" />
              </span>
              구글 계정으로 로그인
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
