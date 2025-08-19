import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, CheckSquare, Users, Home } from "lucide-react";
import { t } from "@/lib/translations";
import BrandLogo from "@/components/BrandLogo";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

export function AppSidebar({ className }: SidebarProps) {
	const location = useLocation();

	const navigation = [
		{
			title: t("events"),
			label: "events",
			icon: Home,
			variant: "ghost" as const,
			href: "/",
		},
		{
			title: t("tasks"),
			label: "tasks",
			icon: CheckSquare,
			variant: "ghost" as const,
			href: "/tasks",
		},
		{
			title: t("guests"),
			label: "guests",
			icon: Users,
			variant: "ghost" as const,
			href: "/guests",
		},
	];

	return (
		<div className={cn("pb-12 border-r bg-stone", className)}>
			<div className="space-y-4 py-4">
				<div className="px-4 pb-2 flex items-center">
					<BrandLogo size={34} />
				</div>
				<div className="px-3 py-2">
					<div className="space-y-1">
						{navigation.map((item) => (
							<Link key={item.href} to={item.href}>
								<Button
									variant={location.pathname === item.href ? "secondary" : "ghost"}
									className={cn(
										"w-full justify-start text-charcoal hover:text-charcoal hover:bg-beige",
										location.pathname === item.href && "bg-brand/15 text-charcoal border border-brand/30"
									)}
								>
									<item.icon className="mr-2 h-4 w-4 text-brand" />
									{item.title}
								</Button>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}