type ECUnit = 'mS/cm';
type PHUnit = 'pH';

export interface MeasuredValue<Unit extends string> {
  value: number;
  unit: Unit;
}

export interface PlantData {
  id: string;
  title: string;
  species: string;
  environmentId: string;

  water?: { 
    ph?: MeasuredValue<PHUnit>; 
    ec?: MeasuredValue<ECUnit> 
  };
}