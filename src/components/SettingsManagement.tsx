
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Shield, Eye, Globe, Palette } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import LanguageSwitcher from "./LanguageSwitcher";
import DesignSystemManager from "./DesignSystemManager";

const SettingsManagement = () => {
  const { t } = useT();

  const handlePreview = () => {
    // Open current URL in new tab to simulate published version
    window.open(window.location.href, '_blank');
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
              <TabsTrigger value="users">Users</TabsTrigger>
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
              {/* User Management */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  User Management
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">Current User</p>
                      <p className="text-sm text-gray-600">Admin with full access rights</p>
                    </div>
                    <Badge className="bg-red-100 text-red-700">Admin</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Manage Tournaments</span>
                      <Badge className="bg-green-100 text-green-700">✓ Allowed</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Manage Players</span>
                      <Badge className="bg-green-100 text-green-700">✓ Allowed</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Manage Specials</span>
                      <Badge className="bg-green-100 text-green-700">✓ Allowed</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Manage Schedules</span>
                      <Badge className="bg-green-100 text-green-700">✓ Allowed</Badge>
                    </div>
                  </div>
                  <Button className="mt-4 w-full" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Manage User Roles (Coming Soon)
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
                    <span>Local Browser Storage</span>
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
