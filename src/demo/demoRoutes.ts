import { DEMO_IDS } from "../demo/demoData";

export const ENV_ROUTE = `/environments/${DEMO_IDS.environmentId}`;
export const PLANT_ROUTE = `${ENV_ROUTE}/plants/${DEMO_IDS.plantId}`;