
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { useRolePermissions } from "@/hooks/useRolePermissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof ReturnType<typeof useRolePermissions>;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loading } = useAuth();
  const { loading: roleLoading } = useRole();

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

  // Authentication completely disabled - allow all access
  return <>{children}</>;
};

export default ProtectedRoute;
