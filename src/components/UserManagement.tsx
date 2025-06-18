
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Search, Filter, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface TestUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  lastActive: string;
  tournamentsParticipated: number;
}

const UserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
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

  const changeUserRole = (userId: string, newRole: string) => {
    setTestUsers(testUsers.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    toast({
      title: "Role Updated",
      description: `User role changed to ${newRole}`,
    });
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
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Label>Filter by Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                  <SelectItem value="Player">Player</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreateUser} className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Users ({filteredUsers.length})</h3>
            </div>
            
            <div className="grid gap-3">
              {filteredUsers.map((testUser) => (
                <div key={testUser.id} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <p className="font-medium">{testUser.name}</p>
                          <p className="text-sm text-gray-600">{testUser.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Last active: {testUser.lastActive}</span>
                        <span>•</span>
                        <span>Tournaments: {testUser.tournamentsParticipated}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(testUser.role)}>
                        {testUser.role}
                      </Badge>
                      <Badge className={getStatusColor(testUser.status)}>
                        {testUser.status}
                      </Badge>
                      
                      <div className="flex items-center gap-1">
                        <Select 
                          value={testUser.role} 
                          onValueChange={(value) => changeUserRole(testUser.id, value)}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Moderator">Moderator</SelectItem>
                            <SelectItem value="Player">Player</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(testUser.id)}
                        >
                          Toggle Status
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Panel */}
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
    </div>
  );
};

export default UserManagement;
