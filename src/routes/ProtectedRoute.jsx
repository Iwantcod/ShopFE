// routes/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default function ProtectedRoute({ requiredRole, redirectTo = '/' }) {
  const { role } = useSelector((s) => s.auth);

  // 개발 환경에서 인증 우회 플래그가 true이면 바로 통과
  if (import.meta.env.VITE_BYPASS_AUTH === 'true') return <Outlet />;

  if (!role) return <Navigate to="/auth/login" replace />;

  const requiredRoles = toArray(requiredRole);
  if (requiredRoles.length && !requiredRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
