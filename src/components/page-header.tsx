import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/services/auth";
import { t } from "@/lib/translations";

export function PageHeader() {
	const handleLogout = async () => {
		try {
			await signOut();
			// Redirect to home page after logout
			window.location.href = "/";
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return (
		<header className="border-b bg-cream/50 backdrop-blur-sm">
			<div className="flex h-16 items-center justify-between px-6">
				<BrandLogo size={28} className="shrink-0" />
				<Button
					variant="ghost"
					size="sm"
					onClick={handleLogout}
					className="text-charcoal hover:text-red-600 hover:bg-red-50 transition-all duration-200"
				>
					<LogOut className="h-4 w-4 mr-2" />
					{t("logout")}
				</Button>
			</div>
		</header>
	);
}