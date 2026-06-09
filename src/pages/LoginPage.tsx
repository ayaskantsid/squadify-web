import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { loginDevUser }
    from "../auth/devAuth";

import { useAuth } from "../auth/AuthContext";
import api from "../api/apiClient";

import "./LoginPage.css";

/** Multicolour Google "G" logo (inline SVG). */
const GoogleIcon = () => (
    <svg
        className="login-google-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.43l3.66-2.84z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

/** Squadfish "S" logo icon. */
const SquadfishLogo = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

export const LoginPage = () => {

    const navigate = useNavigate();
    const { isAuthenticated, isLoading: authLoading, loginWithGoogle } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ping backend to wake it up (e.g., Render free tier sleep)
    useEffect(() => {
        api.get("/").catch(() => {
            // Silently ignore errors; we only care about waking it up
        });
    }, []);

    // If user is already logged in, redirect
    if (!authLoading && isAuthenticated) {
        navigate("/", { replace: true });
        return null;
    }

    // Reset local loading if auth process finished but user is not authenticated
    const prevAuthLoading = useRef(authLoading);
    useEffect(() => {
        if (prevAuthLoading.current === true && authLoading === false) {
            if (!isAuthenticated && loading) {
                setLoading(false);
            }
        }
        prevAuthLoading.current = authLoading;
    }, [authLoading, isAuthenticated, loading]);

    const handleGoogleLogin =
        async () => {
            setLoading(true);
            setError(null);

            try {
                await loginWithGoogle();
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Something went wrong. Please try again.";

                setError(message);
                setLoading(false);
            }
        };

    const handleDevLogin =
        async () => {
            setLoading(true);
            setError(null);

            try {
                await loginDevUser();
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Dev login failed.";

                setError(message);
                setLoading(false);
            }
        };

    return (
        <div className="login-page">
            {/* Animated background */}
            <div className="login-bg" />
            <div className="login-orb" />

            {/* Glass card */}
            <div className="login-card overflow-hidden">
                {/* Decorative fishes */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 animate-orb-slow pointer-events-none">
                    <div className="relative">
                        {/* Tail */}
                        <div className="absolute -left-5 -top-1 w-8 h-12 bg-white/5 rounded-[50%]" />
                        <div className="absolute -left-5 -bottom-1 w-8 h-12 bg-white/5 rounded-[50%]" />
                        {/* Body */}
                        <div className="w-24 h-16 bg-white/5 rounded-[50%]" />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 animate-orb-slow-reverse pointer-events-none">
                    <div className="relative">
                        {/* Tail */}
                        <div className="absolute -right-3 top-0 w-6 h-10 bg-white/5 rounded-[50%]" />
                        <div className="absolute -right-3 bottom-0 w-6 h-10 bg-white/5 rounded-[50%]" />
                        {/* Body */}
                        <div className="w-20 h-14 bg-white/5 rounded-[50%]" />
                    </div>
                </div>

                {/* Logo */}
                <div className="login-logo">
                    <SquadfishLogo />
                </div>

                {/* Title */}
                <h1 className="login-title">
                    Squadfish
                </h1>
                <p className="login-subtitle">
                    Split expenses effortlessly with your squad
                </p>

                {/* Divider */}
                <div className="login-divider">
                    <span>Get started</span>
                </div>

                {/* Google login */}
                <button
                    id="google-login-btn"
                    className="login-google-btn"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    type="button"
                >
                    {loading ? (
                        <div className="login-spinner" />
                    ) : (
                        <GoogleIcon />
                    )}
                    <span>
                        {loading
                            ? "Signing in…"
                            : "Continue with Google"}
                    </span>
                </button>

                {/* Dev login – DEV only */}
                {import.meta.env.DEV && (
                    <button
                        id="dev-login-btn"
                        className="login-dev-btn"
                        onClick={handleDevLogin}
                        disabled={loading}
                        type="button"
                    >
                        ⚡ Dev Login
                    </button>
                )}

                {/* Error */}
                {error && (
                    <div
                        className="login-error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {/* Footer */}
                <p className="login-footer">
                    By continuing, you agree to our
                    <br />
                    Terms of Service &amp; Privacy Policy
                </p>

            </div>
        </div>
    );
};