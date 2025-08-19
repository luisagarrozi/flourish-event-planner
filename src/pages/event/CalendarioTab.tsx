import { useEffect, useMemo, useState, useCallback } from "react";
import { listTasks, createTask, createTasksBatch, updateTask, deleteTask } from "@/services/tasks";
import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { t } from "@/lib/translations";
import { Plus, Trash2, Check, Calendar, List } from "lucide-react";
import { useApiCache } from "@/hooks/use-api-cache";

interface Props { 
	weddingId: string;
	eventDate?: string | null;
}

// Preset tasks with their relative timing
const PRESET_TASKS = [
	{
		monthsBefore: 12,
		tasks: [
			{ title: "Escolher Espaço Cerimônia", category: "Local" },
			{ title: "Escolher Espaço da Recepção e Festa", category: "Local" },
			{ title: "Escolher Buffet", category: "Local" },
			{ title: "Fazer Site", category: "Outros" },
			{ title: "Contratar Assessoria e Cerimonial", category: "Outros" },
			{ title: "Alimentação Staffs", category: "Local" }
		]
	},
	{
		monthsBefore: 11,
		tasks: [
			{ title: "Contratar Decoração", category: "Local" }
		]
	},
	{
		monthsBefore: 10,
		tasks: [
			{ title: "Contratar Fotografia", category: "Outros" },
			{ title: "Contratar Filmagem", category: "Outros" }
		]
	},
	{
		monthsBefore: 9,
		tasks: [
			{ title: "Contratar Músicos para Cerimônia", category: "Outros" },
			{ title: "Contratar DJ", category: "Outros" },
			{ title: "Alugar Vestido", category: "Noiva" },
			{ title: "Maquiagem e Cabelo", category: "Noiva" },
			{ title: "Contratar Pista de Led", category: "Local" },
			{ title: "Contratar Telão", category: "Local" }
		]
	},
	{
		monthsBefore: 8,
		tasks: [
			{ title: "Contratar Banda", category: "Outros" },
			{ title: "Contratar Celebrante", category: "Outros" }
		]
	},
	{
		monthsBefore: 7,
		tasks: [
			{ title: "Alugar Acessórios", category: "Noiva" },
			{ title: "Contratar Doces", category: "Local" },
			{ title: "Contratar Bolo", category: "Local" },
			{ title: "Contratar Bolo Fake", category: "Local" },
			{ title: "Contratar Bartender", category: "Local" }
		]
	},
	{
		monthsBefore: 6,
		tasks: [
			{ title: "Contratar Bebidas e Garçons", category: "Local" },
			{ title: "Contratar Bem-Casados", category: "Local" },
			{ title: "Traje Noivo", category: "Noivo" },
			{ title: "Entrega Convites", category: "Outros" },
			{ title: "Fazer lista presentes Site", category: "Outros" }
		]
	},
	{
		monthsBefore: 5,
		tasks: [
			{ title: "Contratar Iluminação", category: "Local" },
			{ title: "Contratar Animação", category: "Outros" },
			{ title: "Tenda", category: "Local" }
		]
	},
	{
		monthsBefore: 4,
		tasks: [
			{ title: "Contratar Carro para Noiva", category: "Noiva" },
			{ title: "Comprar Lembrancinhas", category: "Outros" },
			{ title: "Contratar Gerador de Energia", category: "Local" },
			{ title: "Contratar Recreadores", category: "Outros" }
		]
	},
	{
		monthsBefore: 3,
		tasks: [
			{ title: "Comprar Chinelos", category: "Noiva" },
			{ title: "Contratar Lanche da Madrugada", category: "Local" },
			{ title: "Aluguel de Louças", category: "Local" },
			{ title: "Marcar Pré Wedding", category: "Outros" },
			{ title: "Degustações", category: "Local" },
			{ title: "Entrega Convites Convidados", category: "Outros" },
			{ title: "Reservar Hotel Perto do Local da Cerimônia", category: "Outros" }
		]
	},
	{
		monthsBefore: 2,
		tasks: [
			{ title: "Contratar Papelaria", category: "Outros" },
			{ title: "Comprar Porta Aliança", category: "Outros" },
			{ title: "Comprar Topo de Bolo", category: "Local" },
			{ title: "Contratar Coreógrafa", category: "Outros" },
			{ title: "Escolher Modelo Bouquet", category: "Noiva" }
		]
	},
	{
		monthsBefore: 1,
		tasks: [
			{ title: "Comprar Saída Igreja", category: "Noiva" },
			{ title: "Kit Toilet", category: "Noiva" },
			{ title: "Barbeiro", category: "Noivo" },
			{ title: "Comprar ou Polir Alianças", category: "Outros" },
			{ title: "Fazer Lista e Importar Pro Site", category: "Outros" },
			{ title: "Contratar Serviços Gerais", category: "Outros" },
			{ title: "Contratar Segurannças", category: "Local" },
			{ title: "Fazer Mapa de Mesa", category: "Outros" },
			{ title: "Escolher Músicas Principais", category: "Outros" },
			{ title: "Escolher Ordem de Padrinhos", category: "Outros" }
		]
	},
	{
		weeksBefore: 2,
		tasks: [
			{ title: "Teste de Cabelo e Maquiagem", category: "Noiva" }
		]
	}
];

