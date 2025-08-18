import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { getCurrentUser } from "./auth";

export async function listTasks(weddingId: string): Promise<Tables<'tasks'>[]> {
	const user = await getCurrentUser();
	if (!user) return [];
	const { data, error } = await supabase
		.from('tasks')
		.select('*')
		.eq('wedding_id', weddingId)
		.order('created_at', { ascending: false });
	if (error) {
		console.error('Error listing tasks:', error.message);
		return [];
	}
	return data ?? [];
}

export async function createTask(weddingId: string, input: Omit<TablesInsert<'tasks'>,'wedding_id'>): Promise<Tables<'tasks'> | null> {
	const user = await getCurrentUser();
	if (!user) return null;
	const payload: TablesInsert<'tasks'> = { ...input, wedding_id: weddingId };
	const { data, error } = await supabase
		.from('tasks')
		.insert(payload)
		.select('*')
		.single();
	if (error) {
		console.error('Error creating task:', error.message);
		return null;
	}
	return data;
}

export async function updateTask(id: string, updates: TablesUpdate<'tasks'>): Promise<boolean> {
	const user = await getCurrentUser();
	if (!user) return false;
	const { error } = await supabase
		.from('tasks')
		.update(updates)
		.eq('id', id);
	if (error) {
		console.error('Error updating task:', error.message);
		return false;
	}
	return true;
}

export async function deleteTask(id: string): Promise<boolean> {
	const user = await getCurrentUser();
	if (!user) return false;
	const { error } = await supabase
		.from('tasks')
		.delete()
		.eq('id', id);
	if (error) {
		console.error('Error deleting task:', error.message);
		return false;
	}
	return true;
}
