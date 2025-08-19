import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent } from "@/services/events";
import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlanejamentoTab from "./event/PlanejamentoTab";
import GuestsTab from "./event/GuestsTab";
import VendorsTab from "./event/VendorsTab";
import { t } from "@/lib/translations";

export default function EventDetails() {
	const { id } = useParams();
	const [event, setEvent] = useState<Tables<'weddings'> | null>(null);

	useEffect(() => {
		if (!id) return;
		getEvent(id).then((result) => {
			setEvent(result);
		}).catch((error) => {
			console.error("Error getting event:", error);
		});
	}, [id]);
	
	return (
		<div className="p-6 space-y-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-charcoal">
					{event?.bride_name && event?.groom_name ? `${event.bride_name} & ${event.groom_name}` : t('events')}
				</h1>
				<p className="text-charcoal-soft mt-1">
					{event?.wedding_date ? new Date(event.wedding_date).toLocaleDateString('pt-BR') : t('notSpecified')}
				</p>
			</div>
			
			<Card className="shadow-card border-0">
				<CardContent className="p-0">
					<Tabs defaultValue="organization" className="w-full">
						<div className="flex items-center justify-between p-4 border-b border-charcoal-soft/20">
							<TabsList className="bg-stone border border-charcoal-soft/20">
								<TabsTrigger 
									value="organization" 
									className="data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:shadow-sm"
								>
									{t('organization')}
								</TabsTrigger>
								<TabsTrigger 
									value="guests" 
									className="data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:shadow-sm"
								>
									{t('guestList')}
								</TabsTrigger>
								<TabsTrigger 
									value="vendors" 
									className="data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:shadow-sm"
								>
									{t('vendors')}
								</TabsTrigger>
							</TabsList>
						</div>
						<TabsContent value="organization" className="p-4">
							{event?.id && <PlanejamentoTab weddingId={event.id} eventDate={event.wedding_date} />}
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
		</div>
	);
}
