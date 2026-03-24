import { ActivityIcon, Droplet, Leaf, Thermometer, Wind } from "lucide-react";

export const iconMap = { Leaf, Thermometer, ActivityIcon, Droplet, Wind } as const;

export type IconMapKey = keyof typeof iconMap;