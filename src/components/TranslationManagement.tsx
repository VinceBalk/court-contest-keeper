
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Languages, Plus, Trash2, Edit2, Check, X, Globe } from "lucide-react";
import { useTranslations, Translation, Language } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";

const TranslationManagement = () => {
  const { language, changeLanguage, t, translations, updateTranslation, addTranslation, deleteTranslation } = useTranslations();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Translation>>({});
  const [newTranslation, setNewTranslation] = useState({
    key: '',
    en: '',
    nl: '',
    category: 'general'
  });
  const { toast } = useToast();

  const categories = Array.from(new Set(translations.map(t => t.category)));
  const translationsByCategory = categories.reduce((acc, category) => {
    acc[category] = translations.filter(t => t.category === category);
    return acc;
  }, {} as Record<string, Translation[]>);

  const startEditing = (translation: Translation) => {
    setEditingId(translation.id);
    setEditingData(translation);
  };

  const saveEdit = () => {
    if (!editingId || !editingData.key?.trim() || !editingData.en?.trim() || !editingData.nl?.trim()) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    updateTranslation(editingId, editingData);
    setEditingId(null);
    setEditingData({});
    
    toast({
      title: "Translation Updated",
      description: "Translation has been successfully updated",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleAddTranslation = () => {
    if (!newTranslation.key.trim() || !newTranslation.en.trim() || !newTranslation.nl.trim()) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    // Check if key already exists
    if (translations.some(t => t.key === newTranslation.key)) {
      toast({
        title: "Error",
        description: "Translation key already exists",
        variant: "destructive"
      });
      return;
    }

    addTranslation(newTranslation);
    setNewTranslation({ key: '', en: '', nl: '', category: 'general' });
    
    toast({
      title: "Translation Added",
      description: "New translation has been added successfully",
    });
  };

  const handleDeleteTranslation = (id: string) => {
    deleteTranslation(id);
    toast({
      title: "Translation Deleted",
      description: "Translation has been removed",
    });
  };

  const renderTranslationRow = (translation: Translation) => {
    const isEditing = editingId === translation.id;

    return (
      <div key={translation.id} className="flex items-center gap-4 p-3 rounded-lg border bg-white">
        <div className="flex-1 grid grid-cols-4 gap-4">
          {isEditing ? (
            <>
              <Input
                value={editingData.key || ''}
                onChange={(e) => setEditingData(prev => ({ ...prev, key: e.target.value }))}
                placeholder="Translation key"
                className="font-mono text-sm"
              />
              <Input
                value={editingData.en || ''}
                onChange={(e) => setEditingData(prev => ({ ...prev, en: e.target.value }))}
                placeholder="English text"
              />
              <Input
                value={editingData.nl || ''}
                onChange={(e) => setEditingData(prev => ({ ...prev, nl: e.target.value }))}
                placeholder="Dutch text"
              />
              <Select 
                value={editingData.category || 'general'} 
                onValueChange={(value) => setEditingData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                  <SelectItem value="general">general</SelectItem>
                </SelectContent>
              </Select>
            </>
          ) : (
            <>
              <div>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">{translation.key}</code>
              </div>
              <div className="text-sm">{translation.en}</div>
              <div className="text-sm">{translation.nl}</div>
              <div>
                <Badge variant="outline">{translation.category}</Badge>
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={saveEdit} className="h-8 w-8 p-0">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => startEditing(translation)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteTranslation(translation.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-blue-600" />
              Translation Management
            </CardTitle>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-600" />
              <Select value={language} onValueChange={(value: Language) => changeLanguage(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="nl">Nederlands</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Add New Translation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="newKey">Translation Key</Label>
              <Input
                id="newKey"
                placeholder="e.g., button.save"
                value={newTranslation.key}
                onChange={(e) => setNewTranslation(prev => ({ ...prev, key: e.target.value }))}
                className="font-mono"
              />
            </div>
            <div>
              <Label htmlFor="newEn">English Text</Label>
              <Input
                id="newEn"
                placeholder="English translation"
                value={newTranslation.en}
                onChange={(e) => setNewTranslation(prev => ({ ...prev, en: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="newNl">Dutch Text</Label>
              <Input
                id="newNl"
                placeholder="Nederlandse vertaling"
                value={newTranslation.nl}
                onChange={(e) => setNewTranslation(prev => ({ ...prev, nl: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="newCategory">Category</Label>
              <Select 
                value={newTranslation.category} 
                onValueChange={(value) => setNewTranslation(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                  <SelectItem value="general">general</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddTranslation} className="bg-green-600 hover:bg-green-700 w-full">
                Add Translation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={categories[0]} className="space-y-4">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category} ({translationsByCategory[category].length})
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="capitalize">{category} Translations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-4 p-3 font-medium text-sm text-gray-600 border-b">
                    <div>Translation Key</div>
                    <div>English</div>
                    <div>Nederlands</div>
                    <div>Category</div>
                  </div>
                  {translationsByCategory[category].map(renderTranslationRow)}
                  {translationsByCategory[category].length === 0 && (
                    <p className="text-center text-gray-500 py-8">No translations in this category yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TranslationManagement;
