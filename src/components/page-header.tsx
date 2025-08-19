import BrandLogo from "@/components/BrandLogo";

export function PageHeader() {
	return (
		<header className="border-b bg-cream/50 backdrop-blur-sm">
			<div className="flex h-16 items-center px-6">
				<BrandLogo size={28} className="shrink-0" />
			</div>
		</header>
	);
}