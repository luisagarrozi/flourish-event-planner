import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { PageHeader } from "@/components/page-header";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Events from "@/pages/Events";
import EventDetails from "@/pages/EventDetails";
import Tasks from "@/pages/Tasks";
import Guests from "@/pages/Guests";
import NotFound from "@/pages/NotFound";
import { t } from "@/lib/translations";

function App() {
	return (
		<TooltipProvider>
			<Router>
				<div className="min-h-screen bg-gradient-warm">
					<div className="flex h-screen">
						<AppSidebar className="w-64" />
						<div className="flex-1 flex flex-col overflow-hidden">
							<PageHeader />
							<main className="flex-1 overflow-auto">
								<Routes>
									<Route path="/" element={<Events />} />
									<Route path="/events/:id" element={<EventDetails />} />
									<Route path="/tasks" element={<Tasks />} />
									<Route path="/guests" element={<Guests />} />
									<Route path="*" element={<NotFound />} />
								</Routes>
							</main>
						</div>
					</div>
					<Toaster />
					<Sonner />
				</div>
			</Router>
		</TooltipProvider>
	);
}

export default App;
