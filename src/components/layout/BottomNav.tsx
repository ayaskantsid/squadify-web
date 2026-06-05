import { useLocation, useNavigate } from "react-router-dom";
import { Map, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
    {
        label: "Trips",
        path: "/",
        icon: Map,
    },
    {
        label: "Invitations",
        path: "/invitations",
        icon: Mail,
    },
    {
        label: "Profile",
        path: "/profile",
        icon: User,
    },
] as const;

export const BottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg sm:static sm:border-t-0 sm:border-b sm:backdrop-blur-none sm:bg-background">
            <div className="mx-auto max-w-2xl flex items-center justify-around sm:justify-start sm:gap-1 sm:px-4 h-14 sm:h-12">
                {tabs.map((tab) => {
                    const isActive =
                        location.pathname === tab.path;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.path}
                            onClick={() =>
                                navigate(tab.path)
                            }
                            className={cn(
                                "flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-5 w-5 sm:h-4 sm:w-4",
                                    isActive &&
                                        "text-primary"
                                )}
                            />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
