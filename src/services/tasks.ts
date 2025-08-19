import { api } from "@/lib/api";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export async function listTasks(weddingId: string): Promise<Tables<'tasks'>[]> {
	console.log("🔍 tasks service: listTasks called with weddingId =", weddingId);
	try {
		const result = await api.listTasks(weddingId);
		console.log("🔍 tasks service: listTasks result =", result);
		return result;
	} catch (error) {
		console.error("🔍 tasks service: Error listing tasks:", error);
		return [];
	}
}

export async function createTask(weddingId: string, input: Omit<TablesInsert<'tasks'>,'wedding_id'>): Promise<Tables<'tasks'> | null> {
	try {
		return await api.createTask(weddingId, input);
	} catch (error) {
		console.error("Error creating task:", error);
		return null;
	}
}

export async function createTasksBatch(weddingId: string, inputs: Omit<TablesInsert<'tasks'>,'wedding_id'>[]): Promise<Tables<'tasks'>[]> {
	try {
		return await api.createTasksBatch(weddingId, inputs);
	} catch (error) {
		console.error("Error creating tasks batch:", error);
		return [];
	}
}

export async function updateTask(id: string, updates: TablesUpdate<'tasks'>): Promise<boolean> {
	try {
		return await api.updateTask(id, updates);
	} catch (error) {
		console.error("Error updating task:", error);
		return false;
	}
}

export async function deleteTask(id: string): Promise<boolean> {
	try {
		return await api.deleteTask(id);
	} catch (error) {
		console.error("Error deleting task:", error);
		return false;
	}
}
