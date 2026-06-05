import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { BottomNav } from "./BottomNav";

export const AppLayout = () => {
    return (
        <div className="min-h-svh flex flex-col bg-background">
            {/* Desktop top nav */}
            <div className="hidden sm:block">
                <BottomNav />
            </div>

            {/* Page content */}
            <main className="flex-1 mx-auto w-full max-w-2xl px-4 pb-20 sm:pb-6 pt-4 sm:pt-6">
                <Outlet />
            </main>

            {/* Mobile bottom nav */}
            <div className="sm:hidden">
                <BottomNav />
            </div>

            <Toaster
                position="top-center"
                richColors
                closeButton
            />
        </div>
    );
};
