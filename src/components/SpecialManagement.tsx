
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface SpecialType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface SpecialManagementProps {
  specialTypes: SpecialType[];
  setSpecialTypes: (specialTypes: SpecialType[]) => void;
}

const SpecialManagement = ({ specialTypes, setSpecialTypes }: SpecialManagementProps) => {
  const [newSpecialName, setNewSpecialName] = useState("");
  const [newSpecialDescription, setNewSpecialDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const { toast } = useToast();

  const createSpecial = () => {
    if (!newSpecialName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a special name",
        variant: "destructive"
      });
      return;
    }

    const newSpecial: SpecialType = {
      id: `special-${Date.now()}`,
      name: newSpecialName.trim(),
      description: newSpecialDescription.trim() || undefined,
      isActive: true
    };

    setSpecialTypes([...specialTypes, newSpecial]);
    setNewSpecialName("");
    setNewSpecialDescription("");
    
    toast({
      title: "Special Created",
      description: `${newSpecial.name} has been created`,
    });
  };

  const startEdit = (special: SpecialType) => {
    setEditingId(special.id);
    setEditName(special.name);
    setEditDescription(special.description || "");
  };

  const saveEdit = () => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a special name",
        variant: "destructive"
      });
      return;
    }

    const updatedSpecials = specialTypes.map(special =>
      special.id === editingId
        ? { ...special, name: editName.trim(), description: editDescription.trim() || undefined }
        : special
    );

    setSpecialTypes(updatedSpecials);
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    
    toast({
      title: "Special Updated",
      description: "Special has been updated",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const toggleSpecialStatus = (specialId: string) => {
    const updatedSpecials = specialTypes.map(special =>
      special.id === specialId ? { ...special, isActive: !special.isActive } : special
    );
    setSpecialTypes(updatedSpecials);
  };

  const deleteSpecial = (specialId: string) => {
    const special = specialTypes.find(s => s.id === specialId);
    setSpecialTypes(specialTypes.filter(s => s.id !== specialId));
    
    toast({
      title: "Special Deleted",
      description: `${special?.name} has been deleted`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Create New Special Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Special name (e.g., Ace, Winner)"
                value={newSpecialName}
                onChange={(e) => setNewSpecialName(e.target.value)}
              />
              <Input
                placeholder="Description (optional)"
                value={newSpecialDescription}
                onChange={(e) => setNewSpecialDescription(e.target.value)}
              />
            </div>
            <Button onClick={createSpecial} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Special
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {specialTypes.map((special) => (
          <Card key={special.id} className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                {editingId === special.id ? (
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Special name"
                      className="text-sm"
                    />
                    <Input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                      className="text-sm"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      {special.name}
                    </CardTitle>
                    {special.description && (
                      <p className="text-sm text-gray-600 mt-1">{special.description}</p>
                    )}
                  </div>
                )}
                <Badge variant={special.isActive ? "default" : "outline"}>
                  {special.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2 flex-wrap">
                {editingId === special.id ? (
                  <>
                    <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(special)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleSpecialStatus(special.id)}
                      className={special.isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                    >
                      {special.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSpecial(special.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {specialTypes.length === 0 && (
          <Card className="bg-white/90 backdrop-blur-sm col-span-full">
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No special types created yet</p>
              <p className="text-gray-400 text-sm">Create your first special type to get started</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SpecialManagement;
