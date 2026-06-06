import React from "react";
import ReactDOM from "react-dom/client";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import App from "./App";

import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./hooks/useTheme";

import "./index.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 2, // 2 minutes
        },
    },
});

ReactDOM.createRoot(
    document.getElementById("root")!
).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>
);