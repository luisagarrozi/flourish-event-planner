import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar } from "@/components/app-sidebar";
import { PageHeader } from "@/components/page-header";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import Budget from "@/pages/Budget";
import Guests from "@/pages/Guests";
import Events from "@/pages/Events";
import NotFound from "@/pages/NotFound";
import EventDetails from "@/pages/EventDetails";
import WeddingSite from "@/pages/WeddingSite";
import "./App.css";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<Routes>
					{/* Public wedding site route */}
					<Route path="/:siteUrl" element={<WeddingSite />} />
					
					{/* Protected admin routes */}
					<Route path="/*" element={<AdminLayout />} />
				</Routes>
				<Toaster />
			</Router>
		</QueryClientProvider>
	);
}

function AdminLayout() {
	const location = useLocation();
	const isMobile = useIsMobile();

	return (
		<div className="min-h-screen flex w-full bg-cream">
			{!isMobile && <AppSidebar className="w-64" />}
			<main className="flex-1 flex flex-col">
				<PageHeader isMobile={isMobile} />
				<div className="flex-1 overflow-auto">
					<Routes>
						<Route path="/" element={<Index />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/tasks" element={<Tasks />} />
						<Route path="/budget" element={<Budget />} />
						<Route path="/guests" element={<Guests />} />
						<Route path="/events/:id" element={<EventDetails />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</div>
			</main>
		</div>
	);
}

export default App;