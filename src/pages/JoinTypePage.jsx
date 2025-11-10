import { useNavigate } from 'react-router-dom';

import Button from '../ui/core/Button';

export default function JoinTypePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-card">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">회원 유형 선택</h1>
          <p className="text-sm text-gray-500">
            가입할 회원 유형을 선택하세요.
          </p>
        </header>

        <div className="space-y-4">
          <Button className="w-full" onClick={() => navigate('/auth/join/user')}>
            일반 회원 가입
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => navigate('/auth/join/seller')}
          >
            판매자 회원 가입
          </Button>
        </div>

        <button
          type="button"
          onClick={() => navigate('/auth/login')}
          className="w-full text-sm text-gray-500 underline"
        >
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}
