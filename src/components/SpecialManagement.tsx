
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/contexts/TranslationContext";

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
  const { t } = useT();

  const createSpecial = () => {
    if (!newSpecialName.trim()) {
      toast({
        title: t('general.error'),
        description: t('special.name.required'),
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
      title: t('special.created'),
      description: `${newSpecial.name} ${t('special.createdDescription')}`,
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
        title: t('general.error'),
        description: t('special.name.required'),
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
      title: t('special.updated'),
      description: t('special.updatedDescription'),
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
      title: t('special.deleted'),
      description: `${special?.name} ${t('special.deletedDescription')}`,
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
            <Button onClick={createSpecial} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              {t('special.create')}
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
                    <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                      {t('special.save')}
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
                      onClick={() => toggleSpecialStatus(special.id)}
                      className={special.isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                    >
                      {special.isActive ? t('special.deactivate') : t('special.activate')}
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
