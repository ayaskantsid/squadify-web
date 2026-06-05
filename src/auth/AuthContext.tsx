import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { loginWithGoogle as firebaseLoginWithGoogle } from "./googleAuth";
import type { SquadifyUser } from "@/types/user";
import { initUser } from "@/api/auth";
import { toast } from "sonner";

type AuthContextType = {
    firebaseUser: FirebaseUser | null;
    squadifyUser: SquadifyUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    firebaseUser: null,
    squadifyUser: null,
    isAuthenticated: false,
    isLoading: true,
    loginWithGoogle: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [squadifyUser, setSquadifyUser] = useState<SquadifyUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const queryClient = useQueryClient();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setFirebaseUser(fbUser);
            
            if (fbUser) {
                try {
                    // Make sure we have the token available for apiClient
                    await fbUser.getIdToken();
                    const sqUser = await initUser(fbUser.displayName);
                    setSquadifyUser(sqUser);
                } catch (error) {
                    console.error("Failed to initialize user with backend:", error);
                    toast.error("Failed to load user profile. Please try refreshing.");
                }
            } else {
                setSquadifyUser(null);
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const loginWithGoogle = useCallback(async () => {
        try {
            // Note: The onAuthStateChanged listener handles the rest
            await firebaseLoginWithGoogle();
        } catch (error) {
            console.error("Google login failed:", error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            // Clear React Query cache immediately so no stale data persists
            queryClient.clear();
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    }, [queryClient]);

    return (
        <AuthContext.Provider
            value={{
                firebaseUser,
                squadifyUser,
                isAuthenticated: !!squadifyUser,
                isLoading,
                loginWithGoogle,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);