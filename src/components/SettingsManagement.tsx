
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Shield, Eye, Globe, Palette, UserPlus, Users } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "./LanguageSwitcher";
import DesignSystemManager from "./DesignSystemManager";

const SettingsManagement = () => {
  const { t } = useT();
  const { user } = useAuth();
  const { toast } = useToast();
  const [testUsers, setTestUsers] = useState<Array<{id: string, email: string, role: string, status: string}>>([
    { id: '1', email: 'admin@test.com', role: 'Admin', status: 'Active' },
    { id: '2', email: 'user@test.com', role: 'User', status: 'Active' },
    { id: '3', email: 'moderator@test.com', role: 'Moderator', status: 'Pending' },
  ]);

  const handlePreview = () => {
    // Open current URL in new tab to simulate published version
    window.open(window.location.href, '_blank');
  };

  const handleCreateTestUser = () => {
    const newUser = {
      id: (testUsers.length + 1).toString(),
      email: `testuser${testUsers.length + 1}@example.com`,
      role: 'User',
      status: 'Active'
    };
    setTestUsers([...testUsers, newUser]);
    toast({
      title: "Test User Created",
      description: `Created ${newUser.email} successfully`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setTestUsers(testUsers.filter(u => u.id !== userId));
    toast({
      title: "User Deleted",
      description: "User has been removed from the system",
    });
  };

  const toggleUserStatus = (userId: string) => {
    setTestUsers(testUsers.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
        : u
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            {t('nav.settings')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="design">
                <Palette className="h-4 w-4 mr-2" />
                Design
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              {/* Language Settings */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  Language Settings
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Application Language</p>
                    <p className="text-sm text-gray-600">Choose your preferred language for the interface</p>
                  </div>
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Preview & Publishing */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="h-5 w-5 text-orange-600" />
                  Preview & Publishing
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="mb-4">
                    <p className="font-medium">Application Preview</p>
                    <p className="text-sm text-gray-600">See how your application will look when published</p>
                  </div>
                  <Button onClick={handlePreview} className="w-full bg-orange-600 hover:bg-orange-700">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Application
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="design">
              <DesignSystemManager />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              {/* Current User Status */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Current User Status
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">
                        {user ? `Logged in as: ${user.email}` : 'Not logged in'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user ? 'Authenticated user with full access' : 'Testing mode - no authentication required'}
                      </p>
                    </div>
                    <Badge className={user ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                      {user ? 'Authenticated' : 'Test Mode'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* User Management */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  User Management (Test Environment)
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Test Users</p>
                      <p className="text-sm text-gray-600">Manage test users for development and testing</p>
                    </div>
                    <Button onClick={handleCreateTestUser} className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Create Test User
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {testUsers.map((testUser) => (
                      <div key={testUser.id} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-sm">{testUser.email}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{testUser.role}</Badge>
                              <Badge 
                                className={`text-xs ${
                                  testUser.status === 'Active' 
                                    ? 'bg-green-100 text-green-700' 
                                    : testUser.status === 'Inactive'
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {testUser.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserStatus(testUser.id)}
                          >
                            {testUser.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(testUser.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> This is a test environment. In production, user management would be handled through Supabase authentication with proper security measures.
                    </p>
                  </div>
                </div>
              </div>

              {/* Role Management */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Role & Permission Management
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Manage Tournaments</span>
                      <Badge className="bg-green-100 text-green-700">✓ Admin, Moderator</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Manage Players</span>
                      <Badge className="bg-green-100 text-green-700">✓ Admin, Moderator</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Manage Specials</span>
                      <Badge className="bg-green-100 text-green-700">✓ Admin</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>View Reports</span>
                      <Badge className="bg-green-100 text-green-700">✓ All Roles</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>System Settings</span>
                      <Badge className="bg-red-100 text-red-700">✓ Admin Only</Badge>
                    </div>
                  </div>
                  <Button className="mt-4 w-full" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Configure Role Permissions
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              {/* System Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">System Information</h3>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Application Version</span>
                    <span className="font-mono">v1.0.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Updated</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Data Storage</span>
                    <span>Local Browser Storage + Supabase</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Authentication</span>
                    <span className={user ? "text-green-600" : "text-yellow-600"}>
                      {user ? "Enabled & Active" : "Available (Test Mode)"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Screen Size</span>
                    <span className="font-mono">
                      <span className="inline sm:hidden">XS</span>
                      <span className="hidden sm:inline md:hidden">SM</span>
                      <span className="hidden md:inline lg:hidden">MD</span>
                      <span className="hidden lg:inline xl:hidden">LG</span>
                      <span className="hidden xl:inline 2xl:hidden">XL</span>
                      <span className="hidden 2xl:inline">2XL</span>
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManagement;
