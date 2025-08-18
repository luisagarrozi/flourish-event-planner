import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { getCurrentUser } from "./auth";

export async function listVendors(weddingId: string): Promise<Tables<'vendors'>[]> {
	const user = await getCurrentUser();
	if (!user) return [];
	const { data, error } = await supabase
		.from('vendors')
		.select('*')
		.eq('wedding_id', weddingId)
		.order('created_at', { ascending: false });
	if (error) {
		console.error('Error listing vendors:', error.message);
		return [];
	}
	return data ?? [];
}

export async function createVendor(weddingId: string, input: Omit<TablesInsert<'vendors'>,'wedding_id'>): Promise<Tables<'vendors'> | null> {
	const user = await getCurrentUser();
	if (!user) return null;
	const payload: TablesInsert<'vendors'> = { ...input, wedding_id: weddingId };
	const { data, error } = await supabase
		.from('vendors')
		.insert(payload)
		.select('*')
		.single();
	if (error) {
		console.error('Error creating vendor:', error.message);
		return null;
	}
	return data;
}

export async function updateVendor(id: string, updates: TablesUpdate<'vendors'>): Promise<boolean> {
	const user = await getCurrentUser();
	if (!user) return false;
	const { error } = await supabase
		.from('vendors')
		.update(updates)
		.eq('id', id);
	if (error) {
		console.error('Error updating vendor:', error.message);
		return false;
	}
	return true;
}

export async function deleteVendor(id: string): Promise<boolean> {
	const user = await getCurrentUser();
	if (!user) return false;
	const { error } = await supabase
		.from('vendors')
		.delete()
		.eq('id', id);
	if (error) {
		console.error('Error deleting vendor:', error.message);
		return false;
	}
	return true;
}
