import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { getCurrentUser } from "./auth";

export async function listGuests(weddingId: string): Promise<Tables<'guests'>[]> {
	const user = await getCurrentUser();
	if (!user) return [];
	const { data, error } = await supabase
		.from('guests')
		.select('*')
		.eq('wedding_id', weddingId)
		.order('created_at', { ascending: false });
	if (error) {
		console.error('Error listing guests:', error.message);
		return [];
	}
	return data ?? [];
}

export async function createGuest(weddingId: string, input: Omit<TablesInsert<'guests'>,'wedding_id'>): Promise<Tables<'guests'> | null> {
	const user = await getCurrentUser();
	if (!user) return null;
	const payload: TablesInsert<'guests'> = { ...input, wedding_id: weddingId };
	const { data, error } = await supabase
		.from('guests')
		.insert(payload)
		.select('*')
		.single();
	if (error) {
		console.error('Error creating guest:', error.message);
		return null;
	}
	return data;
}

export async function updateGuest(id: string, updates: TablesUpdate<'guests'>): Promise<boolean> {
	const user = await getCurrentUser();
	if (!user) return false;
	const { error } = await supabase
		.from('guests')
		.update(updates)
		.eq('id', id);
	if (error) {
		console.error('Error updating guest:', error.message);
		return false;
	}
	return true;
}

export async function deleteGuest(id: string): Promise<boolean> {
	const user = await getCurrentUser();
	if (!user) return false;
	const { error } = await supabase
		.from('guests')
		.delete()
		.eq('id', id);
	if (error) {
		console.error('Error deleting guest:', error.message);
		return false;
	}
	return true;
}
