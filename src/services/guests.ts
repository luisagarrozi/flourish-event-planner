import { api } from "@/lib/api";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export async function listGuests(weddingId: string): Promise<Tables<'guests'>[]> {
	try {
		return await api.listGuests(weddingId);
	} catch (error) {
		console.error("Error listing guests:", error);
		return [];
	}
}

export async function createGuest(weddingId: string, input: Omit<TablesInsert<'guests'>,'wedding_id'>): Promise<Tables<'guests'> | null> {
	try {
		return await api.createGuest(weddingId, input);
	} catch (error) {
		console.error("Error creating guest:", error);
		return null;
	}
}

export async function updateGuest(id: string, updates: TablesUpdate<'guests'>): Promise<boolean> {
	try {
		// Note: updateGuest not implemented in api layer yet
		// You can add it to the api layer if needed
		console.warn("updateGuest not implemented in API layer");
		return false;
	} catch (error) {
		console.error("Error updating guest:", error);
		return false;
	}
}

export async function deleteGuest(id: string): Promise<boolean> {
	try {
		return await api.deleteGuest(id);
	} catch (error) {
		console.error("Error deleting guest:", error);
		return false;
	}
}
