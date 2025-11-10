import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PageLayout from './ui/composite/PageLayout';
import LoginPage from './pages/LoginPage';
import { ToastProvider } from './ui/feedback/toastContext';
import { DialogProvider } from './ui/feedback/dialogContext';
import AuthJoinRoutes from './pages/AuthJoinRoutes';
import ProtectedRoute from './routes/ProtectedRoute';
import ProductListPage from './pages/ProductListPage';  
import ProductDetailPage from './pages/ProductDetailPage';
import MyPageLayout from './pages/mypage/MyPageLayout';
import CartPage from './pages/CartPage';
import OrderFormPage from './pages/OrderFormPage';
import OrderConfirmPage from './pages/OrderConfirmPage';
import OrdersPage from './pages/OrdersPage';
import MyInfoPage from './pages/mypage/MyInfoPage';
import MyInfoEditPage from './pages/mypage/MyInfoEditPage';
import SellerShortcut from './pages/mypage/SellerShortcut';
import AdminShortcut from './pages/mypage/AdminShortcut';
import SellerLayout from './pages/seller/SellerLayout';
import SellerDashboardHome from './pages/seller/SellerDashboardHome';
import ProductTable from './pages/seller/ProductTable';
import ProductForm from './pages/seller/ProductForm';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import CategoryTable from './pages/admin/CategoryTable';
import SpecTable from './pages/admin/SpecTable';
import SellerApproval from './pages/admin/SellerApproval';
import AdminProductTable from './pages/admin/AdminProductTable';

export default function App() {
  return (
     <BrowserRouter>
        {/* 전역 UI 레이어는 앱 전체를 한 번만 감싼다 */}
        <ToastProvider>
          <DialogProvider>
            <Routes>
              {/* ───────── 인증 필요 없는 영역 ───────── */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/*" element={<AuthJoinRoutes />} />

              {/* ───────── 로그인 필수 영역 ───────── */}
              <Route element={<ProtectedRoute />}>
                <Route element={<PageLayout />}>
                  {/* 홈 – 첫 카테고리로 보내거나 HomePage 사용 */}
                  {/* <Route index element={<HomePage />} /> */}
                  <Route index element={<Navigate to="/products/cpu" replace />} />

                  <Route
                    path="products/:category"
                    element={<ProductListPage />}
                  />
                  <Route
                    path="product/:id"
                    element={<ProductDetailPage />}
                  />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="order"          element={<OrderFormPage />} />
                  <Route path="order/confirm" element={<OrderConfirmPage />} />
                  <Route path="orders"        element={<OrdersPage />} />

                  <Route path="mypage/*" element={<MyPageLayout />}>
                    <Route index element={<MyInfoPage />} />          {/* /mypage            */}
                    <Route path="edit"   element={<MyInfoEditPage />} />{/* /mypage/edit     */}
                    <Route path="seller" element={<SellerShortcut />} />{/* /mypage/seller   */}
                    <Route path="admin"  element={<AdminShortcut />} />{/* /mypage/admin    */}
                  </Route>
                </Route>
              </Route>

              {/* ───────── SELLER 전용 ───────── */}
            <Route element={<ProtectedRoute requiredRole="SELLER" />}>
              <Route path="/seller/*" element={<SellerLayout />}>
                <Route index            element={<SellerDashboardHome />} />
                <Route path="products"  element={<ProductTable />} />
                <Route path="products/new"       element={<ProductForm mode="create" />} />
                <Route path="products/:id/edit" element={<ProductForm mode="edit"   />} />
              </Route>
            </Route>

            {/* ───────── ADMIN 전용 ───────── */}
            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route index                element={<AdminDashboardHome />} />
                <Route path="categories"    element={<CategoryTable />} />
                <Route path="specs"         element={<SpecTable />} />
                <Route path="seller-approval" element={<SellerApproval />} />
                <Route path="products"     element={<AdminProductTable />} />
              </Route>
            </Route>

              {/* ───────── Fallback ───────── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DialogProvider>
        </ToastProvider>
      </BrowserRouter>
  );
}
