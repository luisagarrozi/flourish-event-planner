import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { t } from "@/lib/translations";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="p-4 sm:p-6 flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-6xl sm:text-8xl font-bold text-charcoal mb-4">404</h1>
        <p className="text-lg sm:text-xl text-charcoal-soft mb-6">{t("oopsPageNotFound")}</p>
        <Button asChild className="bg-brand text-white hover:bg-brand/90 shadow-elegant">
          <a href="/">
            <Home className="h-4 w-4 mr-2" />
            {t("returnToHome")}
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
