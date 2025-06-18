
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/contexts/TranslationContext";
import { useCreateSpecial, useUpdateSpecial } from "@/hooks/useSpecials";

export interface SpecialType {
  id: string;
  name: string;
  description: string;
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
  const { t } = useT();
  
  const createSpecialMutation = useCreateSpecial();
  const updateSpecialMutation = useUpdateSpecial();

  const createSpecial = async () => {
    if (!newSpecialName.trim()) {
      toast({
        title: t('general.error'),
        description: t('special.name.required'),
        variant: "destructive"
      });
      return;
    }

    const newSpecial = {
      name: newSpecialName.trim(),
      description: newSpecialDescription.trim() || '',
      isActive: true
    };

    createSpecialMutation.mutate(newSpecial, {
      onSuccess: () => {
        setNewSpecialName("");
        setNewSpecialDescription("");
        
        toast({
          title: t('special.created'),
          description: `${newSpecial.name} ${t('special.createdDescription')}`,
        });
      },
      onError: (error) => {
        toast({
          title: t('general.error'),
          description: "Failed to create special",
          variant: "destructive"
        });
        console.error('Error creating special:', error);
      }
    });
  };

  const startEdit = (special: SpecialType) => {
    setEditingId(special.id);
    setEditName(special.name);
    setEditDescription(special.description || "");
  };

  const saveEdit = async () => {
    if (!editName.trim()) {
      toast({
        title: t('general.error'),
        description: t('special.name.required'),
        variant: "destructive"
      });
      return;
    }

    const special = specialTypes.find(s => s.id === editingId);
    if (!special) return;

    const updatedSpecial = {
      ...special,
      name: editName.trim(),
      description: editDescription.trim() || ''
    };

    updateSpecialMutation.mutate(updatedSpecial, {
      onSuccess: () => {
        setEditingId(null);
        setEditName("");
        setEditDescription("");
        
        toast({
          title: t('special.updated'),
          description: t('special.updatedDescription'),
        });
      },
      onError: (error) => {
        toast({
          title: t('general.error'),
          description: "Failed to update special",
          variant: "destructive"
        });
        console.error('Error updating special:', error);
      }
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const toggleSpecialStatus = async (special: SpecialType) => {
    const updatedSpecial = { ...special, isActive: !special.isActive };
    
    updateSpecialMutation.mutate(updatedSpecial, {
      onError: (error) => {
        toast({
          title: t('general.error'),
          description: "Failed to update special status",
          variant: "destructive"
        });
        console.error('Error toggling special status:', error);
      }
    });
  };

  const deleteSpecial = async (special: SpecialType) => {
    // Note: We don't have a delete mutation in the Supabase hooks yet
    // This would need to be implemented if delete functionality is required
    toast({
      title: "Not implemented",
      description: "Delete functionality not yet implemented with Supabase",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            {t('special.create.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder={t('special.name.placeholder')}
                value={newSpecialName}
                onChange={(e) => setNewSpecialName(e.target.value)}
              />
              <Input
                placeholder={t('special.description.placeholder')}
                value={newSpecialDescription}
                onChange={(e) => setNewSpecialDescription(e.target.value)}
              />
            </div>
            <Button 
              onClick={createSpecial} 
              className="bg-green-600 hover:bg-green-700"
              disabled={createSpecialMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              {createSpecialMutation.isPending ? 'Creating...' : t('special.create')}
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
                      placeholder={t('special.name.placeholder')}
                      className="text-sm"
                    />
                    <Input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder={t('special.description.placeholder')}
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
                  {special.isActive ? t('special.active') : t('special.inactive')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2 flex-wrap">
                {editingId === special.id ? (
                  <>
                    <Button 
                      size="sm" 
                      onClick={saveEdit} 
                      className="bg-green-600 hover:bg-green-700"
                      disabled={updateSpecialMutation.isPending}
                    >
                      {updateSpecialMutation.isPending ? 'Saving...' : t('special.save')}
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      {t('special.cancel')}
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
                      {t('special.edit')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleSpecialStatus(special)}
                      className={special.isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                      disabled={updateSpecialMutation.isPending}
                    >
                      {special.isActive ? t('special.deactivate') : t('special.activate')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSpecial(special)}
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
              <p className="text-gray-500 text-lg">{t('special.noSpecials')}</p>
              <p className="text-gray-400 text-sm">{t('special.getStarted')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SpecialManagement;
