import { api } from "@/lib/api";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export async function listVendors(weddingId: string): Promise<Tables<'vendors'>[]> {
	try {
		return await api.listVendors(weddingId);
	} catch (error) {
		console.error("Error listing vendors:", error);
		return [];
	}
}

export async function createVendor(weddingId: string, input: Omit<TablesInsert<'vendors'>,'wedding_id'>): Promise<Tables<'vendors'> | null> {
	try {
		return await api.createVendor(weddingId, input);
	} catch (error) {
		console.error("Error creating vendor:", error);
		return null;
	}
}

export async function updateVendor(id: string, updates: TablesUpdate<'vendors'>): Promise<boolean> {
	try {
		// Note: updateVendor not implemented in api layer yet
		// You can add it to the api layer if needed
		console.warn("updateVendor not implemented in API layer");
		return false;
	} catch (error) {
		console.error("Error updating vendor:", error);
		return false;
	}
}

export async function deleteVendor(id: string): Promise<boolean> {
	try {
		return await api.deleteVendor(id);
	} catch (error) {
		console.error("Error deleting vendor:", error);
		return false;
	}
}
