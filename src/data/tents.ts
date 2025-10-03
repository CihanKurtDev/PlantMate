export interface PlantPhoto {
  src: string;
  alt: string;
  description: string;
}

export interface PlantData {
  id: string;
  title: string;
  water: { ph: number; ec: number };
  photos: PlantPhoto[];
  species: string;
  mainPhotoIndex?: number;
}

interface EnvironmentValue {
  value: number;
  unit: string;
}

export interface TentData {
  id: string;
  name: string;
  location?: string;        // optional: z. B. "Keller", "Wohnzimmer"
  species: string[]
  environment: {
    temp?: EnvironmentValue;
    rlf?: EnvironmentValue;
    vpd?: EnvironmentValue;
    co2?: EnvironmentValue;
  };
  plants: PlantData[];
}

export const tents: TentData[] = [
  {
    id: "1",
    name: "Tent A",
    location: "Wohnzimmer",
    species: ["Ficus lyrata"],
    environment: {
      temp: { value: 24, unit: "°C" },
      rlf: { value: 50, unit: "%" },
      vpd: { value: 0.8, unit: "kPa" },
    },
    plants: [
      {
        id: "1",
        title: "Ficus Monitor",
        species: "Ficus lyrata",
        water: { ph: 6.5, ec: 1.2 },
        photos: [
          { src: "/images/ficus1.jpg", alt: "ficus1", description: "Ficus Topf vorne links" },
          { src: "/images/ficus2.jpg", alt: "ficus2", description: "Ficus junge Blätter" }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Tent B",
    location: "Schlafzimmer",
    species: ["Monstera deliciosa", "Philodendron hederaceum"],
    environment: {
      temp: { value: 25, unit: "°C" },
      rlf: { value: 50, unit: "%" },
      vpd: { value: 0.9, unit: "kPa" },
      co2: { value: 400, unit: "ppm" }
    },
    plants: [
      {
        id: "1",
        title: "Monstera #1",
        species: "Monstera deliciosa",
        water: { ph: 6.2, ec: 1.1 },
        photos: [
          { src: "/images/monstera1.jpg", alt: "monstera", description: "Monstera großes Blatt" }
        ],
        mainPhotoIndex: 0
      },
      {
        id: "2",
        title: "Philodendron #1",
        species: "Philodendron hederaceum",
        water: { ph: 6.0, ec: 1.0 },
        photos: []
      }
    ]
  },
  {
    id: "3",
    name: "Tent C",
    location: "Keller",
    species: [],
    environment: {},
    plants: [] // Edge Case: kein Zeltinhalt
  },
  {
    id: "4",
    name: "Tent D",
    location: "Balkon",
    species: ["Ficus lyrata", "Monstera deliciosa", "Calathea orbifolia"],
    environment: {
      temp: { value: 22, unit: "°C" },
      rlf: { value: 60, unit: "%" },
    },
    plants: [
      {
        id: "1",
        title: "Calathea Orb",
        species: "Calathea orbifolia",
        water: { ph: 6.0, ec: 0.9 },
        photos: [
          { src: "/images/calathea1.jpg", alt: "calathea", description: "Calathea Blätter" }
        ]
      },
      {
        id: "2",
        title: "Ficus Mini",
        species: "Ficus lyrata",
        water: { ph: 6.5, ec: 1.1 },
        photos: []
      }
    ]
  },
  {
    id: "5",
    name: "Tent E",
    location: "Wohnzimmer",
    species: ["Monstera deliciosa"],
    environment: {
      temp: { value: 26, unit: "°C" },
      rlf: { value: 55, unit: "%" },
      co2: { value: 420, unit: "ppm" }
    },
    plants: [
      {
        id: "1",
        title: "Monstera Baby",
        species: "Monstera deliciosa",
        water: { ph: 6.2, ec: 1.0 },
        photos: []
      },
      {
        id: "2",
        title: "Monstera Adult",
        species: "Monstera deliciosa",
        water: { ph: 6.3, ec: 1.2 },
        photos: [
          { src: "/images/monstera2.jpg", alt: "monstera adult", description: "Monstera großes Blatt" }
        ],
        mainPhotoIndex: 0
      }
    ]
  },
  {
    id: "6",
    name: "Tent F",
    location: "Arbeitszimmer",
    species: ["Philodendron hederaceum"],
    environment: {
      temp: { value: 23, unit: "°C" },
    },
    plants: [
      {
        id: "1",
        title: "Philodendron #2",
        species: "Philodendron hederaceum",
        water: { ph: 6.1, ec: 1.0 },
        photos: []
      }
    ]
  },
  {
    id: "7",
    name: "Tent G",
    location: "Keller",
    species: ["Calathea orbifolia", "Ficus lyrata"],
    environment: {
      temp: { value: 21, unit: "°C" },
      rlf: { value: 65, unit: "%" },
    },
    plants: [
      {
        id: "1",
        title: "Calathea Mini",
        species: "Calathea orbifolia",
        water: { ph: 6.0, ec: 0.8 },
        photos: []
      },
      {
        id: "2",
        title: "Ficus #2",
        species: "Ficus lyrata",
        water: { ph: 6.5, ec: 1.2 },
        photos: [
          { src: "/images/ficus3.jpg", alt: "ficus2", description: "Ficus alte Blätter" }
        ]
      }
    ]
  },
  {
    id: "8",
    name: "Tent H",
    location: "Wohnzimmer",
    species: ["Monstera deliciosa", "Calathea orbifolia"],
    environment: {
      temp: { value: 24, unit: "°C" },
      rlf: { value: 50, unit: "%" },
      vpd: { value: 0.85, unit: "kPa" },
    },
    plants: [
      {
        id: "1",
        title: "Monstera #3",
        species: "Monstera deliciosa",
        water: { ph: 6.2, ec: 1.1 },
        photos: []
      },
      {
        id: "2",
        title: "Calathea #2",
        species: "Calathea orbifolia",
        water: { ph: 6.0, ec: 0.9 },
        photos: [
          { src: "/images/calathea2.jpg", alt: "calathea2", description: "Calathea Blätter" }
        ]
      }
    ]
  },
  {
    id: "9",
    name: "Tent I",
    location: "Schlafzimmer",
    species: ["Ficus lyrata", "Philodendron hederaceum", "Monstera deliciosa"],
    environment: {
      temp: { value: 25, unit: "°C" },
      rlf: { value: 55, unit: "%" },
      co2: { value: 430, unit: "ppm" }
    },
    plants: [
      {
        id: "1",
        title: "Ficus #3",
        species: "Ficus lyrata",
        water: { ph: 6.5, ec: 1.2 },
        photos: []
      },
      {
        id: "2",
        title: "Philodendron #3",
        species: "Philodendron hederaceum",
        water: { ph: 6.0, ec: 1.0 },
        photos: []
      },
      {
        id: "3",
        title: "Monstera #4",
        species: "Monstera deliciosa",
        water: { ph: 6.2, ec: 1.1 },
        photos: [
          { src: "/images/monstera3.jpg", alt: "monstera4", description: "Monstera neues Blatt" }
        ]
      }
    ]
  },
  {
    id: "10",
    name: "Tent J",
    location: "Keller",
    species: ["Calathea orbifolia"],
    environment: {
      temp: { value: 20, unit: "°C" },
      rlf: { value: 70, unit: "%" },
    },
    plants: [
      {
        id: "1",
        title: "Calathea #3",
        species: "Calathea orbifolia",
        water: { ph: 6.0, ec: 0.8 },
        photos: []
      }
    ]
  }
];
