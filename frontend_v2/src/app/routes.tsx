import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { AssetsList } from "./components/AssetsList";
import { AssetForm } from "./components/AssetForm";
import { WorkOrder } from "./components/WorkOrder";
import { MaintenanceHistory } from "./components/MaintenanceHistory";
import { Login } from "./components/Login";
import { ForgotPassword } from "./components/ForgotPassword";
import { Register } from "./components/Register";
import { Reports } from "./components/Reports";
import { SettingsPage } from "./components/SettingsPage";

import { useAuth } from "./hooks/useAuth";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      Carregando...
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function GestorRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return profile?.role === "gestor" ? (
    <>{children}</>
  ) : (
    <Navigate to="/work-orders" replace />
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "assets",
        element: (
          <GestorRoute>
            <AssetsList />
          </GestorRoute>
        ),
      },
      {
        path: "assets/new",
        element: (
          <GestorRoute>
            <AssetForm />
          </GestorRoute>
        ),
      },
      {
        path: "assets/:id/edit",
        element: (
          <GestorRoute>
            <AssetForm />
          </GestorRoute>
        ),
      },
      {
        path: "work-orders",
        Component: WorkOrder,
      },
      {
        path: "history",
        Component: MaintenanceHistory,
      },
      {
        path: "reports",
        Component: Reports,
      },
      {
        path: "settings",
        Component: SettingsPage,
      },
    ],
  },
]);