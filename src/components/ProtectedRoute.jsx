import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-brown-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-brown-300 border-t-brown-600 rounded-full animate-spin" />
        <p className="text-sm text-brown-400 font-medium">Loading CloudStock...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
