import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { t } from "@/lib/translations";
import { Plus, Trash2, Edit2, CheckSquare, Gift, Search } from "lucide-react";

// Task preset interface
interface TaskPreset {
  id: string;
  title: string;
  category: string;
  monthsBefore: number;
  description?: string;
}

// Gift preset interface
interface GiftPreset {
  id: string;
  gift_name: string;
  gift_description?: string;
  gift_amount: number;
  gift_value: number;
}

export default function Models() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Task presets state
  const [taskPresets, setTaskPresets] = useState<TaskPreset[]>([
    { id: "1", title: "Escolher Espaço Cerimônia", category: "Local", monthsBefore: 12 },
    { id: "2", title: "Contratar Fotografia", category: "Outros", monthsBefore: 10 },
    { id: "3", title: "Contratar DJ", category: "Outros", monthsBefore: 9 },
    { id: "4", title: "Alugar Vestido", category: "Noiva", monthsBefore: 9 },
    { id: "5", title: "Contratar Bolo", category: "Local", monthsBefore: 7 },
  ]);
  
  // Gift presets state
  const [giftPresets, setGiftPresets] = useState<GiftPreset[]>([
    { id: "1", gift_name: "Jogo de Panelas Tramontina", gift_description: "Jogo de panelas profissional com 5 peças", gift_amount: 2, gift_value: 299.90 },
    { id: "2", gift_name: "Mixer Oster", gift_description: "Mixer elétrico para preparo de bebidas", gift_amount: 3, gift_value: 89.90 },
    { id: "3", gift_name: "Jogo de Toalhas", gift_description: "Jogo de toalhas de banho e rosto", gift_amount: 4, gift_value: 159.90 },
    { id: "4", gift_name: "Conjunto de Copos", gift_description: "Conjunto de 6 copos de vidro", gift_amount: 2, gift_value: 79.90 },
    { id: "5", gift_name: "Jogo de Pratos", gift_description: "Jogo de pratos para 6 pessoas", gift_amount: 2, gift_value: 199.90 },
  ]);

  // Form states
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingGift, setIsAddingGift] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskPreset | null>(null);
  const [editingGift, setEditingGift] = useState<GiftPreset | null>(null);
  
  const [taskForm, setTaskForm] = useState({
    title: "",
    category: "",
    monthsBefore: 12,
    description: ""
  });
  
  const [giftForm, setGiftForm] = useState({
    gift_name: "",
    gift_description: "",
    gift_amount: 1,
    gift_value: 0
  });

  // Filtered presets
  const filteredTaskPresets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return taskPresets;
    return taskPresets.filter(preset => 
      preset.title.toLowerCase().includes(query) ||
      preset.category.toLowerCase().includes(query) ||
      (preset.description && preset.description.toLowerCase().includes(query))
    );
  }, [taskPresets, searchQuery]);

  const filteredGiftPresets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return giftPresets;
    return giftPresets.filter(preset => 
      preset.gift_name.toLowerCase().includes(query) ||
      (preset.gift_description && preset.gift_description.toLowerCase().includes(query))
    );
  }, [giftPresets, searchQuery]);

  // Task preset functions
  const addTaskPreset = () => {
    if (!taskForm.title.trim()) return;
    
    const newPreset: TaskPreset = {
      id: Date.now().toString(),
      title: taskForm.title.trim(),
      category: taskForm.category.trim(),
      monthsBefore: taskForm.monthsBefore,
      description: taskForm.description.trim() || undefined
    };
    
    setTaskPresets([...taskPresets, newPreset]);
    resetTaskForm();
  };

  const editTaskPreset = () => {
    if (!editingTask || !taskForm.title.trim()) return;
    
    const updatedPresets = taskPresets.map(preset => 
      preset.id === editingTask.id 
        ? { ...preset, ...taskForm, title: taskForm.title.trim(), category: taskForm.category.trim(), description: taskForm.description.trim() || undefined }
        : preset
    );
    
    setTaskPresets(updatedPresets);
    resetTaskForm();
  };

  const deleteTaskPreset = (id: string) => {
    setTaskPresets(taskPresets.filter(preset => preset.id !== id));
  };

  const startEditTask = (preset: TaskPreset) => {
    setEditingTask(preset);
    setTaskForm({
      title: preset.title,
      category: preset.category,
      monthsBefore: preset.monthsBefore,
      description: preset.description || ""
    });
    setIsAddingTask(true);
  };

  const resetTaskForm = () => {
    setTaskForm({ title: "", category: "", monthsBefore: 12, description: "" });
    setEditingTask(null);
    setIsAddingTask(false);
  };

  // Gift preset functions
  const addGiftPreset = () => {
    if (!giftForm.gift_name.trim()) return;
    
    const newPreset: GiftPreset = {
      id: Date.now().toString(),
      gift_name: giftForm.gift_name.trim(),
      gift_description: giftForm.gift_description.trim() || undefined,
      gift_amount: giftForm.gift_amount,
      gift_value: giftForm.gift_value
    };
    
    setGiftPresets([...giftPresets, newPreset]);
    resetGiftForm();
  };

  const editGiftPreset = () => {
    if (!editingGift || !giftForm.gift_name.trim()) return;
    
    const updatedPresets = giftPresets.map(preset => 
      preset.id === editingGift.id 
        ? { ...preset, ...giftForm, gift_name: giftForm.gift_name.trim(), gift_description: giftForm.gift_description.trim() || undefined }
        : preset
    );
    
    setGiftPresets(updatedPresets);
    resetGiftForm();
  };

  const deleteGiftPreset = (id: string) => {
    setGiftPresets(giftPresets.filter(preset => preset.id !== id));
  };

  const startEditGift = (preset: GiftPreset) => {
    setEditingGift(preset);
    setGiftForm({
      gift_name: preset.gift_name,
      gift_description: preset.gift_description || "",
      gift_amount: preset.gift_amount,
      gift_value: preset.gift_value
    });
    setIsAddingGift(true);
  };

  const resetGiftForm = () => {
    setGiftForm({ gift_name: "", gift_description: "", gift_amount: 1, gift_value: 0 });
    setEditingGift(null);
    setIsAddingGift(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">{t("models")}</h1>
        <p className="text-charcoal-soft mt-2">{t("managePresets")}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            {t("taskPresets")}
          </TabsTrigger>
          <TabsTrigger value="gifts" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            {t("giftPresets")}
          </TabsTrigger>
        </TabsList>

        {/* Task Presets Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-charcoal-soft" />
              <Input
                placeholder="Buscar modelos de tarefas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
              />
            </div>
            <Button 
              onClick={() => setIsAddingTask(true)} 
              className="bg-brand text-white hover:bg-brand/90 shadow-elegant w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" /> {t("addTaskPreset")}
            </Button>
          </div>

          {/* Add/Edit Task Form */}
          {isAddingTask && (
            <Card className="border-charcoal-soft/20">
              <CardHeader>
                <CardTitle className="text-charcoal">
                  {editingTask ? t("editTaskPreset") : t("addTaskPreset")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-charcoal font-medium">{t("presetName")}</Label>
                    <Input 
                      value={taskForm.title} 
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
                      placeholder="Nome da tarefa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-charcoal font-medium">{t("presetCategory")}</Label>
                    <Input 
                      value={taskForm.category} 
                      onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                      className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
                      placeholder="Categoria"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-charcoal font-medium">{t("presetMonthsBefore")}</Label>
                    <Input 
                      type="number"
                      min="0"
                      step="0.5"
                      value={taskForm.monthsBefore} 
                      onChange={(e) => setTaskForm({ ...taskForm, monthsBefore: parseFloat(e.target.value) || 0 })}
                      className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-charcoal font-medium">{t("presetDescription")}</Label>
                  <Textarea 
                    value={taskForm.description} 
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
                    rows={3}
                    placeholder="Descrição opcional..."
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="outline" onClick={resetTaskForm} className="border-charcoal-soft/20 text-charcoal hover:bg-beige order-2 sm:order-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={editingTask ? editTaskPreset : addTaskPreset}
                    className="bg-brand text-white hover:bg-brand/90 shadow-elegant order-1 sm:order-2"
                  >
                    {editingTask ? "Salvar" : t("addTaskPreset")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Task Presets Table */}
          {filteredTaskPresets.length > 0 ? (
            <Card className="border-charcoal-soft/20">
              <CardContent className="p-0">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <TableHead className="text-gray-700 font-semibold">Tarefa</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Categoria</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Meses Antes</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Descrição</TableHead>
                        <TableHead className="w-[100px] text-gray-600 font-semibold">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTaskPresets.map((preset, index) => (
                        <TableRow key={preset.id} className={`border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                          <TableCell className="py-4">
                            <div className="font-medium text-gray-800">{preset.title}</div>
                          </TableCell>
                          <TableCell className="text-gray-600 py-4">
                            <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                              {preset.category}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-600 py-4">
                            {preset.monthsBefore} {preset.monthsBefore === 1 ? 'mês' : 'meses'}
                          </TableCell>
                          <TableCell className="text-gray-600 py-4">
                            {preset.description || (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => startEditTask(preset)}
                                className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => deleteTaskPreset(preset.id)}
                                className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3 p-4">
                  {filteredTaskPresets.map((preset, index) => (
                    <div key={preset.id} className={`p-4 rounded-lg border ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 text-sm mb-1">{preset.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                              {preset.category}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs">
                              {preset.monthsBefore} {preset.monthsBefore === 1 ? 'mês' : 'meses'}
                            </span>
                          </div>
                          {preset.description && (
                            <p className="text-gray-600 text-xs">{preset.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => startEditTask(preset)}
                            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 h-8 w-8"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteTaskPreset(preset.id)}
                            className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 h-8 w-8"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-charcoal-soft/20">
              <CardContent className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t("noPresetsYet")}</h3>
                  <p className="text-gray-500 mb-6">{t("createYourFirstPreset")}</p>
                  <Button 
                    onClick={() => setIsAddingTask(true)} 
                    className="bg-brand text-white hover:bg-brand/90 shadow-elegant"
                  >
                    <Plus className="h-4 w-4 mr-2" /> {t("addTaskPreset")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Gift Presets Tab */}
        <TabsContent value="gifts" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-charcoal-soft" />
              <Input
                placeholder="Buscar modelos de presentes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
              />
            </div>
            <Button 
              onClick={() => setIsAddingGift(true)} 
              className="bg-brand text-white hover:bg-brand/90 shadow-elegant w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" /> {t("addGiftPreset")}
            </Button>
          </div>

          {/* Add/Edit Gift Form */}
          {isAddingGift && (
            <Card className="border-charcoal-soft/20">
              <CardHeader>
                <CardTitle className="text-charcoal">
                  {editingGift ? t("editGiftPreset") : t("addGiftPreset")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-charcoal font-medium">{t("presetName")}</Label>
                    <Input 
                      value={giftForm.gift_name} 
                      onChange={(e) => setGiftForm({ ...giftForm, gift_name: e.target.value })}
                      className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
                      placeholder="Nome do presente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-charcoal font-medium">{t("presetValue")} (R$)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      min="0"
                      value={giftForm.gift_value} 
                      onChange={(e) => setGiftForm({ ...giftForm, gift_value: parseFloat(e.target.value) || 0 })}
                      className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-charcoal font-medium">{t("presetAmount")}</Label>
                    <Input 
                      type="number"
                      min="1"
                      value={giftForm.gift_amount} 
                      onChange={(e) => setGiftForm({ ...giftForm, gift_amount: parseInt(e.target.value) || 1 })}
                      className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-charcoal font-medium">{t("presetDescription")}</Label>
                  <Textarea 
                    value={giftForm.gift_description} 
                    onChange={(e) => setGiftForm({ ...giftForm, gift_description: e.target.value })}
                    className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
                    rows={3}
                    placeholder="Descrição opcional..."
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="outline" onClick={resetGiftForm} className="border-charcoal-soft/20 text-charcoal hover:bg-beige order-2 sm:order-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={editingGift ? editGiftPreset : addGiftPreset}
                    className="bg-brand text-white hover:bg-brand/90 shadow-elegant order-1 sm:order-2"
                  >
                    {editingGift ? "Salvar" : t("addGiftPreset")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gift Presets Table */}
          {filteredGiftPresets.length > 0 ? (
            <Card className="border-charcoal-soft/20">
              <CardContent className="p-0">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <TableHead className="text-gray-700 font-semibold">Presente</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Descrição</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Quantidade</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Valor</TableHead>
                        <TableHead className="w-[100px] text-gray-600 font-semibold">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGiftPresets.map((preset, index) => (
                        <TableRow key={preset.id} className={`border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                          <TableCell className="py-4">
                            <div className="font-medium text-gray-800">{preset.gift_name}</div>
                          </TableCell>
                          <TableCell className="text-gray-600 py-4">
                            {preset.gift_description || (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-600 py-4">
                            <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                              {preset.gift_amount}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-600 py-4">
                            <span className="font-medium text-green-700">
                              {formatCurrency(preset.gift_value)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => startEditGift(preset)}
                                className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => deleteGiftPreset(preset.id)}
                                className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3 p-4">
                  {filteredGiftPresets.map((preset, index) => (
                    <div key={preset.id} className={`p-4 rounded-lg border ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 text-sm mb-1">{preset.gift_name}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                              Qtd: {preset.gift_amount}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs">
                              {formatCurrency(preset.gift_value)}
                            </span>
                          </div>
                          {preset.gift_description && (
                            <p className="text-gray-600 text-xs">{preset.gift_description}</p>
                          )}
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => startEditGift(preset)}
                            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 h-8 w-8"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteGiftPreset(preset.id)}
                            className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 h-8 w-8"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-charcoal-soft/20">
              <CardContent className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t("noPresetsYet")}</h3>
                  <p className="text-gray-500 mb-6">{t("createYourFirstPreset")}</p>
                  <Button 
                    onClick={() => setIsAddingGift(true)} 
                    className="bg-brand text-white hover:bg-brand/90 shadow-elegant"
                  >
                    <Plus className="h-4 w-4 mr-2" /> {t("addGiftPreset")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
