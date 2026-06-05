import { useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { CalendarDays, ArrowRight, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/auth/AuthContext";
import type { Trip } from "@/types/trip";

type TripCardProps = {
    trip: Trip;
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
};

export const TripCard = ({ trip }: TripCardProps) => {
    const navigate = useNavigate();
    const { squadifyUser } = useAuth();

    const isCreator = trip.createdBy === squadifyUser?._id;

    return (
        <Card
            className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 overflow-hidden"
            onClick={() => navigate(`/trips/${trip._id}`)}
        >
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold truncate">
                                {trip.name}
                            </CardTitle>
                            {isCreator ? (
                                <Badge variant="default" className="text-[10px] px-1.5 py-0 shrink-0">
                                    Admin
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                                    Member
                                </Badge>
                            )}
                        </div>
                        {trip.description && (
                            <CardDescription className="mt-1 line-clamp-1 text-xs">
                                {trip.description}
                            </CardDescription>
                        )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                </div>
            </CardHeader>

            <CardContent className="pt-0 pb-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        <span>
                            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                        </span>
                    </div>

                    {(trip.noOfExpenses !== undefined && trip.noOfExpenses > 0) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Receipt className="h-3 w-3" />
                            <span>{trip.noOfExpenses}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
