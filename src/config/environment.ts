import { Home, Tent, Leaf } from "lucide-react";
import { EnvironmentType } from "@/types/environment";

export const ENVIRONMENT_ICONS: Record<EnvironmentType, any> = {
    TENT: Tent,
    ROOM: Home,
    GREENHOUSE: Leaf,
};

export const ENVIRONMENT_LABELS: Record<EnvironmentType, string> = {
    TENT: "Zelt",
    ROOM: "Raum",
    GREENHOUSE: "Gewächshaus",
};