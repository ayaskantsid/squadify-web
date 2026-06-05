import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";

export const EmptyTrips = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="relative mb-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                    <MapPin className="h-7 w-7 text-primary/60" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary/20 animate-pulse" />
            </div>

            <h2 className="text-lg font-semibold text-foreground mb-1">
                No trips yet
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-[280px] leading-relaxed">
                Create your first trip and start splitting
                expenses with your squad.
            </p>

            <Button
                onClick={() => navigate("/trips/new")}
                size="lg"
            >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Trip
            </Button>
        </div>
    );
};
