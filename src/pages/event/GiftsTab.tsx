import { useEffect, useMemo, useState, useCallback } from "react";
import { listGifts, createGift, createGiftsBatch, updateGift, deleteGift } from "@/services/gifts";
import { uploadImage } from "@/services/storage";
import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUpload } from "@/components/ui/file-upload";
import { t } from "@/lib/translations";
import { Plus, Trash2, Edit2, ArrowUpDown, ArrowUp, ArrowDown, Gift, Sparkles } from "lucide-react";

// Preset gifts data (placeholder - you can update this later)
const PRESET_GIFTS = [
	{ gift_name: "Jogo de Panelas Tramontina", gift_description: "Jogo de panelas profissional com 5 peças", gift_amount: 2, gift_value: 299.90 },
	{ gift_name: "Mixer Oster", gift_description: "Mixer elétrico para preparo de bebidas", gift_amount: 3, gift_value: 89.90 },
	{ gift_name: "Jogo de Toalhas", gift_description: "Jogo de toalhas de banho e rosto", gift_amount: 4, gift_value: 159.90 },
	{ gift_name: "Conjunto de Copos", gift_description: "Conjunto de 6 copos de vidro", gift_amount: 2, gift_value: 79.90 },
	{ gift_name: "Jogo de Pratos", gift_description: "Jogo de pratos para 6 pessoas", gift_amount: 2, gift_value: 199.90 },
];

interface Props { 
	weddingId: string;
}

