import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { listEvents, createEvent } from "@/services/events";
import { getCurrentUser } from "@/services/auth";
import { LoginModal } from "@/components/login-modal";
import type { Tables } from "@/integrations/supabase/types";
import { Plus, Calendar, MapPin, Heart } from "lucide-react";
import { t } from "@/lib/translations";

export default function Events() {
	const navigate = useNavigate();
	const [events, setEvents] = useState<Tables<'weddings'>[]>([]);
	const [isCreating, setIsCreating] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [user, setUser] = useState<any>(null);
	const [form, setForm] = useState({
		bride_name: "",
		groom_name: "",
		wedding_date: "",
		venue: "",
		budget: "",
	});

	useEffect(() => {
		checkAuth();
	}, []);

	useEffect(() => {
		if (user) {
			listEvents().then(setEvents);
		}
	}, [user]);

	const checkAuth = async () => {
		const currentUser = await getCurrentUser();
		setUser(currentUser);
	};

	const onCreate = async () => {
		if (!user) {
			setShowLogin(true);
			return;
		}
		const created = await createEvent({
			bride_name: form.bride_name || null,
			groom_name: form.groom_name || null,
			wedding_date: form.wedding_date || null,
			venue: form.venue || null,
			budget: form.budget ? Number(form.budget) : null,
		});
		if (created) {
			setIsCreating(false);
			setForm({ bride_name: "", groom_name: "", wedding_date: "", venue: "", budget: "" });
			const updated = await listEvents();
			setEvents(updated);
		}
	};

	const handleAuthSuccess = () => {
		checkAuth();
	};

	return (
		<div className="min-h-screen bg-gradient-warm">
			<PageHeader title={t("myEvents")} subtitle={t("events")}>
				<Button className="gradient-primary text-white hover:shadow-elegant" onClick={() => setIsCreating((v) => !v)}>
					<Plus className="h-4 w-4 mr-2" />
					{t("newEvent")}
				</Button>
			</PageHeader>

			<LoginModal 
				isOpen={showLogin} 
				onClose={() => setShowLogin(false)} 
				onSuccess={handleAuthSuccess}
			/>

			<main className="p-6 space-y-6 animate-fade-in">
				{isCreating && (
					<Card className="shadow-card border-0">
						<CardHeader>
							<CardTitle>{t("createEvent")}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>{t("brideName")}</Label>
									<Input value={form.bride_name} onChange={(e) => setForm({ ...form, bride_name: e.target.value })} />
								</div>
								<div className="space-y-2">
									<Label>{t("groomName")}</Label>
									<Input value={form.groom_name} onChange={(e) => setForm({ ...form, groom_name: e.target.value })} />
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label>{t("date")}</Label>
									<Input type="date" value={form.wedding_date} onChange={(e) => setForm({ ...form, wedding_date: e.target.value })} />
								</div>
								<div className="space-y-2">
									<Label>{t("location")}</Label>
									<Input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
								</div>
								<div className="space-y-2">
									<Label>{t("budgetLabel")}</Label>
									<Input 
										type="text" 
										value={form.budget} 
										onChange={(e) => {
											// Remove all non-numeric characters except decimal point
											const value = e.target.value.replace(/[^\d.,]/g, '');
											// Replace comma with dot for decimal
											const normalizedValue = value.replace(',', '.');
											setForm({ ...form, budget: normalizedValue });
										}}
										placeholder="0,00"
									/>
								</div>
							</div>
							<div className="flex gap-2 justify-end">
								<Button variant="outline" onClick={() => setIsCreating(false)}>{t("cancel")}</Button>
								<Button onClick={onCreate} className="gradient-primary text-white">{t("save")}</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{!user ? (
					<div className="text-center py-12">
						<p className="text-muted-foreground mb-4">{t("loginToSeeEvents")}</p>
						<Button onClick={() => setShowLogin(true)} className="gradient-primary text-white">
							{t("login")}
						</Button>
					</div>
				) : events.length === 0 ? (
					<p className="text-muted-foreground">{t("noEventsYet")}</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{events.map((evt) => (
							<Card key={evt.id} className="shadow-card border-0 hover:shadow-elegant transition-all duration-300">
								<CardContent className="p-6 space-y-3">
									<div className="flex items-center gap-2">
										<Heart className="h-4 w-4 text-primary" />
										<h3 className="text-lg font-semibold text-foreground">{evt.bride_name ?? ""} {evt.groom_name ? `& ${evt.groom_name}` : ""}</h3>
									</div>
									<div className="text-sm text-muted-foreground flex items-center gap-2">
										<Calendar className="h-4 w-4" />
										<span>{evt.wedding_date ? new Date(evt.wedding_date).toLocaleDateString('pt-BR') : '-'}</span>
									</div>
									<div className="text-sm text-muted-foreground flex items-center gap-2">
										<MapPin className="h-4 w-4" />
										<span>{evt.venue ?? '-'}</span>
									</div>
									<div className="pt-2">
										<Button size="sm" className="gradient-primary text-white" onClick={() => navigate(`/events/${evt.id}`)}>
											{t("viewDetails")}
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</main>
		</div>
	);
}


