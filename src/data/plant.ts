interface PlantData {
    id: string,
    title: string,
    plantName: string,
    water: {ph: number, ec: number}
    environment: {temp: number, rlf: number, vpd: number}
    tent?: string
}

interface PlantPhoto {
    id: string;
    plantId: string; // PlantData.id
    url: string;
    description?: string;
}


export const plants: PlantData[] = [
    { 
        id: "1", 
        title: "Ficus Monitor", 
        plantName: "Ficus lyrata", 
        water: {ph:6.5, ec:1.2}, 
        environment: {temp:24, rlf:50, vpd:0.8} 
    },
    {
        id: "2", 
        title: "Monstera App", 
        plantName: "Monstera deliciosa", 
        water: {ph:6.2, ec:1.1}, 
        environment: {temp:25, rlf:55, vpd:0.9} 
    }
];

export const photos: PlantPhoto[] = [
    {
        id: "p1-1",
        plantId: "1",
        url: "/images/ficus1.jpg",
        description: "Ficus Topf vorne links"
    },
    {
        id: "p1-2",
        plantId: "1",
        url: "/images/ficus2.jpg",
        description: "Ficus junge Blätter"
    },
    {
        id: "p2-1",
        plantId: "2",
        url: "/images/monstera1.jpg",
        description: "Monstera großes Blatt"
    }
];
