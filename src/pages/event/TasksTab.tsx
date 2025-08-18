import { useEffect, useMemo, useState } from "react";
import { listTasks, createTask, updateTask, deleteTask } from "@/services/tasks";
import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { t } from "@/lib/translations";
import { Plus, Trash2, Check, Clock } from "lucide-react";

interface Props { weddingId: string }

export default function TasksTab({ weddingId }: Props) {
	const [tasks, setTasks] = useState<Tables<'tasks'>[]>([]);
	const [query, setQuery] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const [form, setForm] = useState({ title: "", due_date: "", priority: "medium", category: "" });
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		refresh();
	}, [weddingId]);

	const refresh = async () => {
		const data = await listTasks(weddingId);
		setTasks(data);
	};

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
			refresh();
		}
	};

	const toggleCompleted = async (task: Tables<'tasks'>) => {
		await updateTask(task.id, { completed: !task.completed });
		refresh();
	};

	const remove = async (task: Tables<'tasks'>) => {
		await deleteTask(task.id);
		refresh();
	};

	return (
		<div className="space-y-4">
			<Card className="shadow-card border-0">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between gap-2">
						<CardTitle>{t("organization")}</CardTitle>
						<div className="flex items-center gap-2">
							<Input placeholder={t("searchTasksPlaceholder")} value={query} onChange={(e) => setQuery(e.target.value)} className="w-64" />
							<Button onClick={() => setIsAdding((v) => !v)} className="gradient-primary text-white">
								<Plus className="h-4 w-4 mr-2" /> {t("addTask")}
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{isAdding && (
						<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
							<div className="space-y-1">
								<Label>{t("title")}</Label>
								<Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
							</div>
							<div className="space-y-1">
								<Label>{t("date")}</Label>
								<Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
							</div>
							<div className="space-y-1">
								<Label>{t("priority")}</Label>
								<Input value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
							</div>
							<div className="space-y-1">
								<Label>{t("category")}</Label>
								<Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
							</div>
							<div className="md:col-span-4 flex justify-end gap-2">
								<Button variant="outline" onClick={() => setIsAdding(false)}>{t("cancel")}</Button>
								<Button onClick={onAdd} disabled={loading} className="gradient-primary text-white">{t("addTask")}</Button>
							</div>
						</div>
					)}

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[60px]"></TableHead>
								<TableHead>{t("title")}</TableHead>
								<TableHead>{t("date")}</TableHead>
								<TableHead className="w-[120px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.map((task) => (
								<TableRow key={task.id}>
									<TableCell className="text-center">
										<button onClick={() => toggleCompleted(task)} className={`w-6 h-6 rounded border flex items-center justify-center ${task.completed ? 'bg-primary text-white border-primary' : 'border-muted-foreground'}`}>
											{task.completed ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
										</button>
									</TableCell>
									<TableCell className={task.completed ? 'line-through text-muted-foreground' : ''}>{task.title}</TableCell>
									<TableCell>{task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : '-'}</TableCell>
									<TableCell className="text-right">
										<Button variant="ghost" size="icon" onClick={() => remove(task)}>
											<Trash2 className="w-4 h-4" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
