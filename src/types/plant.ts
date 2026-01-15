export type ECUnit = 'mS/cm';
export type PHUnit = 'pH';

export interface MeasuredValue<Unit extends string> {
  value: number;
  unit: Unit;
}

interface WaterData { 
  ph?: MeasuredValue<PHUnit>; 
  ec?: MeasuredValue<ECUnit> 
}

export interface PlantData {
  id: string | undefined;
  title: string;
  species: string;
  environmentId: string;
  water?: WaterData;
  historical?: PlantData_Historical[];
  events?: PlantEvent[];
}

export interface PlantData_Historical {
  id: string;
  plantId: string;
  timestamp: number;
  water?: WaterData
  height?: MeasuredValue<'cm'>;
  notes?: string;
}

export type PlantEventType = 
  'WATERING' 
  | 'REPOTTING' 
  | 'PEST_CONTROL'
  | 'FERTILIZING'
  | 'PRUNING';

export interface PlantEvent {
  id: string;
  plantId: string;
  timestamp: number;
  type: PlantEventType;
  notes?: string;

  watering?: {
    amount: MeasuredValue<'ml' | 'L'>;
    nutrients?: {
      ec?: MeasuredValue<ECUnit>;
      ph?: MeasuredValue<PHUnit>;
    };
  }
  repotting?: {
    oldPotSize?: MeasuredValue<'L'>;
    newPotSize: MeasuredValue<'L'>;
    substrate?: string;
  };
  
  pestControl?: {
    pest: string;
    treatment: string;
  };
  
  fertilizing?: {
    fertilizer: string;
    amount?: MeasuredValue<'ml' | 'g'>;
  };
}