// Function to calculate date based on event date and months/weeks before
const calculateTaskDate = (eventDate: string, monthsBefore?: number, weeksBefore?: number): string => {
	const event = new Date(eventDate);
	
	if (monthsBefore) {
		const taskDate = new Date(event);
		taskDate.setMonth(event.getMonth() - monthsBefore);
		return taskDate.toISOString().split('T')[0];
	}
	
	if (weeksBefore) {
		const taskDate = new Date(event);
		taskDate.setDate(event.getDate() - (weeksBefore * 7));
		return taskDate.toISOString().split('T')[0];
	}
	
	return eventDate;
};

// Function to get relative time description
const getRelativeTimeDescription = (monthsBefore?: number, weeksBefore?: number): string => {
	if (monthsBefore) {
		if (monthsBefore === 1) return `1 ${t('monthBefore')}`;
		return `${monthsBefore} ${t('monthsBefore')}`;
	}
	if (weeksBefore) {
		if (weeksBefore === 1) return `1 ${t('weekBefore')}`;
		return `${weeksBefore} ${t('weeksBefore')}`;
	}
	return '';
};

export default function CalendarioTab({ weddingId, eventDate }: Props) {
	console.log("🔍 CalendarioTab: Component rendering with weddingId =", weddingId, "eventDate =", eventDate);
	
	const [query, setQuery] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const [showPresetOptions, setShowPresetOptions] = useState(false);
	const [form, setForm] = useState({ title: "", due_date: "", priority: "medium", category: "" });
	const [loading, setLoading] = useState(false);
	const [presetLoading, setPresetLoading] = useState(false);

	// Simple state management for now
	console.log("🔍 CalendarioTab: Setting up simple state for tasks");
	
	const [tasks, setTasks] = useState<Tables<'tasks'>[]>([]);
	const [tasksLoading, setTasksLoading] = useState(false);
	
	const fetchTasks = useCallback(async () => {
		console.log("🔍 CalendarioTab: Calling listTasks with weddingId =", weddingId);
		setTasksLoading(true);
		try {
			const result = await listTasks(weddingId);
			console.log("🔍 CalendarioTab: listTasks result =", result);
			setTasks(result);
		} catch (error) {
			console.error("🔍 CalendarioTab: Error fetching tasks:", error);
		} finally {
			setTasksLoading(false);
		}
	}, [weddingId]);
	
	const refreshTasks = useCallback(() => {
		fetchTasks();
	}, [fetchTasks]);
	
	useEffect(() => {
		console.log("🔍 CalendarioTab: useEffect triggered, fetching tasks");
		fetchTasks();
	}, [fetchTasks]);
	
	console.log("🔍 CalendarioTab: State result - tasks =", tasks, "loading =", tasksLoading);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return tasks;
		return tasks.filter((t) => (t.title?.toLowerCase() ?? "").includes(q) || (t.category?.toLowerCase() ?? "").includes(q));
	}, [tasks, query]);

	const onAdd = async () => {
		if (!form.title.trim()) return;
		setLoading(true);
		const created = await createTask(weddingId, {
			title: form.title.trim(),
			due_date: form.due_date || null,
			priority: form.priority || null,
			category: form.category || null,
			completed: false,
		});
		setLoading(false);
		if (created) {
			setIsAdding(false);
			setForm({ title: "", due_date: "", priority: "medium", category: "" });
			refreshTasks();
		}
	};

	const addPresetTasks = async () => {
		if (!eventDate) return;
		
		setPresetLoading(true);
		
		// Prepare all tasks in a single array for batch creation
		const allTasks = [];
		
		for (const preset of PRESET_TASKS) {
			const dueDate = calculateTaskDate(eventDate, preset.monthsBefore, preset.weeksBefore);
			
			for (const task of preset.tasks) {
				allTasks.push({
					title: task.title,
					due_date: dueDate,
					priority: "medium",
					category: task.category,
					completed: false,
				});
			}
		}
		
		// Create all tasks in a single batch API call
		const createdTasks = await createTasksBatch(weddingId, allTasks);
		
		setPresetLoading(false);
		if (createdTasks.length > 0) {
			setShowPresetOptions(false);
			refreshTasks();
		}
	};

	const toggleCompleted = async (task: Tables<'tasks'>) => {
		await updateTask(task.id, { completed: !task.completed });
		refreshTasks();
	};

	const remove = async (task: Tables<'tasks'>) => {
		await deleteTask(task.id);
		refreshTasks();
	};

	// Group tasks by category for better organization
	const groupedTasks = useMemo(() => {
		const groups: { [key: string]: Tables<'tasks'>[] } = {};
		filtered.forEach(task => {
			const category = task.category || 'Sem categoria';
			if (!groups[category]) {
				groups[category] = [];
			}
			groups[category].push(task);
		});
		
		// Sort tasks within each category by due date (earliest first)
		Object.keys(groups).forEach(category => {
			groups[category].sort((a, b) => {
				if (!a.due_date && !b.due_date) return 0;
				if (!a.due_date) return 1;
				if (!b.due_date) return -1;
				return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
			});
		});
		
		return groups;
	}, [filtered]);

	// Sort categories by the earliest due date in each category
	const sortedCategories = useMemo(() => {
		return Object.keys(groupedTasks).sort((a, b) => {
			const aEarliestTask = groupedTasks[a][0];
			const bEarliestTask = groupedTasks[b][0];
			
			if (!aEarliestTask?.due_date && !bEarliestTask?.due_date) return 0;
			if (!aEarliestTask?.due_date) return 1;
			if (!bEarliestTask?.due_date) return -1;
			
			return new Date(aEarliestTask.due_date).getTime() - new Date(bEarliestTask.due_date).getTime();
		});
	}, [groupedTasks]);

	return (
		<div className="space-y-4">
			<Card className="shadow-card border-0">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between gap-2">
						<CardTitle className="text-charcoal">{t("calendario")}</CardTitle>
						<div className="flex items-center gap-2">
							<Input 
								placeholder={t("searchTasksPlaceholder")} 
								value={query} 
								onChange={(e) => setQuery(e.target.value)} 
								className="w-64 border-charcoal-soft/20 focus:border-brand text-charcoal" 
							/>
							<Button onClick={() => setShowPresetOptions((v) => !v)} className="bg-brand text-white hover:bg-brand/90">
								<Plus className="h-4 w-4 mr-2" /> {t("addTask")}
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{showPresetOptions && (
						<div className="bg-beige/50 p-4 rounded-lg border border-charcoal-soft/20">
							<div className="flex items-center gap-2 mb-4">
								<Calendar className="h-5 w-5 text-charcoal" />
								<h3 className="font-semibold text-charcoal">{t("presetTasks")}</h3>
							</div>
							<div className="flex gap-3 mb-4">
								<Button 
									onClick={() => setIsAdding(true)} 
									variant="outline" 
									className="border-charcoal-soft/20 text-charcoal hover:bg-beige"
								>
									<Plus className="h-4 w-4 mr-2" /> {t("addTaskManually")}
								</Button>
								<Button 
									onClick={addPresetTasks} 
									disabled={presetLoading || !eventDate}
									className="bg-brand text-white hover:bg-brand/90"
								>
									<List className="h-4 w-4 mr-2" /> {t("usePreset")}
								</Button>
							</div>
							{!eventDate && (
								<p className="text-sm text-charcoal-soft">
									Para usar a lista pré-definida, é necessário definir uma data para o evento.
								</p>
							)}
						</div>
					)}

					{isAdding && (
						<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
							<div className="space-y-1">
								<Label className="text-charcoal">{t("title")}</Label>
								<Input 
									value={form.title} 
									onChange={(e) => setForm({ ...form, title: e.target.value })}
									className="border-charcoal-soft/20 focus:border-brand text-charcoal"
								/>
							</div>
							<div className="space-y-1">
								<Label className="text-charcoal">{t("date")}</Label>
								<Input 
									type="date" 
									value={form.due_date} 
									onChange={(e) => setForm({ ...form, due_date: e.target.value })}
									className="border-charcoal-soft/20 focus:border-brand text-charcoal"
								/>
							</div>
							<div className="space-y-1">
								<Label className="text-charcoal">{t("priority")}</Label>
								<Input 
									value={form.priority} 
									onChange={(e) => setForm({ ...form, priority: e.target.value })}
									className="border-charcoal-soft/20 focus:border-brand text-charcoal"
								/>
							</div>
							<div className="space-y-1">
								<Label className="text-charcoal">{t("category")}</Label>
								<Input 
									value={form.category} 
									onChange={(e) => setForm({ ...form, category: e.target.value })}
									className="border-charcoal-soft/20 focus:border-brand text-charcoal"
								/>
							</div>
							<div className="md:col-span-4 flex justify-end gap-2">
								<Button variant="outline" onClick={() => setIsAdding(false)} className="border-charcoal-soft/20 text-charcoal hover:bg-beige">
									{t("cancel")}
								</Button>
								<Button onClick={onAdd} disabled={loading} className="bg-brand text-white hover:bg-brand/90">
									{t("addTask")}
								</Button>
							</div>
						</div>
					)}

					{tasksLoading ? (
						<div className="text-center py-8 text-charcoal-soft">
							<p>Carregando tarefas...</p>
						</div>
					) : sortedCategories.length > 0 ? (
						sortedCategories.map((category) => (
							<div key={category} className="space-y-2">
								<h3 className="font-semibold text-charcoal text-lg">{category}</h3>
								<Table>
									<TableHeader>
										<TableRow className="border-charcoal-soft/20">
											<TableHead className="w-[60px] text-charcoal"></TableHead>
											<TableHead className="text-charcoal">{t("title")}</TableHead>
											<TableHead className="text-charcoal">{t("date")}</TableHead>
											<TableHead className="w-[120px] text-charcoal"></TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{groupedTasks[category].map((task) => (
											<TableRow key={task.id} className="border-charcoal-soft/10">
												<TableCell className="text-center">
													<button 
														onClick={() => toggleCompleted(task)} 
														className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
															task.completed 
																? 'bg-brand text-white border-brand' 
																: 'border-charcoal-soft hover:border-brand'
														}`}
													>
														{task.completed && <Check className="w-4 h-4" />}
													</button>
												</TableCell>
												<TableCell className={task.completed ? 'line-through text-charcoal-soft' : 'text-charcoal'}>
													{task.title}
												</TableCell>
												<TableCell className="text-charcoal-soft">
													{task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : '-'}
												</TableCell>
												<TableCell className="text-right">
													<Button 
														variant="ghost" 
														size="icon" 
														onClick={() => remove(task)}
														className="text-charcoal-soft hover:text-red-500 hover:bg-red-50"
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						))
					) : (
						<div className="text-center py-8 text-charcoal-soft">
							<p>Nenhuma tarefa encontrada. Clique em "Adicionar tarefa" para começar.</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
