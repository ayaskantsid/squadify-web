import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const ProfilePage = () => {
    const { squadifyUser, firebaseUser, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            toast.error("Failed to sign out.");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Profile
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Your account details
                </p>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                        Account
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        {firebaseUser?.photoURL ? (
                            <img
                                src={firebaseUser.photoURL}
                                alt={
                                    squadifyUser?.displayName ??
                                    "Avatar"
                                }
                                className="h-12 w-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">
                                {squadifyUser?.displayName ??
                                    "User"}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                                {squadifyUser?.email}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                        Preferences
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium leading-none">Theme</span>
                            <span className="text-xs text-muted-foreground">Toggle light or dark mode.</span>
                        </div>
                        <ThemeToggle />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
