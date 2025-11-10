// AuthJoinRoutes.jsx – 로그인 없이 접근 가능한 회원가입·OAuth 완료 라우트 묶음
import { Routes, Route, Navigate } from 'react-router-dom';

import JoinPage from './JoinPage';
import JoinSellerPage from './JoinSellerPage';
import JoinCompletePage from './JoinCompletePage';
import JoinTypePage from './JoinTypePage';

export default function AuthJoinRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="type" replace />} />
      <Route path="type" element={<JoinTypePage />} />
      <Route path="user" element={<JoinPage />} />
      <Route path="seller" element={<JoinSellerPage />} />
      <Route path="complete" element={<JoinCompletePage />} />
    </Routes>
  );
}
