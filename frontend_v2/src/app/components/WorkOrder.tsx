import { getCurrentUser } from "../lib/ordersStore";
import { GestorOrdens } from "./GestorOrdens";
import { TecnicoOrdens } from "./TecnicoOrdens";

export function WorkOrder() {
  const user = getCurrentUser();
  return user.role === "gestor" ? <GestorOrdens /> : <TecnicoOrdens />;
}
