// routes/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const { role } = useSelector((s) => s.auth);

  // dev 서버에서는 무조건 통과: 배포 시 주석처리할것
  // if (import.meta.env.DEV) return <Outlet />;

  return role ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
