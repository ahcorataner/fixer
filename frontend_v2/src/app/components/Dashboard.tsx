import { getCurrentUser } from "../lib/ordersStore";
import { GestorDashboard } from "./GestorDashboard";

export function Dashboard() {
  const user = getCurrentUser();

  if (user.role === "gestor") {
    return <GestorDashboard />;
  }

  // Técnico também usa o dashboard por enquanto
  return <GestorDashboard />;
}