export default function GiftsTab({ weddingId }: Props) {
	const [query, setQuery] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const [editingGift, setEditingGift] = useState<Tables<'wedding_gifts'> | null>(null);
	const [form, setForm] = useState({ 
		gift_name: "", 
		gift_description: "", 
		gift_amount: 1,
		gift_value: 0,
		gift_image_url: ""
	});
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);

	// Sorting state
	const [sortField, setSortField] = useState<keyof Tables<'wedding_gifts'> | null>(null);
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

	// State management
	const [gifts, setGifts] = useState<Tables<'wedding_gifts'>[]>([]);
	const [giftsLoading, setGiftsLoading] = useState(false);
	const [presetLoading, setPresetLoading] = useState(false);
	
	const fetchGifts = useCallback(async () => {
		setGiftsLoading(true);
		try {
			const result = await listGifts(weddingId);
			setGifts(result);
		} catch (error) {
			console.error("Error fetching gifts:", error);
		} finally {
			setGiftsLoading(false);
		}
	}, [weddingId]);
	
	const refreshGifts = useCallback(() => {
		fetchGifts();
	}, [fetchGifts]);
	
	useEffect(() => {
		fetchGifts();
	}, [fetchGifts]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return gifts;
		return gifts.filter((g) => 
			(g.gift_name?.toLowerCase() ?? "").includes(q) || 
			(g.gift_description?.toLowerCase() ?? "").includes(q)
		);
	}, [gifts, query]);

	// Sort gifts based on current sort field and direction
	const sortedGifts = useMemo(() => {
		return [...filtered].sort((a, b) => {
			if (!sortField) {
				// Default sort by created_at (newest first)
				return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
			}

			const aValue = a[sortField];
			const bValue = b[sortField];

			// Handle null/undefined values
			if (!aValue && !bValue) return 0;
			if (!aValue) return sortDirection === 'asc' ? 1 : -1;
			if (!bValue) return sortDirection === 'asc' ? -1 : 1;

			// Handle numeric fields
			if (sortField === 'gift_amount' || sortField === 'gift_value') {
				const aNum = Number(aValue);
				const bNum = Number(bValue);
				return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
			}

			// Handle string fields
			const aStr = String(aValue).toLowerCase();
			const bStr = String(bValue).toLowerCase();
			
			if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
			if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
	}, [filtered, sortField, sortDirection]);

	const handleSort = (field: keyof Tables<'wedding_gifts'>) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	const getSortIcon = (field: keyof Tables<'wedding_gifts'>) => {
		if (sortField !== field) {
			return <ArrowUpDown className="h-4 w-4" />;
		}
		return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
	};

	const resetForm = () => {
		setForm({ gift_name: "", gift_description: "", gift_amount: 1, gift_value: 0, gift_image_url: "" });
		setSelectedFile(null);
		setEditingGift(null);
		setIsAdding(false);
	};

	const onAdd = async () => {
		if (!form.gift_name.trim()) return;
		
		setUploading(true);
		let imageUrl = form.gift_image_url.trim() || null;

		// Upload file if selected
		if (selectedFile) {
			const uploadedUrl = await uploadImage(selectedFile, "gifts");
			if (uploadedUrl) {
				imageUrl = uploadedUrl;
			}
		}

		const giftData = {
			gift_name: form.gift_name.trim(),
			gift_description: form.gift_description.trim() || null,
			gift_amount: form.gift_amount,
			gift_value: form.gift_value,
			gift_image_url: imageUrl,
		};

		const created = await createGift(weddingId, giftData);
		if (created) {
			resetForm();
			refreshGifts();
		}
		setUploading(false);
	};

	const onEdit = async () => {
		if (!editingGift || !form.gift_name.trim()) return;
		
		setUploading(true);
		let imageUrl = form.gift_image_url.trim() || null;

		// Upload file if selected
		if (selectedFile) {
			const uploadedUrl = await uploadImage(selectedFile, "gifts");
			if (uploadedUrl) {
				imageUrl = uploadedUrl;
			}
		}

		const updates = {
			gift_name: form.gift_name.trim(),
			gift_description: form.gift_description.trim() || null,
			gift_amount: form.gift_amount,
			gift_value: form.gift_value,
			gift_image_url: imageUrl,
		};

		const success = await updateGift(editingGift.id, updates);
		if (success) {
			resetForm();
			refreshGifts();
		}
		setUploading(false);
	};

	const startEdit = (gift: Tables<'wedding_gifts'>) => {
		setEditingGift(gift);
		setForm({
			gift_name: gift.gift_name || "",
			gift_description: gift.gift_description || "",
			gift_amount: gift.gift_amount || 1,
			gift_value: gift.gift_value || 0,
			gift_image_url: gift.gift_image_url || ""
		});
		setSelectedFile(null);
		setIsAdding(true);
	};

	const remove = async (gift: Tables<'wedding_gifts'>) => {
		await deleteGift(gift.id);
		refreshGifts();
	};

	const handlePresetGifts = async () => {
		setPresetLoading(true);
		try {
			const createdGifts = await createGiftsBatch(weddingId, PRESET_GIFTS);
			if (createdGifts.length > 0) {
				refreshGifts();
			}
		} catch (error) {
			console.error("Error creating preset gifts:", error);
			alert("Erro ao criar lista de presentes pré-definida. Tente novamente.");
		} finally {
			setPresetLoading(false);
		}
	};

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h2 className="text-xl sm:text-2xl font-bold text-charcoal">{t("giftList")}</h2>
					<p className="text-charcoal-soft mt-1">{t("manageYourWeddingGifts")}</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-2">
					<Button 
						onClick={() => setIsAdding(true)} 
						className="bg-brand text-white hover:bg-brand/90 shadow-elegant w-full sm:w-auto"
					>
						<Plus className="h-4 w-4 mr-2" /> {t("addGift")}
					</Button>
					<Button 
						onClick={handlePresetGifts}
						disabled={presetLoading}
						variant="outline"
						className="border-charcoal-soft/20 text-charcoal hover:bg-beige w-full sm:w-auto"
					>
						<Sparkles className="h-4 w-4 mr-2" />
						{presetLoading ? t("creatingGifts") : t("presetGifts")}
					</Button>
				</div>
			</div>

			{isAdding && (
				<div className="p-4 sm:p-6 bg-beige/30 rounded-lg border border-charcoal-soft/20">
					<h3 className="text-lg font-semibold text-charcoal mb-4">
						{editingGift ? t("editGift") : t("addNewGift")}
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-charcoal font-medium">{t("giftName")}</Label>
							<Input 
								value={form.gift_name} 
								onChange={(e) => setForm({ ...form, gift_name: e.target.value })}
								className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
								placeholder="Ex: Jogo de Panelas"
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-charcoal font-medium">{t("giftValue")} (R$)</Label>
							<Input 
								type="number"
								step="0.01"
								min="0"
								value={form.gift_value} 
								onChange={(e) => setForm({ ...form, gift_value: parseFloat(e.target.value) || 0 })}
								className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
								placeholder="0.00"
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-charcoal font-medium">{t("giftAmount")}</Label>
							<Input 
								type="number"
								min="1"
								value={form.gift_amount} 
								onChange={(e) => setForm({ ...form, gift_amount: parseInt(e.target.value) || 1 })}
								className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
								placeholder="1"
							/>
						</div>
						<div className="sm:col-span-2 space-y-2">
							<Label className="text-charcoal font-medium">{t("giftImage")}</Label>
							<FileUpload
								onFileSelect={setSelectedFile}
								onUrlChange={(url) => setForm({ ...form, gift_image_url: url })}
								currentUrl={form.gift_image_url}
								currentFile={selectedFile}
								accept="image/*"
								maxSize={5}
								className="border-charcoal-soft/20 focus:border-brand"
							/>
						</div>
						<div className="sm:col-span-2 space-y-2">
							<Label className="text-charcoal font-medium">{t("giftDescription")}</Label>
							<Textarea 
								value={form.gift_description} 
								onChange={(e) => setForm({ ...form, gift_description: e.target.value })}
								className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80"
								rows={3}
								placeholder="Descreva o presente..."
							/>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
						<Button 
							variant="outline" 
							onClick={resetForm} 
							className="border-charcoal-soft/20 text-charcoal hover:bg-beige order-2 sm:order-1"
						>
							Cancelar
						</Button>
						<Button 
							onClick={editingGift ? onEdit : onAdd} 
							disabled={uploading}
							className="bg-brand text-white hover:bg-brand/90 shadow-elegant order-1 sm:order-2"
						>
							{uploading ? t("uploading") : (editingGift ? "Salvar" : t("addGift"))}
						</Button>
					</div>
				</div>
			)}

			{/* Search */}
			<div className="relative">
				<Input
					placeholder={t("searchGiftsPlaceholder")}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="border-charcoal-soft/20 focus:border-brand text-charcoal bg-white/80 pl-10"
				/>
				<Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-charcoal-soft" />
			</div>

			{giftsLoading ? (
				<div className="text-center py-12">
					<div className="inline-flex items-center gap-2 text-charcoal-soft">
						<div className="w-6 h-6 border-2 border-brand/20 border-t-brand rounded-full animate-spin"></div>
						<p>Carregando presentes...</p>
					</div>
				</div>
			) : sortedGifts.length > 0 ? (
				<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
					{/* Desktop Table */}
					<div className="hidden md:block">
						<Table>
							<TableHeader>
								<TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
									<TableHead className="w-[40px] text-gray-600 font-semibold"></TableHead>
									<TableHead 
										className="text-gray-700 font-semibold cursor-pointer hover:bg-gray-200/50 transition-all duration-200 py-4"
										onClick={() => handleSort('gift_name')}
									>
										<div className="flex items-center gap-2">
											Presente
											{getSortIcon('gift_name')}
										</div>
									</TableHead>
									<TableHead className="text-gray-700 font-semibold">Descrição</TableHead>
									<TableHead 
										className="text-gray-700 font-semibold cursor-pointer hover:bg-gray-200/50 transition-all duration-200 py-4"
										onClick={() => handleSort('gift_amount')}
									>
										<div className="flex items-center gap-2">
											Quantidade
											{getSortIcon('gift_amount')}
										</div>
									</TableHead>
									<TableHead 
										className="text-gray-700 font-semibold cursor-pointer hover:bg-gray-200/50 transition-all duration-200 py-4"
										onClick={() => handleSort('gift_value')}
									>
										<div className="flex items-center gap-2">
											Valor
											{getSortIcon('gift_value')}
										</div>
									</TableHead>
									<TableHead className="w-[100px] text-gray-600 font-semibold">Ações</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sortedGifts.map((gift, index) => (
									<TableRow key={gift.id} className={`border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
										<TableCell className="text-center py-4">
											{gift.gift_image_url && (
												<img 
													src={gift.gift_image_url} 
													alt={gift.gift_name}
													className="w-8 h-8 rounded object-cover"
												/>
											)}
										</TableCell>
										<TableCell className="py-4">
											<div className="font-medium text-gray-800">{gift.gift_name}</div>
										</TableCell>
										<TableCell className="text-gray-600 py-4">
											{gift.gift_description || (
												<span className="text-gray-400">-</span>
											)}
										</TableCell>
										<TableCell className="text-gray-600 py-4">
											<span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
												{gift.gift_amount}
											</span>
										</TableCell>
										<TableCell className="text-gray-600 py-4">
											<span className="font-medium text-green-700">
												{formatCurrency(gift.gift_value)}
											</span>
										</TableCell>
										<TableCell className="text-right py-4">
											<div className="flex gap-2">
												<Button 
													variant="ghost" 
													size="icon" 
													onClick={() => startEdit(gift)}
													className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
												>
													<Edit2 className="w-4 h-4" />
												</Button>
												<Button 
													variant="ghost" 
													size="icon" 
													onClick={() => remove(gift)}
													className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Mobile Cards */}
					<div className="md:hidden space-y-3 p-4">
						{sortedGifts.map((gift, index) => (
							<div key={gift.id} className={`p-4 rounded-lg border ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
								<div className="flex items-start gap-3 mb-3">
									{gift.gift_image_url && (
										<img 
											src={gift.gift_image_url} 
											alt={gift.gift_name}
											className="w-12 h-12 rounded object-cover flex-shrink-0"
										/>
									)}
									<div className="flex-1 min-w-0">
										<h3 className="font-medium text-gray-800 text-sm mb-1">{gift.gift_name}</h3>
										<div className="flex flex-wrap gap-2 mb-2">
											<span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
												Qtd: {gift.gift_amount}
											</span>
											<span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs">
												{formatCurrency(gift.gift_value)}
											</span>
										</div>
										{gift.gift_description && (
											<p className="text-gray-600 text-xs">{gift.gift_description}</p>
										)}
									</div>
								</div>
								<div className="flex justify-end gap-2">
									<Button 
										variant="ghost" 
										size="icon" 
										onClick={() => startEdit(gift)}
										className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 h-8 w-8"
									>
										<Edit2 className="w-3 h-3" />
									</Button>
									<Button 
										variant="ghost" 
										size="icon" 
										onClick={() => remove(gift)}
										className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 h-8 w-8"
									>
										<Trash2 className="w-3 h-3" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="text-center py-16">
					<div className="max-w-md mx-auto">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Gift className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">{t("noGiftsYet")}</h3>
						<p className="text-gray-500 mb-6">{t("chooseHowToStartGiftList")}</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Button 
								onClick={() => setIsAdding(true)} 
								className="bg-brand text-white hover:bg-brand/90 shadow-elegant"
							>
								<Plus className="h-4 w-4 mr-2" /> {t("addGift")}
							</Button>
							<Button 
								onClick={handlePresetGifts}
								disabled={presetLoading}
								variant="outline"
								className="border-charcoal-soft/20 text-charcoal hover:bg-beige"
							>
								<Sparkles className="h-4 w-4 mr-2" />
								{presetLoading ? t("creatingGifts") : t("presetGifts")}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
