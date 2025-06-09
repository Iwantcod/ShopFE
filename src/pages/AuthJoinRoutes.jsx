// AuthJoinRoutes.jsx – 로그인 없이 접근 가능한 회원가입·OAuth 완료 라우트 묶음
import { Routes, Route, Navigate } from 'react-router-dom';

import JoinPage from './JoinPage';
import JoinSellerPage from './JoinSellerPage';
import JoinCompletePage from './JoinCompletePage';

export default function AuthJoinRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="join" replace />} />
      <Route path="join" element={<JoinPage />} />
      <Route path="join/seller" element={<JoinSellerPage />} />
      <Route path="complete" element={<JoinCompletePage />} />
    </Routes>
  );
}
