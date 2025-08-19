import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listEvents, createEvent } from "@/services/events";
import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginModal } from "@/components/login-modal";
import { t } from "@/lib/translations";
import { Plus, Calendar, MapPin, Eye } from "lucide-react";

export default function Events() {
	const [events, setEvents] = useState<Tables<'weddings'>[]>([]);
	const [isAdding, setIsAdding] = useState(false);
	const [form, setForm] = useState({ bride_name: "", groom_name: "", wedding_date: "", venue: "" });
	const [loading, setLoading] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [user, setUser] = useState<any>(null);
	const navigate = useNavigate();

	useEffect(() => {
		checkAuth();
		refresh();
	}, []);

	const checkAuth = async () => {
		const { getCurrentUser } = await import("@/services/auth");
		const currentUser = await getCurrentUser();
		setUser(currentUser);
	};

	const refresh = async () => {
		const data = await listEvents();
		setEvents(data);
	};

	const onCreate = async () => {
		if (!user) {
			setShowLoginModal(true);
			return;
		}

		if (!form.bride_name.trim() && !form.groom_name.trim()) return;

		setLoading(true);
		
		const created = await createEvent({
			bride_name: form.bride_name.trim() || null,
			groom_name: form.groom_name.trim() || null,
			wedding_date: form.wedding_date || null,
			venue: form.venue.trim() || null,
		});

		setLoading(false);
		if (created) {
			setIsAdding(false);
			setForm({ bride_name: "", groom_name: "", wedding_date: "", venue: "" });
			refresh();
		}
	};

	const formatDate = (date: string | null) => {
		if (!date) return t("notSpecified");
		return new Date(date).toLocaleDateString('pt-BR');
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-charcoal">{t("events")}</h1>
					<p className="text-charcoal-soft mt-1">{t("manageYourWeddings")}</p>
				</div>
				<Button onClick={() => setIsAdding(true)} className="bg-brand text-white hover:bg-brand/90 shadow-elegant">
					<Plus className="h-4 w-4 mr-2" /> {t("addEvent")}
				</Button>
			</div>

			{!user && (
				<Card className="bg-beige/50 border-charcoal-soft/20">
					<CardContent className="p-6 text-center">
						<p className="text-charcoal text-lg">{t("loginToSeeEvents")}</p>
						<Button onClick={() => setShowLoginModal(true)} className="mt-4 bg-brand text-white hover:bg-brand/90">
							{t("login")}
						</Button>
					</CardContent>
				</Card>
			)}

			{user && events.length === 0 && !isAdding && (
				<Card className="bg-beige/50 border-charcoal-soft/20">
					<CardContent className="p-6 text-center">
						<p className="text-charcoal text-lg">{t("noEventsYet")}</p>
						<p className="text-charcoal-soft mt-2">{t("createYourFirstEvent")}</p>
					</CardContent>
				</Card>
			)}

			{isAdding && (
				<Card className="shadow-elegant border-charcoal-soft/20">
					<CardHeader>
						<CardTitle className="text-charcoal">{t("addNewEvent")}</CardTitle>
						<CardDescription className="text-charcoal-soft">{t("fillEventDetails")}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="text-charcoal">{t("brideName")}</Label>
								<Input 
									value={form.bride_name} 
									onChange={(e) => setForm({ ...form, bride_name: e.target.value })}
									className="border-charcoal-soft/20 focus:border-brand text-charcoal"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-charcoal">{t("groomName")}</Label>
								<Input 
									value={form.groom_name} 
									onChange={(e) => setForm({ ...form, groom_name: e.target.value })}
									className="border-charcoal-soft/20 focus:border-brand text-charcoal"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-charcoal">{t("weddingDate")}</Label>
								<Input 
									type="date" 
									value={form.wedding_date} 
									onChange={(e) => setForm({ ...form, wedding_date: e.target.value })}
									className="border-charcoal-soft/20 focus:border-brand text-charcoal"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-charcoal">{t("venue")}</Label>
								<Input 
									value={form.venue} 
									onChange={(e) => setForm({ ...form, venue: e.target.value })}
									className="border-charcoal-soft/20 focus:border-brand text-charcoal"
								/>
							</div>
						</div>
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setIsAdding(false)} className="border-charcoal-soft/20 text-charcoal hover:bg-beige">
								{t("cancel")}
							</Button>
							<Button onClick={onCreate} disabled={loading} className="bg-brand text-white hover:bg-brand/90 shadow-elegant">
								{loading ? t("creating") : t("createEvent")}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{events.map((event) => (
					<Card key={event.id} className="shadow-card border-charcoal-soft/20 hover:shadow-elegant transition-all duration-300 cursor-pointer" onClick={() => navigate(`/events/${event.id}`)}>
						<CardHeader className="pb-3">
							<CardTitle className="text-charcoal text-lg">
								{event.bride_name && event.groom_name 
									? `${event.bride_name} & ${event.groom_name}`
									: event.bride_name || event.groom_name || t("unnamedEvent")
								}
							</CardTitle>
							<CardDescription className="text-charcoal-soft">
								{event.venue || t("venueNotSpecified")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center gap-2 text-charcoal-soft">
								<Calendar className="h-4 w-4" />
								<span className="text-sm">{formatDate(event.wedding_date)}</span>
							</div>
							<div className="flex items-center gap-2 text-charcoal-soft">
								<MapPin className="h-4 w-4" />
								<span className="text-sm">{event.venue || t("venueNotSpecified")}</span>
							</div>
							<div className="pt-2 border-t border-charcoal-soft/10">
								<Button variant="ghost" size="sm" className="w-full text-charcoal hover:bg-brand/10 hover:text-brand">
									<Eye className="h-4 w-4 mr-2" /> {t("viewDetails")}
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<LoginModal 
				open={showLoginModal} 
				onOpenChange={setShowLoginModal}
				onSuccess={() => {
					setShowLoginModal(false);
					checkAuth();
					refresh();
				}}
			/>
		</div>
	);
}


