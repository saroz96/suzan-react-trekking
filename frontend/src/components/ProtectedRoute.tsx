import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  // Use "user" instead of "currentUser" to match your context
  const { user, loading } = useAuth(); 

  console.log('🔒 ProtectedRoute - user:', user);
  console.log('🔒 ProtectedRoute - loading:', loading);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    console.log('🔒 No user, redirecting to login');
    return <Navigate to="/auth/login" replace />;
  }

  // Permission check (if needed)
  if (requiredPermission) {
    // Add your permission logic here
    const hasPermission = user.name === 'Administrator';
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #e67e22',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default ProtectedRoute;