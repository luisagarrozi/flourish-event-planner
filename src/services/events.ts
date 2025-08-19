import { api } from "@/lib/api";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export async function listEvents(): Promise<Tables<'weddings'>[]> {
	try {
		return await api.listEvents();
	} catch (error) {
		console.error("Error listing events:", error);
		return [];
	}
}

export async function getEvent(id: string): Promise<Tables<'weddings'> | null> {
	console.log("🔍 events service: getEvent called with id =", id);
	try {
		const result = await api.getEvent(id);
		console.log("🔍 events service: getEvent result =", result);
		return result;
	} catch (error) {
		console.error("🔍 events service: Error fetching event:", error);
		return null;
	}
}

export async function createEvent(input: Omit<TablesInsert<'weddings'>, 'user_id' | 'budget'>): Promise<Tables<'weddings'> | null> {
	try {
		return await api.createEvent(input as Omit<TablesInsert<'weddings'>, 'user_id' | 'budget'>);
	} catch (error) {
		console.error("Error creating event:", error);
		return null;
	}
}


