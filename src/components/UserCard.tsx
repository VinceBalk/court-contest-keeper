
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { TestUser } from "@/types/user";

interface UserCardProps {
  user: TestUser;
  onEdit: (user: TestUser) => void;
  onToggleStatus: (userId: string) => void;
  getStatusColor: (status: string) => string;
  getRoleColor: (role: string) => string;
}

const UserCard = ({ user, onEdit, onToggleStatus, getStatusColor, getRoleColor }: UserCardProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Last active: {user.lastActive}</span>
            <span>•</span>
            <span>Tournaments: {user.tournamentsParticipated}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={getRoleColor(user.role)}>
            {user.role}
          </Badge>
          <Badge className={getStatusColor(user.status)}>
            {user.status}
          </Badge>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(user)}
              className="flex items-center gap-1"
            >
              <Edit className="h-3 w-3" />
              Edit
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(user.id)}
            >
              Toggle Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
