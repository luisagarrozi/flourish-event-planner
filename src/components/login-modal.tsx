import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/services/auth";
import { t } from "@/lib/translations";

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [showSignupSuccess, setShowSignupSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			if (isSignUp) {
				const { error } = await signUp(email, password);
				if (error) {
					setError(error.message);
				} else {
					setShowSignupSuccess(true);
				}
			} else {
				const { error } = await signIn(email, password);
				if (error) {
					setError(error.message);
				} else {
					onSuccess();
					onClose();
					setEmail("");
					setPassword("");
				}
			}
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				{showSignupSuccess ? (
					<>
						<DialogHeader>
							<DialogTitle>{t("accountCreated")}</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<p className="text-sm text-muted-foreground">
								{t("checkEmailToActivate")}
							</p>
							<Button 
								onClick={() => {
									setShowSignupSuccess(false);
									setIsSignUp(false);
									setEmail("");
									setPassword("");
								}}
								className="w-full"
							>
								{t("ok")}
							</Button>
						</div>
					</>
				) : (
					<>
						<DialogHeader>
							<DialogTitle>
								{isSignUp ? t("signUp") : t("login")}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">{t("email")}</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">{t("password")}</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{error && (
						<p className="text-sm text-red-600">{error}</p>
					)}
					<div className="flex gap-2">
						<Button 
							type="submit" 
							className="flex-1" 
							disabled={isLoading}
						>
							{isLoading ? t("loading") : (isSignUp ? t("signUp") : t("login"))}
						</Button>
					</div>
					<div className="text-center">
						<button
							type="button"
							onClick={() => setIsSignUp(!isSignUp)}
							className="text-sm text-blue-600 hover:underline"
						>
							{isSignUp ? t("alreadyHaveAccount") : t("noAccount")}
						</button>
					</div>
				</form>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
