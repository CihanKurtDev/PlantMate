export const mockEvents = [
    {
        id: '1',
        environmentId: 'env-1',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        type: 'Climate_Adjustment',
        notes: 'Lüfter auf Stufe 2 erhöht',
        climateAdjustment: { setting: 'Ventilator', target: { value: 2, unit: 'Stufe' } }
    },
    {
        id: '2',
        environmentId: 'env-1',
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
        type: 'Maintenance',
        notes: 'Fenster gereinigt'
    },
    {
        id: '3',
        environmentId: 'env-1',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        type: 'Equipment_Change',
        equipmentChange: { equipment: 'Luftbefeuchter', action: 'ADDED' }
    },
    {
        id: '4',
        environmentId: 'env-1',
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
        type: 'Cleaning',
        notes: 'Grundreinigung durchgeführt'
    }
];

export const mockClimateHistory = Array.from({ length: 48 }, (_, i) => ({
    timestamp: Date.now() - i * 30 * 60 * 1000,
    temp: 22 + Math.random() * 4,
    humidity: 60 + Math.random() * 10
})).reverse();
