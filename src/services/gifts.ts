import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Gift = Tables<'wedding_gifts'>;

export interface CreateGiftData {
	gift_name: string;
	gift_description?: string;
	gift_amount: number;
	gift_value: number;
	gift_image_url?: string;
}

export interface UpdateGiftData {
	gift_name?: string;
	gift_description?: string;
	gift_amount?: number;
	gift_value?: number;
	gift_image_url?: string;
}

export async function listGifts(weddingId: string): Promise<Gift[]> {
	const { data, error } = await supabase
		.from('wedding_gifts')
		.select('*')
		.eq('wedding_id', weddingId)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching gifts:', error);
		throw error;
	}

	return data || [];
}

export async function createGift(weddingId: string, giftData: CreateGiftData): Promise<Gift | null> {
	const { data, error } = await supabase
		.from('wedding_gifts')
		.insert({
			wedding_id: weddingId,
			...giftData
		})
		.select()
		.single();

	if (error) {
		console.error('Error creating gift:', error);
		throw error;
	}

	return data;
}

export async function createGiftsBatch(weddingId: string, giftsData: CreateGiftData[]): Promise<Gift[]> {
	const giftsToInsert = giftsData.map(gift => ({
		wedding_id: weddingId,
		...gift
	}));

	const { data, error } = await supabase
		.from('wedding_gifts')
		.insert(giftsToInsert)
		.select();

	if (error) {
		console.error('Error creating gifts batch:', error);
		throw error;
	}

	return data || [];
}

export async function updateGift(giftId: string, updates: UpdateGiftData): Promise<boolean> {
	const { error } = await supabase
		.from('wedding_gifts')
		.update(updates)
		.eq('id', giftId);

	if (error) {
		console.error('Error updating gift:', error);
		throw error;
	}

	return true;
}

export async function deleteGift(giftId: string): Promise<boolean> {
	const { error } = await supabase
		.from('wedding_gifts')
		.delete()
		.eq('id', giftId);

	if (error) {
		console.error('Error deleting gift:', error);
		throw error;
	}

	return true;
}
