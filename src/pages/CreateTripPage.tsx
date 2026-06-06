import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateTrip, useTrip, useUpdateTrip } from "@/hooks/useTrips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CalendarDays, PlaneTakeoff, AlignLeft, Loader2 } from "lucide-react";

const tripSchema = z.object({
    name: z.string().min(3, "Trip name must be at least 3 characters").max(50, "Trip name is too long"),
    description: z.string().max(500, "Description is too long").optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
}).refine((data) => {
    if (!data.endDate) return true;
    return new Date(data.startDate) <= new Date(data.endDate);
}, {
    message: "End date cannot be earlier than start date",
    path: ["endDate"],
});

type TripFormValues = z.infer<typeof tripSchema>;

// Helper to convert ISO date string to input[type=date] format (YYYY-MM-DD)
const toDateInputValue = (isoStr?: string) => {
    if (!isoStr) return "";
    return isoStr.split("T")[0];
};

export const TripFormPage = () => {
    const navigate = useNavigate();
    const { tripId } = useParams<{ tripId: string }>();
    const isEditMode = !!tripId;

    const { data: existingTrip, isLoading: tripLoading } = useTrip(tripId ?? "");
    const { mutate: createTrip, isPending: isCreating } = useCreateTrip();
    const { mutate: updateTrip, isPending: isUpdating } = useUpdateTrip();

    const isPending = isCreating || isUpdating;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TripFormValues>({
        resolver: zodResolver(tripSchema),
        defaultValues: {
            name: "",
            description: "",
            startDate: "",
            endDate: "",
        },
    });

    // Pre-fill form when editing and trip data loads
    useEffect(() => {
        if (isEditMode && existingTrip) {
            reset({
                name: existingTrip.name,
                description: existingTrip.description ?? "",
                startDate: toDateInputValue(existingTrip.startDate),
                endDate: toDateInputValue(existingTrip.endDate),
            });
        }
    }, [isEditMode, existingTrip, reset]);

    const onSubmit = (data: TripFormValues) => {
        if (isEditMode) {
            updateTrip({ tripId: tripId!, data });
        } else {
            createTrip(data);
        }
    };

    const backPath = isEditMode ? `/trips/${tripId}` : "/";
    const backLabel = isEditMode ? "Back to trip" : "Back to trips";

    // Show loading skeleton while fetching trip in edit mode
    if (isEditMode && tripLoading) {
        return (
            <div className="space-y-5">
                <Skeleton className="h-5 w-28" />
                <div className="rounded-xl border p-5 sm:p-6 space-y-3">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-11 w-full rounded-md" />
                    <Skeleton className="h-[88px] w-full rounded-md" />
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Skeleton className="h-11 w-full rounded-md" />
                        <Skeleton className="h-11 w-full rounded-md" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Back navigation */}
            <button
                onClick={() => navigate(backPath)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors -ml-1"
            >
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
            </button>

            {/* Header card */}
            <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 via-background to-primary/[0.02] p-5 sm:p-6">
                {/* Decorative elements - Abstract fishes */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 animate-orb-slow">
                    <div className="relative">
                        {/* Tail */}
                        <div className="absolute -left-5 -top-1 w-8 h-12 bg-primary/5 rounded-[50%]" />
                        <div className="absolute -left-5 -bottom-1 w-8 h-12 bg-primary/5 rounded-[50%]" />
                        {/* Body */}
                        <div className="w-24 h-16 bg-primary/5 rounded-[50%]" />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 animate-orb-slow-reverse">
                    <div className="relative">
                        {/* Tail */}
                        <div className="absolute -right-3 top-0 w-6 h-10 bg-primary/3 rounded-[50%]" />
                        <div className="absolute -right-3 bottom-0 w-6 h-10 bg-primary/3 rounded-[50%]" />
                        {/* Body */}
                        <div className="w-20 h-14 bg-primary/3 rounded-[50%]" />
                    </div>
                </div>

                <div className="relative">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        {isEditMode ? "Edit Trip ✏️" : "Plan a New Trip ✈️"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        {isEditMode
                            ? "Update the details for this trip."
                            : "Set up the details for your next adventure."}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Trip Name */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                            <PlaneTakeoff className="h-3.5 w-3.5 text-primary" />
                        </div>
                        Trip Name
                    </Label>
                    <Input
                        id="name"
                        placeholder="e.g. Summer in Tokyo"
                        className="h-11"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                            <AlignLeft className="h-3.5 w-3.5 text-primary" />
                        </div>
                        Description
                        <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                    </Label>
                    <Textarea
                        id="description"
                        placeholder="What's the plan? Share the vibe..."
                        className="resize-none min-h-[88px]"
                        rows={3}
                        {...register("description")}
                    />
                    {errors.description && (
                        <p className="text-xs text-destructive">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                {/* Dates */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                            <CalendarDays className="h-3.5 w-3.5 text-primary" />
                        </div>
                        Travel Dates
                        <span className="text-muted-foreground font-normal text-xs">(end date optional)</span>
                    </Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5 min-w-0">
                            <label htmlFor="startDate" className="text-xs text-muted-foreground">
                                Start Date
                            </label>
                            <Input
                                id="startDate"
                                type="date"
                                className="h-11 w-full appearance-none m-0 max-w-[100%]"
                                {...register("startDate")}
                            />
                            {errors.startDate && (
                                <p className="text-xs text-destructive">
                                    {errors.startDate.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5 min-w-0">
                            <label htmlFor="endDate" className="text-xs text-muted-foreground">
                                End Date
                            </label>
                            <Input
                                id="endDate"
                                type="date"
                                className="h-11 w-full appearance-none m-0 max-w-[100%]"
                                {...register("endDate")}
                            />
                            {errors.endDate && (
                                <p className="text-xs text-destructive">
                                    {errors.endDate.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full sm:w-auto h-11 px-8"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {isEditMode ? "Saving..." : "Creating..."}
                            </>
                        ) : (
                            isEditMode ? "Save Changes" : "Create Trip"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

// Keep backward-compatible named export for the create route
export const CreateTripPage = TripFormPage;
