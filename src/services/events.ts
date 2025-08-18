import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { getCurrentUser } from "./auth";

export async function ensureAuth(): Promise<string | null> {
	const user = await getCurrentUser();
	return user?.id ?? null;
}

export async function listEvents(): Promise<Tables<'weddings'>[]> {
	await ensureAuth();
	const { data, error } = await supabase
		.from("weddings")
		.select("*")
		.order("created_at", { ascending: false });
	if (error) {
		console.error("Error fetching events:", error.message);
		return [];
	}
	return data ?? [];
}

export type CreateEventInput = {
	bride_name?: string | null;
	groom_name?: string | null;
	wedding_date?: string | null; // YYYY-MM-DD
	venue?: string | null;
	budget?: number | null;
};

export async function createEvent(input: CreateEventInput): Promise<Tables<'weddings'> | null> {
	const userId = await ensureAuth();
	if (!userId) return null;
	const payload: TablesInsert<'weddings'> = {
		user_id: userId,
		bride_name: input.bride_name ?? null,
		groom_name: input.groom_name ?? null,
		wedding_date: input.wedding_date ?? null,
		venue: input.venue ?? null,
		budget: input.budget ?? null,
	};
	const { data, error } = await supabase
		.from("weddings")
		.insert(payload)
		.select("*")
		.single();
	if (error) {
		console.error("Error creating event:", error.message);
		return null;
	}
	return data;
}

export async function getEvent(id: string): Promise<Tables<'weddings'> | null> {
	await ensureAuth();
	const { data, error } = await supabase
		.from("weddings")
		.select("*")
		.eq("id", id)
		.single();
	if (error) {
		console.error("Error fetching event:", error.message);
		return null;
	}
	return data;
}


