import { useEffect, useMemo, useState } from "react";
import { listGuests, createGuest, deleteGuest } from "@/services/guests";
import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/translations";
import { Plus, Trash2 } from "lucide-react";

interface Props { weddingId: string }

export default function GuestsTab({ weddingId }: Props) {
	const [guests, setGuests] = useState<Tables<'guests'>[]>([]);
	const [query, setQuery] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const [form, setForm] = useState({ first_name: "", last_name: "", email: "" });

	useEffect(() => { refresh(); }, [weddingId]);

	const refresh = async () => {
		const data = await listGuests(weddingId);
		setGuests(data);
	};

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return guests;
		return guests.filter((g) => (`${g.first_name} ${g.last_name}`.toLowerCase()).includes(q) || (g.email ?? '').toLowerCase().includes(q));
	}, [guests, query]);

	const onAdd = async () => {
		if (!form.first_name.trim() || !form.last_name.trim()) return;
		const created = await createGuest(weddingId, { first_name: form.first_name.trim(), last_name: form.last_name.trim(), email: form.email || null });
		if (created) {
			setIsAdding(false);
			setForm({ first_name: "", last_name: "", email: "" });
			refresh();
		}
	};

	const rsvpBadge = (status?: string | null) => {
		switch (status) {
			case 'attending': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('attending')}</Badge>;
			case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t('pending')}</Badge>;
			case 'declined': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{t('declined')}</Badge>;
			default: return <Badge variant="secondary">{t('unknown')}</Badge>;
		}
	};

	return (
		<div className="space-y-4">
			<Card className="shadow-card border-0">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between gap-2">
						<CardTitle>{t("guestList")}</CardTitle>
						<div className="flex items-center gap-2">
							<Input placeholder={t("search")} value={query} onChange={(e) => setQuery(e.target.value)} className="w-64" />
							<Button onClick={() => setIsAdding((v) => !v)} className="gradient-primary text-white">
								<Plus className="h-4 w-4 mr-2" /> {t("addGuest")}
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{isAdding && (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
							<div className="space-y-1"><Label>{t('firstName')}</Label><Input value={form.first_name} onChange={(e)=>setForm({...form, first_name: e.target.value})} /></div>
							<div className="space-y-1"><Label>{t('lastName')}</Label><Input value={form.last_name} onChange={(e)=>setForm({...form, last_name: e.target.value})} /></div>
							<div className="space-y-1"><Label>Email</Label><Input value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} /></div>
							<div className="md:col-span-3 flex justify-end gap-2">
								<Button variant="outline" onClick={()=>setIsAdding(false)}>{t('cancel')}</Button>
								<Button onClick={onAdd} className="gradient-primary text-white">{t('addGuest')}</Button>
							</div>
						</div>
					)}

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('name')}</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>{t('status')}</TableHead>
								<TableHead className="w-[80px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.map((g)=> (
								<TableRow key={g.id}>
									<TableCell>{g.first_name} {g.last_name}</TableCell>
									<TableCell>{g.email ?? '-'}</TableCell>
									<TableCell>{rsvpBadge(g.rsvp_status)}</TableCell>
									<TableCell className="text-right"><Button variant="ghost" size="icon" onClick={()=>deleteGuest(g.id).then(refresh)}><Trash2 className="w-4 h-4"/></Button></TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
