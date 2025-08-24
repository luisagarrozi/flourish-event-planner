import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/app-sidebar";
import { LogOut, Menu } from "lucide-react";
import { signOut } from "@/services/auth";
import { t } from "@/lib/translations";

interface PageHeaderProps {
	isMobile?: boolean;
	title?: string;
	subtitle?: string;
}

export function PageHeader({ isMobile = false }: PageHeaderProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const location = useLocation();

	const handleLogout = async () => {
		try {
			await signOut();
			// Redirect to home page after logout
			window.location.href = "/";
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	const navigation = [
		{
			title: t("tasks"),
			href: "/tasks",
		},
		{
			title: t("models"),
			href: "/models",
		},
	];

	return (
		<header className="border-b bg-cream/50 backdrop-blur-sm">
			<div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-2">
				<div className="flex items-center gap-4 min-w-0">
					{isMobile && (
						<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
							<SheetTrigger asChild>
								<Button variant="ghost" size="sm" className="p-2 shrink-0">
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="p-0 w-64">
								<AppSidebar className="w-full border-r-0" />
							</SheetContent>
						</Sheet>
					)}
					<BrandLogo size={28} className="shrink-0" />
				</div>
				
				{/* Mobile navigation tabs */}
				{isMobile && (
					<div className="flex items-center gap-1 min-w-0 flex-1 justify-center overflow-x-auto scrollbar-hide">
						{navigation.map((item) => (
							<Link
								key={item.href}
								to={item.href}
								onClick={() => setSidebarOpen(false)}
								className={`px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md transition-colors shrink-0 whitespace-nowrap ${
									location.pathname === item.href
										? "bg-brand/15 text-charcoal border border-brand/30"
										: "text-charcoal-soft hover:text-charcoal hover:bg-beige"
								}`}
							>
								{item.title}
							</Link>
						))}
					</div>
				)}
				
				<Button
					variant="ghost"
					size="sm"
					onClick={handleLogout}
					className="text-charcoal hover:text-red-600 hover:bg-red-50 transition-all duration-200 shrink-0"
				>
					<LogOut className="h-4 w-4 mr-2" />
					{!isMobile && t("logout")}
				</Button>
			</div>
		</header>
	);
}