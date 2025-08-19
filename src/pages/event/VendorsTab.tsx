import { useEffect, useMemo, useState, useCallback } from "react";
import { listVendors, createVendor, deleteVendor } from "@/services/vendors";
import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { t } from "@/lib/translations";
import { Plus, Trash2 } from "lucide-react";

interface Props { weddingId: string }

export default function VendorsTab({ weddingId }: Props) {
	const [vendors, setVendors] = useState<Tables<'vendors'>[]>([]);
	const [query, setQuery] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const [form, setForm] = useState({ name: "", category: "", phone: "" });

	const refresh = useCallback(async () => {
		const data = await listVendors(weddingId);
		setVendors(data);
	}, [weddingId]);

	useEffect(() => { refresh(); }, [refresh]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return vendors;
		return vendors.filter((v) => (v.name.toLowerCase()).includes(q) || v.category.toLowerCase().includes(q));
	}, [vendors, query]);

	const onAdd = async () => {
		if (!form.name.trim() || !form.category.trim()) return;
		const created = await createVendor(weddingId, { name: form.name.trim(), category: form.category.trim(), phone: form.phone || null });
		if (created) {
			setIsAdding(false);
			setForm({ name: "", category: "", phone: "" });
			refresh();
		}
	};

	return (
		<div className="space-y-4">
			<Card className="shadow-card border-0">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between gap-2">
						<CardTitle>{t("vendors")}</CardTitle>
						<div className="flex items-center gap-2">
							<Input placeholder={t("search")} value={query} onChange={(e) => setQuery(e.target.value)} className="w-64" />
							<Button onClick={() => setIsAdding((v) => !v)} className="gradient-primary text-white">
								<Plus className="h-4 w-4 mr-2" /> {t("addVendor")}
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{isAdding && (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
							<div className="space-y-1"><Label>{t('name')}</Label><Input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} /></div>
							<div className="space-y-1"><Label>{t('category')}</Label><Input value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})} /></div>
							<div className="space-y-1"><Label>{t('phone')}</Label><Input value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} /></div>
							<div className="md:col-span-3 flex justify-end gap-2">
								<Button variant="outline" onClick={()=>setIsAdding(false)}>{t('cancel')}</Button>
								<Button onClick={onAdd} className="gradient-primary text-white">{t('addVendor')}</Button>
							</div>
						</div>
					)}

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('name')}</TableHead>
								<TableHead>{t('category')}</TableHead>
								<TableHead>{t('phone')}</TableHead>
								<TableHead className="w-[80px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.map((v)=> (
								<TableRow key={v.id}>
									<TableCell>{v.name}</TableCell>
									<TableCell>{v.category}</TableCell>
									<TableCell>{v.phone ?? '-'}</TableCell>
									<TableCell className="text-right"><Button variant="ghost" size="icon" onClick={()=>deleteVendor(v.id).then(refresh)}><Trash2 className="w-4 h-4"/></Button></TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
