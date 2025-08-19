import { useEffect, useMemo, useState, useCallback } from "react";
import { listTasks, createTask, createTasksBatch, updateTask, deleteTask } from "@/services/tasks";
import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { t } from "@/lib/translations";
import { Plus, Trash2, Check, Edit2, ArrowUpDown, ArrowUp, ArrowDown, Calendar, Sparkles } from "lucide-react";

// Preset tasks data
const PRESET_TASKS = [
	// 12 meses antes
	{ title: "Escolher Espaço Cerimônia", monthsBefore: 12, category: "Local" },
	{ title: "Escolher Espaço da Recepção e Festa", monthsBefore: 12, category: "Local" },
	{ title: "Escolher Buffet", monthsBefore: 12, category: "Alimentação" },
	{ title: "Fazer Site", monthsBefore: 12, category: "Digital" },
	{ title: "Contratar Assessoria e Cerimonial", monthsBefore: 12, category: "Serviços" },
	{ title: "Alimentação Staffs", monthsBefore: 12, category: "Alimentação" },
	
	// 11 meses antes
	{ title: "Contratar Decoração", monthsBefore: 11, category: "Decoração" },
	
	// 10 meses antes
	{ title: "Contratar Fotografia", monthsBefore: 10, category: "Fotografia" },
	{ title: "Contratar Filmagem", monthsBefore: 10, category: "Filmagem" },
	
	// 9 meses antes
	{ title: "Contratar Músicos para Cerimônia", monthsBefore: 9, category: "Música" },
	{ title: "Contratar DJ", monthsBefore: 9, category: "Música" },
	{ title: "Alugar Vestido", monthsBefore: 9, category: "Vestuário" },
	{ title: "Maquiagem e Cabelo", monthsBefore: 9, category: "Beleza" },
	{ title: "Contratar Pista de Led", monthsBefore: 9, category: "Decoração" },
	{ title: "Contratar Telão", monthsBefore: 9, category: "Tecnologia" },
	
	// 8 meses antes
	{ title: "Contratar Banda", monthsBefore: 8, category: "Música" },
	{ title: "Contratar Celebrante", monthsBefore: 8, category: "Cerimônia" },
	
	// 7 meses antes
	{ title: "Alugar Acessórios", monthsBefore: 7, category: "Vestuário" },
	{ title: "Contratar Doces", monthsBefore: 7, category: "Alimentação" },
	{ title: "Contratar Bolo", monthsBefore: 7, category: "Alimentação" },
	{ title: "Contratar Bolo Fake", monthsBefore: 7, category: "Alimentação" },
	{ title: "Contratar Bartender", monthsBefore: 7, category: "Alimentação" },
	
	// 6 meses antes
	{ title: "Contratar Bebidas e Garçons", monthsBefore: 6, category: "Alimentação" },
	{ title: "Contratar Bem-Casados", monthsBefore: 6, category: "Alimentação" },
	{ title: "Traje Noivo", monthsBefore: 6, category: "Vestuário" },
	{ title: "Entrega Convites", monthsBefore: 6, category: "Convites" },
	{ title: "Fazer lista presentes Site", monthsBefore: 6, category: "Digital" },
	
	// 5 meses antes
	{ title: "Contratar Iluminação", monthsBefore: 5, category: "Decoração" },
	{ title: "Contratar Animação", monthsBefore: 5, category: "Entretenimento" },
	{ title: "Tenda", monthsBefore: 5, category: "Local" },
	
	// 4 meses antes
	{ title: "Contratar Carro para Noiva", monthsBefore: 4, category: "Transporte" },
	{ title: "Comprar Lembrancinhas", monthsBefore: 4, category: "Lembrancinhas" },
	{ title: "Contratar Gerador de Energia", monthsBefore: 4, category: "Infraestrutura" },
	{ title: "Contratar Recreadores", monthsBefore: 4, category: "Entretenimento" },
	
	// 3 meses antes
	{ title: "Comprar Chinelos", monthsBefore: 3, category: "Vestuário" },
	{ title: "Contratar Lanche da Madrugada", monthsBefore: 3, category: "Alimentação" },
	{ title: "Aluguel de Louças", monthsBefore: 3, category: "Infraestrutura" },
	{ title: "Marcar Pré Wedding", monthsBefore: 3, category: "Fotografia" },
	{ title: "Degustações", monthsBefore: 3, category: "Alimentação" },
	{ title: "Entrega Convites Convidados", monthsBefore: 3, category: "Convites" },
	{ title: "Reservar Hotel Perto do Local da Cerimônia", monthsBefore: 3, category: "Hospedagem" },
	
	// 2 meses antes
	{ title: "Contratar Papelaria", monthsBefore: 2, category: "Papelaria" },
	{ title: "Comprar Porta Aliança", monthsBefore: 2, category: "Cerimônia" },
	{ title: "Comprar Topo de Bolo", monthsBefore: 2, category: "Decoração" },
	{ title: "Contratar Coreógrafa", monthsBefore: 2, category: "Entretenimento" },
	{ title: "Escolher Modelo Bouquet", monthsBefore: 2, category: "Decoração" },
	
	// 1 mês antes
	{ title: "Comprar Saída Igreja", monthsBefore: 1, category: "Vestuário" },
	{ title: "Kit Toilet", monthsBefore: 1, category: "Beleza" },
	{ title: "Barbeiro", monthsBefore: 1, category: "Beleza" },
	{ title: "Comprar ou Polir Alianças", monthsBefore: 1, category: "Cerimônia" },
	{ title: "Fazer Lista e Importar Pro Site", monthsBefore: 1, category: "Digital" },
	{ title: "Contratar Serviços Gerais", monthsBefore: 1, category: "Serviços" },
	{ title: "Contratar Seguranças", monthsBefore: 1, category: "Segurança" },
	{ title: "Fazer Mapa de Mesa", monthsBefore: 1, category: "Organização" },
	{ title: "Escolher Músicas Principais", monthsBefore: 1, category: "Música" },
	{ title: "Escolher Ordem de Padrinhos", monthsBefore: 1, category: "Cerimônia" },
	
	// 2 semanas antes
	{ title: "Teste de Cabelo e Maquiagem", monthsBefore: 0.5, category: "Beleza" },
];

