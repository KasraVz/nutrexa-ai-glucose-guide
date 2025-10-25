import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
  allowedRoles?: Array<'patient' | 'specialist' | 'meal-creator'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireOnboarding = false,
  allowedRoles
}) => {
  const { isAuthenticated, hasCompletedOnboarding, justSignedUp, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Check role-based access
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's role
    const dashboardPath = user.role === 'specialist' 
      ? '/dashboard/specialist'
      : user.role === 'meal-creator'
      ? '/dashboard/meal-creator'
      : '/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  // Only allow onboarding for users who just signed up
  if (window.location.pathname === '/onboarding' && !justSignedUp) {
    const dashboardPath = user?.role === 'specialist' 
      ? '/dashboard/specialist'
      : user?.role === 'meal-creator'
      ? '/dashboard/meal-creator'
      : '/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  if (requireOnboarding && !hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};