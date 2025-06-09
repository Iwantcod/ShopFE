// src/pages/mypage/MyPageRoutes.jsx
import { Routes, Route } from 'react-router-dom';

import MyInfoPage    from './MyInfoPage';
import SellerLink    from './SellerShortcut';
import AdminLink     from './AdminShortcut';
import MyInfoEdit    from './MyInfoEditPage';   // ✨ 새로 추가
import MyPageLayout  from './MyPageLayout';

export default function MyPageRoutes() {
  return (
    <Routes>
      <Route element={<MyPageLayout />}>
        <Route index element={<MyInfoPage />} />
        <Route path="edit"   element={<MyInfoEdit />} />  {/* /mypage/edit */}
        <Route path="seller" element={<SellerLink />} />
        <Route path="admin"  element={<AdminLink />} />
      </Route>
    </Routes>
  );
}
