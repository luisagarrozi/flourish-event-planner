import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent } from "@/services/events";
import type { Tables } from "@/integrations/supabase/types";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksTab from "./event/TasksTab";
import GuestsTab from "./event/GuestsTab";
import VendorsTab from "./event/VendorsTab";
import { t } from "@/lib/translations";

export default function EventDetails() {
	const { id } = useParams();
	const [event, setEvent] = useState<Tables<'weddings'> | null>(null);

	useEffect(() => {
		if (!id) return;
		getEvent(id).then(setEvent);
	}, [id]);

	return (
		<div className="min-h-screen bg-gradient-warm">
			<PageHeader
				title={event?.bride_name && event?.groom_name ? `${event.bride_name} & ${event.groom_name}` : t('eventDetails')}
				subtitle={event?.wedding_date ? new Date(event.wedding_date).toLocaleDateString('pt-BR') : t('loadingEventDetails')}
			/>
			<main className="p-6 space-y-6 animate-fade-in">
				<Card className="shadow-card border-0">
					<CardContent className="p-0">
						<Tabs defaultValue="organization">
							<div className="flex items-center justify-between p-4 border-b">
								<TabsList>
									<TabsTrigger value="organization">{t('organization')}</TabsTrigger>
									<TabsTrigger value="guests">{t('guestList')}</TabsTrigger>
									<TabsTrigger value="vendors">{t('vendors')}</TabsTrigger>
								</TabsList>
							</div>
							<TabsContent value="organization" className="p-4">
								{event?.id && <TasksTab weddingId={event.id} />}
							</TabsContent>
							<TabsContent value="guests" className="p-4">
								{event?.id && <GuestsTab weddingId={event.id} />}
							</TabsContent>
							<TabsContent value="vendors" className="p-4">
								{event?.id && <VendorsTab weddingId={event.id} />}
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
