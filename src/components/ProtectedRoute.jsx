// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// export default function ProtectedRoute({ children, allowedRoles = [] }) {
//   const { user, ready } = useContext(AuthContext);

//   if (!ready) return null; // or a loader
//   if (!user) return <Navigate to="/" replace />; // not logged in

//   if (allowedRoles.length && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }


import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, ready } = useContext(AuthContext);

  // Show loading while checking session
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(user.role);
    
    if (!hasRole) {
      console.log('ProtectedRoute: Access denied', {
        userRole: user.role,
        allowedRoles
      });
      return <Navigate to="/" replace />;
    }
  }

  console.log('ProtectedRoute: Access granted', {
    userRole: user.role,
    allowedRoles
  });

  return children;
}