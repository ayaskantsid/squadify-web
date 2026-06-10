import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { InvitationsPage } from "./pages/InvitationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CreateTripPage } from "./pages/CreateTripPage";
import { TripDetailsPage } from "./pages/TripDetailsPage";
import { SettlementPage } from "./pages/SettlementPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                {/* Protected routes with layout */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/"
                        element={<DashboardPage />}
                    />
                    <Route
                        path="/invitations"
                        element={<InvitationsPage />}
                    />
                    <Route
                        path="/profile"
                        element={<ProfilePage />}
                    />
                    <Route
                        path="/profile/privacy-policy"
                        element={<PrivacyPolicyPage />}
                    />
                    <Route
                        path="/trips/new"
                        element={<CreateTripPage />}
                    />
                    <Route
                        path="/trips/:tripId"
                        element={<TripDetailsPage />}
                    />
                    <Route
                        path="/trips/:tripId/settlement"
                        element={<SettlementPage />}
                    />
                    <Route
                        path="/trips/:tripId/edit"
                        element={<CreateTripPage />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;