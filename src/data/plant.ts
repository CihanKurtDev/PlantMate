export interface PlantPhoto {
    src: string;
    alt: string;
    description: string;
}

export interface PlantData {
    id: string;
    title: string;
    plantName: string;
    water: { ph: number; ec: number };
    environment: { temp: number; rlf: number; vpd: number };
    tent?: string;
    photos: PlantPhoto[];
    mainPhotoIndex?: number;
}

export const plants: PlantData[] = [
  {
    id: "1",
    title: "Ficus Monitor",
    plantName: "Ficus lyrata",
    water: { ph: 6.5, ec: 1.2 },
    environment: { temp: 24, rlf: 50, vpd: 0.8 },
    photos: [
      { src: "/images/ficus1.jpg", alt: "ficus1", description: "Ficus Topf vorne links" },
      { src: "/images/ficus2.jpg", alt: "ficus2", description: "Ficus junge Blätter" }
    ]
  },
  {
    id: "2",
    title: "Monstera App",
    plantName: "Monstera deliciosa",
    water: { ph: 6.2, ec: 1.1 },
    environment: { temp: 25, rlf: 55, vpd: 0.9 },
    photos: [
      { src: "/images/monstera1.jpg", alt: "monstera", description: "Monstera großes Blatt" }
    ],
    mainPhotoIndex: 0
  }
];

