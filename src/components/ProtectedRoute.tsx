
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { useRolePermissions } from "@/hooks/useRolePermissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof ReturnType<typeof useRolePermissions>;
}

const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { userRoles, loading: roleLoading } = useRole();
  const permissions = useRolePermissions(userRoles);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // For now, allow access without authentication since the database is set up
  // but authentication is disabled. In the future, uncomment these lines:
  
  // if (!user) {
  //   return <Navigate to="/auth" replace />;
  // }

  // if (requiredPermission && !permissions[requiredPermission]) {
  //   return <Navigate to="/" replace />;
  // }

  // Temporary: Allow all access for development
  return <>{children}</>;
};

export default ProtectedRoute;
