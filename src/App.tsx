import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PatientDashboard from "./pages/patient/PatientDashboard";
import Trends from "./pages/patient/Trends";
import Reminders from "./pages/patient/Reminders";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import OnboardingMultiStep from "./pages/OnboardingMultiStep";
import MyPlan from "./pages/MyPlan";
import Profile from "./pages/Profile";
import Summary from "./pages/Summary";
import NotFound from "./pages/NotFound";
import SpecialistDashboard from "./pages/specialist/SpecialistDashboard";
import MealCreatorDashboard from "./pages/meal-creator/MealCreatorDashboard";

const queryClient = new QueryClient();

// Helper function to determine dashboard path based on role
const determineDashboardPath = (role: string | null | undefined) => {
  switch (role) {
    case 'specialist':
      return '/dashboard/specialist';
    case 'meal-creator':
      return '/dashboard/meal-creator';
    case 'patient':
    default:
      return '/dashboard';
  }
};

const RootRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={determineDashboardPath(user?.role)} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <OnboardingMultiStep />
              </ProtectedRoute>
            } />
            <Route path="/summary" element={
              <ProtectedRoute>
                <Summary />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/trends" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Trends />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/reminders" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Reminders />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/specialist/*" element={
              <ProtectedRoute allowedRoles={['specialist']}>
                <SpecialistDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/meal-creator/*" element={
              <ProtectedRoute allowedRoles={['meal-creator']}>
                <MealCreatorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/" element={<RootRedirect />} />
            <Route path="/my-plan" element={
              <ProtectedRoute>
                <MyPlan />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
