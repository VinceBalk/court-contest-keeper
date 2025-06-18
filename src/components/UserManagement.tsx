
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { TestUser, EditUserForm } from "@/types/user";
import UserControls from "./UserControls";
import UserList from "./UserList";
import UserEditDialog from "./UserEditDialog";

const UserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<TestUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [testUsers, setTestUsers] = useState<TestUser[]>([
    {
      id: '1',
      email: 'admin@test.com',
      name: 'Admin User',
      role: 'Admin',
      status: 'Active',
      lastActive: '2024-01-15',
      tournamentsParticipated: 12
    },
    {
      id: '2',
      email: 'john.doe@test.com',
      name: 'John Doe',
      role: 'Player',
      status: 'Active',
      lastActive: '2024-01-14',
      tournamentsParticipated: 8
    },
    {
      id: '3',
      email: 'jane.smith@test.com',
      name: 'Jane Smith',
      role: 'Moderator',
      status: 'Inactive',
      lastActive: '2024-01-10',
      tournamentsParticipated: 5
    },
    {
      id: '4',
      email: 'mike.wilson@test.com',
      name: 'Mike Wilson',
      role: 'Player',
      status: 'Pending',
      lastActive: 'Never',
      tournamentsParticipated: 0
    }
  ]);

  const form = useForm<EditUserForm>({
    defaultValues: {
      name: '',
      email: '',
      role: 'Player',
      status: 'Active'
    }
  });

  const filteredUsers = testUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    const newUser: TestUser = {
      id: (testUsers.length + 1).toString(),
      email: `newuser${testUsers.length + 1}@test.com`,
      name: `Test User ${testUsers.length + 1}`,
      role: 'Player',
      status: 'Active',
      lastActive: new Date().toISOString().split('T')[0],
      tournamentsParticipated: 0
    };
    setTestUsers([...testUsers, newUser]);
    toast({
      title: "User Created",
      description: `${newUser.name} has been added successfully`,
    });
  };

  const handleEditUser = (user: TestUser) => {
    setEditingUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = (data: EditUserForm) => {
    if (!editingUser) return;

    const updatedUsers = testUsers.map(u => 
      u.id === editingUser.id 
        ? { 
            ...u, 
            name: data.name,
            email: data.email,
            role: data.role,
            status: data.status,
            lastActive: new Date().toISOString().split('T')[0]
          }
        : u
    );
    
    setTestUsers(updatedUsers);
    setIsEditDialogOpen(false);
    setEditingUser(null);
    
    toast({
      title: "User Updated",
      description: `${data.name} has been updated successfully`,
    });
  };

  const toggleUserStatus = (userId: string) => {
    setTestUsers(testUsers.map(u => 
      u.id === userId 
        ? { 
            ...u, 
            status: u.status === 'Active' ? 'Inactive' : 
                   u.status === 'Inactive' ? 'Pending' : 'Active'
          }
        : u
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Inactive': return 'bg-gray-100 text-gray-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-700';
      case 'Moderator': return 'bg-blue-100 text-blue-700';
      case 'Player': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            User Management
            <Badge variant="outline" className="ml-2">Test Environment</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <UserControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            onCreateUser={handleCreateUser}
          />

          <UserList
            users={filteredUsers}
            onEditUser={handleEditUser}
            onToggleStatus={toggleUserStatus}
            getStatusColor={getStatusColor}
            getRoleColor={getRoleColor}
          />

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Test Environment Information</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• This is a test environment for user management features</li>
              <li>• In production, users would be managed through Supabase authentication</li>
              <li>• Role-based permissions would be enforced at the database level</li>
              <li>• User actions would be logged for audit purposes</li>
              {user && <li>• Currently authenticated as: {user.email}</li>}
            </ul>
          </div>
        </CardContent>
      </Card>

      <UserEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        form={form}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagement;
