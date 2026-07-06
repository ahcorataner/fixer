import { createBrowserRouter, Navigate } from "react-router";
import type { ReactNode } from "react";

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
import { GestorAtribuicoes } from "./components/GestorAtribuicoes";

import { useAuth } from "./hooks/useAuth";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      Carregando...
    </div>
  );
}

function normalizeText(value?: string | null) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isGestorRole(role?: string | null) {
  const normalizedRole = normalizeText(role);

  return normalizedRole === "gestor" || normalizedRole.includes("gestor");
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function GestorRoute({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return isGestorRole(profile?.role) ? (
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
        path: "assignments",
        element: (
          <GestorRoute>
            <GestorAtribuicoes />
          </GestorRoute>
        ),
      },
      {
        path: "history",
        Component: MaintenanceHistory,
      },
      {
        path: "reports",
        element: (
          <GestorRoute>
            <Reports />
          </GestorRoute>
        ),
      },
      {
        path: "settings",
        Component: SettingsPage,
      },
    ],
  },
]);