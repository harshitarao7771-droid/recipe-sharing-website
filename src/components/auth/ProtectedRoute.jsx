import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-spin-slow" style={{ width: '40px', height: '40px', border: '3px solid #334155', borderTopColor: '#F97316', borderRadius: '50%' }} />
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
