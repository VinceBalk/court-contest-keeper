
import UserCard from "./UserCard";
import { TestUser } from "@/types/user";

interface UserListProps {
  users: TestUser[];
  onEditUser: (user: TestUser) => void;
  onToggleStatus: (userId: string) => void;
  getStatusColor: (status: string) => string;
  getRoleColor: (role: string) => string;
}

const UserList = ({
  users,
  onEditUser,
  onToggleStatus,
  getStatusColor,
  getRoleColor
}: UserListProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Users ({users.length})</h3>
      </div>
      
      <div className="grid gap-3">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={onEditUser}
            onToggleStatus={onToggleStatus}
            getStatusColor={getStatusColor}
            getRoleColor={getRoleColor}
          />
        ))}
      </div>
    </div>
  );
};

export default UserList;