// Helper function to calculate date based on event date and months before
const calculateDueDate = (eventDate: string, monthsBefore: number): string => {
	const event = new Date(eventDate);
	const dueDate = new Date(event);
	dueDate.setMonth(event.getMonth() - monthsBefore);
	return dueDate.toISOString().split('T')[0];
};

interface Props { 
	weddingId: string;
	eventDate?: string | null;
}

export default function PlanejamentoTab({ weddingId, eventDate }: Props) {
	const [query, setQuery] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const [editingTask, setEditingTask] = useState<Tables<'tasks'> | null>(null);
	const [form, setForm] = useState({ 
		title: "", 
		due_date: "", 
		priority: "medium", 
		category: "",
		description: ""
	});

	// Sorting state
	const [sortField, setSortField] = useState<keyof Tables<'tasks'> | null>(null);
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

	// Simple state management for now
	const [tasks, setTasks] = useState<Tables<'tasks'>[]>([]);
	const [tasksLoading, setTasksLoading] = useState(false);
	const [presetLoading, setPresetLoading] = useState(false);
	
	const fetchTasks = useCallback(async () => {
		setTasksLoading(true);
		try {
			const result = await listTasks(weddingId);
			setTasks(result);
		} catch (error) {
			console.error("Error fetching tasks:", error);
		} finally {
			setTasksLoading(false);
		}
	}, [weddingId]);
	
	const refreshTasks = useCallback(() => {
		fetchTasks();
	}, [fetchTasks]);
	
	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return tasks;
		return tasks.filter((t) => 
			(t.title?.toLowerCase() ?? "").includes(q) || 
			(t.category?.toLowerCase() ?? "").includes(q) ||
			(t.description?.toLowerCase() ?? "").includes(q)
		);
	}, [tasks, query]);

	// Sort tasks based on current sort field and direction
	const sortedTasks = useMemo(() => {
		return [...filtered].sort((a, b) => {
			if (!sortField) {
				// Default sort by due date (earliest first)
				if (!a.due_date && !b.due_date) return 0;
				if (!a.due_date) return 1;
				if (!b.due_date) return -1;
				return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
			}

			const aValue = a[sortField];
			const bValue = b[sortField];

			// Handle null/undefined values
			if (!aValue && !bValue) return 0;
			if (!aValue) return sortDirection === 'asc' ? 1 : -1;
			if (!bValue) return sortDirection === 'asc' ? -1 : 1;

			// Handle date fields
			if (sortField === 'due_date') {
				const aDate = new Date(aValue as string).getTime();
				const bDate = new Date(bValue as string).getTime();
				return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
			}

			// Handle string fields
			const aStr = String(aValue).toLowerCase();
			const bStr = String(bValue).toLowerCase();
			
			if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
			if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
	}, [filtered, sortField, sortDirection]);

	const handleSort = (field: keyof Tables<'tasks'>) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	const getSortIcon = (field: keyof Tables<'tasks'>) => {
		if (sortField !== field) {
			return <ArrowUpDown className="h-4 w-4" />;
		}
		return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
	};

	const resetForm = () => {
		setForm({ title: "", due_date: "", priority: "medium", category: "", description: "" });
		setEditingTask(null);
		setIsAdding(false);
	};

	const onAdd = async () => {
		if (!form.title.trim()) return;
		
		const taskData = {
			title: form.title.trim(),
			due_date: form.due_date || null,
			priority: form.priority || null,
			category: form.category || null,
			description: form.description || null,
			completed: false,
		};

		const created = await createTask(weddingId, taskData);
		if (created) {
			resetForm();
			refreshTasks();
		}
	};

	const onEdit = async () => {
		if (!editingTask || !form.title.trim()) return;
		
		const updates = {
			title: form.title.trim(),
			due_date: form.due_date || null,
			priority: form.priority || null,
			category: form.category || null,
			description: form.description || null,
		};

		const success = await updateTask(editingTask.id, updates);
		if (success) {
			resetForm();
			refreshTasks();
		}
	};

	const startEdit = (task: Tables<'tasks'>) => {
		setEditingTask(task);
		setForm({
			title: task.title || "",
			due_date: task.due_date || "",
			priority: task.priority || "medium",
			category: task.category || "",
			description: task.description || ""
		});
		setIsAdding(true);
	};

	const toggleCompleted = async (task: Tables<'tasks'>) => {
		await updateTask(task.id, { completed: !task.completed });
		refreshTasks();
	};

	const remove = async (task: Tables<'tasks'>) => {
		await deleteTask(task.id);
		refreshTasks();
	};

	const handlePresetTasks = async () => {
		if (!eventDate) {
			alert("É necessário definir uma data para o evento para usar as tarefas pré-definidas.");
			return;
		}

		setPresetLoading(true);
		try {
			const tasksToCreate = PRESET_TASKS.map(preset => ({
				title: preset.title,
				due_date: calculateDueDate(eventDate, preset.monthsBefore),
				priority: "medium" as const,
				category: preset.category,
				description: `Tarefa pré-definida: ${preset.title}`,
				completed: false,
			}));

			const createdTasks = await createTasksBatch(weddingId, tasksToCreate);
			if (createdTasks.length > 0) {
				refreshTasks();
			}
		} catch (error) {
			console.error("Error creating preset tasks:", error);
			alert("Erro ao criar tarefas pré-definidas. Tente novamente.");
		} finally {
			setPresetLoading(false);
		}
	};

	const getPriorityColor = (priority: string | null) => {
		switch (priority) {
			case 'high': return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200';
			case 'medium': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200';
			case 'low': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200';
			default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200';
		}
	};

	const getPriorityText = (priority: string | null) => {
		switch (priority) {
			case 'high': return 'Alta';
			case 'medium': return 'Média';
			case 'low': return 'Baixa';
			default: return 'Não definida';
		}
	};

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="bg-gradient-to-r from-brand/5 to-brand/10 rounded-xl p-6 border border-brand/20">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
							<svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
							</svg>
						</div>
						<div>
							<h1 className="text-2xl font-bold text-charcoal">{t("organization")}</h1>
							<p className="text-charcoal-soft text-sm">Gerencie suas tarefas e organize seu evento</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="relative">
							<Input 
								placeholder={t("searchTasksPlaceholder")} 
								value={query} 
								onChange={(e) => setQuery(e.target.value)} 
								className="w-64 pl-10 border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80 backdrop-blur-sm" 
							/>
							<svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
						<Button 
							onClick={() => setIsAdding(true)} 
							className="bg-gradient-to-r from-brand to-brand/80 text-white hover:from-brand/90 hover:to-brand/70 shadow-lg hover:shadow-xl transition-all duration-200 px-6"
						>
							<Plus className="h-4 w-4 mr-2" /> {t("addTask")}
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
				<CardContent className="space-y-6">
					{isAdding && (
						<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50 shadow-lg">
							<div className="flex items-center gap-2 mb-4">
								<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
									<Plus className="w-4 h-4 text-blue-600" />
								</div>
								<h3 className="text-lg font-semibold text-charcoal">
									{editingTask ? "Editar Tarefa" : "Nova Tarefa"}
								</h3>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="text-charcoal font-medium">{t("title")}</Label>
									<Input 
										value={form.title} 
										onChange={(e) => setForm({ ...form, title: e.target.value })}
										className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
									/>
								</div>
								<div className="space-y-2">
									<Label className="text-charcoal font-medium">{t("date")}</Label>
									<Input 
										type="date" 
										value={form.due_date} 
										onChange={(e) => setForm({ ...form, due_date: e.target.value })}
										className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
									/>
								</div>
								<div className="space-y-2">
									<Label className="text-charcoal font-medium">{t("priority")}</Label>
									<Select 
										value={form.priority} 
										onValueChange={(value) => setForm({ ...form, priority: value })}
									>
										<SelectTrigger className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="low">Baixa</SelectItem>
											<SelectItem value="medium">Média</SelectItem>
											<SelectItem value="high">Alta</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label className="text-charcoal font-medium">{t("category")}</Label>
									<Input 
										value={form.category} 
										onChange={(e) => setForm({ ...form, category: e.target.value })}
										className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
									/>
								</div>
								<div className="md:col-span-2 space-y-2">
									<Label className="text-charcoal font-medium">Descrição</Label>
									<Textarea 
										value={form.description} 
										onChange={(e) => setForm({ ...form, description: e.target.value })}
										className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
										rows={3}
									/>
								</div>
							</div>
							<div className="flex justify-end gap-3 mt-6">
								<Button 
									variant="outline" 
									onClick={resetForm} 
									className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 px-6"
								>
									{t("cancel")}
								</Button>
								<Button 
									onClick={editingTask ? onEdit : onAdd} 
									className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 px-6"
								>
									{editingTask ? "Salvar" : t("addTask")}
								</Button>
							</div>
						</div>
					)}

					{tasksLoading ? (
						<div className="text-center py-12">
							<div className="inline-flex items-center gap-2 text-charcoal-soft">
								<div className="w-6 h-6 border-2 border-brand/20 border-t-brand rounded-full animate-spin"></div>
								<p>Carregando tarefas...</p>
							</div>
						</div>
					) : sortedTasks.length > 0 ? (
						<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
							<Table>
								<TableHeader>
									<TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
									<TableHead className="w-[60px] text-gray-600 font-semibold"></TableHead>
									<TableHead 
										className="text-gray-700 font-semibold cursor-pointer hover:bg-gray-200/50 transition-all duration-200 py-4"
										onClick={() => handleSort('title')}
									>
										<div className="flex items-center gap-2">
											{t("title")}
											{getSortIcon('title')}
										</div>
									</TableHead>
									<TableHead 
										className="text-gray-700 font-semibold cursor-pointer hover:bg-gray-200/50 transition-all duration-200 py-4"
										onClick={() => handleSort('due_date')}
									>
										<div className="flex items-center gap-2">
											{t("date")}
											{getSortIcon('due_date')}
										</div>
									</TableHead>
									<TableHead 
										className="text-gray-700 font-semibold cursor-pointer hover:bg-gray-200/50 transition-all duration-200 py-4"
										onClick={() => handleSort('priority')}
									>
										<div className="flex items-center gap-2">
											{t("priority")}
											{getSortIcon('priority')}
										</div>
									</TableHead>
									<TableHead 
										className="text-gray-700 font-semibold cursor-pointer hover:bg-gray-200/50 transition-all duration-200 py-4"
										onClick={() => handleSort('category')}
									>
										<div className="flex items-center gap-2">
											{t("category")}
											{getSortIcon('category')}
										</div>
									</TableHead>
									<TableHead className="w-[120px] text-gray-600 font-semibold">Ações</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sortedTasks.map((task, index) => (
								<TableRow key={task.id} className={`border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
									<TableCell className="text-center py-4">
										<button 
											onClick={() => toggleCompleted(task)} 
											className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
												task.completed 
													? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-md' 
													: 'border-gray-300 hover:border-green-400 hover:bg-green-50'
											}`}
										>
											{task.completed && <Check className="w-4 h-4" />}
										</button>
									</TableCell>
									<TableCell className={`py-4 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
										<div>
											<div className="font-medium">{task.title}</div>
											{task.description && (
												<div className="text-sm text-gray-500 mt-1">
													{task.description}
												</div>
											)}
										</div>
									</TableCell>
									<TableCell className="text-gray-600 py-4">
										{task.due_date ? (
											<span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
												<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
												{new Date(task.due_date).toLocaleDateString('pt-BR')}
											</span>
										) : (
											<span className="text-gray-400">-</span>
										)}
									</TableCell>
									<TableCell className="py-4">
										<span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getPriorityColor(task.priority)}`}>
											{getPriorityText(task.priority)}
										</span>
									</TableCell>
									<TableCell className="text-gray-600 py-4">
										{task.category ? (
											<span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-sm">
												{task.category}
											</span>
										) : (
											<span className="text-gray-400">-</span>
										)}
									</TableCell>
									<TableCell className="text-right py-4">
										<div className="flex gap-2">
											<Button 
												variant="ghost" 
												size="icon" 
												onClick={() => startEdit(task)}
												className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
											>
												<Edit2 className="w-4 h-4" />
											</Button>
											<Button 
												variant="ghost" 
												size="icon" 
												onClick={() => remove(task)}
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
					) : (
						<div className="text-center py-16">
							<div className="max-w-md mx-auto">
								<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
									</svg>
								</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
								<p className="text-gray-500 mb-6">Escolha como você quer começar a organizar seu evento:</p>
								<div className="flex flex-col sm:flex-row gap-3 justify-center">
									<Button 
										onClick={() => setIsAdding(true)} 
										className="bg-gradient-to-r from-brand to-brand/80 text-white hover:from-brand/90 hover:to-brand/70 shadow-lg hover:shadow-xl transition-all duration-200"
									>
										<Plus className="h-4 w-4 mr-2" /> {t("addTask")}
									</Button>
									<Button 
										onClick={handlePresetTasks}
										disabled={presetLoading || !eventDate}
										className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200"
									>
										<Sparkles className="h-4 w-4 mr-2" />
										{presetLoading ? "Criando..." : t("startWithPreset")}
									</Button>
								</div>
								{!eventDate && (
									<p className="text-sm text-orange-600 mt-3">
										⚠️ É necessário definir uma data para o evento para usar as tarefas pré-definidas.
									</p>
								)}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
