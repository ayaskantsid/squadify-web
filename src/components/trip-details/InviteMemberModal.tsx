import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send } from "lucide-react";

const inviteSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

type InviteMemberModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInvite: (email: string) => void;
    isPending: boolean;
};

export const InviteMemberModal = ({
    open,
    onOpenChange,
    onInvite,
    isPending,
}: InviteMemberModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = (data: InviteFormValues) => {
        onInvite(data.email);
        reset();
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) reset();
        onOpenChange(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Invite Member
                    </DialogTitle>
                    <DialogDescription>
                        Enter the Google account email of the person you want to invite to
                        this trip.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="invite-email">Email Address</Label>
                        <Input
                            id="invite-email"
                            type="email"
                            placeholder="friend@gmail.com"
                            {...register("email")}
                            autoFocus
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            <Send className="h-4 w-4 mr-1.5" />
                            {isPending ? "Sending..." : "Send Invite"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
