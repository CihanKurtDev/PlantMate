import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
    DEMO_IDS,
    DEMO_ENVIRONMENT,
    DEMO_PLANT,
    DEMO_CLIMATE_ENTRIES,
    DEMO_ENVIRONMENT_EVENT,
    DEMO_WATER_ENTRIES,
    DEMO_PLANT_EVENT,
} from "./demoData";
import { ENV_ROUTE, PLANT_ROUTE } from "./demoRoutes";

export type DemoActionContext = {
    router: AppRouterInstance;
    addEnvironment: (env: typeof DEMO_ENVIRONMENT) => void;
    deleteEnvironments: (ids: string[]) => void;
    addHistoryData: (environmentId: string, entry: (typeof DEMO_CLIMATE_ENTRIES)[number]) => void;
    addEventToEnvironment: (environmentId: string, event: typeof DEMO_ENVIRONMENT_EVENT) => void;
    addPlant: (plant: typeof DEMO_PLANT) => void;
    deletePlants: (ids: string[]) => void;
    addPlantHistoryData: (plantId: string, entry: (typeof DEMO_WATER_ENTRIES)[number]) => void;
    addEventToPlant: (plantId: string, event: typeof DEMO_PLANT_EVENT) => void;
    clickElement: (selector: string) => void;
    closeTopModal: () => void;
    waitForSelector: (selector: string, timeout?: number) => Promise<HTMLElement | null>;
    typeIntoField: (selector: string, text: string, charDelay?: number) => Promise<void>;
};

export type DemoStep = {
    title: string;
    description: string;
    targetSelector?: string;
    navigationDelay?: number;
    highlightAfterAction?: boolean;
    action?: (ctx: DemoActionContext) => void | Promise<void>;
};

export const DEMO_STEPS: DemoStep[] = [
    {
        title: "Willkommen bei GrowTrack",
        description:
            "Diese Demo zeigt dir in 2–3 Minuten die wichtigsten Bereiche: " +
            "Environments, Pflanzen, Messwerte, Wässerungen und Ereignisse. " +
            "Los geht's auf dem Dashboard.",
        targetSelector: '[data-demo="create-btn"]',
    },
    // Schritt 1: Environment anlegen
    {
        title: "Eine Umgebung anlegen",
        description:
            "Alles startet mit einer Umgebung – z.B. ein Growzelt, ein Gewächshaus " +
            "oder ein Raum. Über 'Neu' legst du sie an und wählst Typ und Standort.",
        targetSelector: '[data-demo="modal"]',
        action: async ({ clickElement, waitForSelector, typeIntoField }) => {
            clickElement('[data-demo="create-btn"]');
            await waitForSelector('[data-demo="modal"]');
            await typeIntoField('[data-demo="environment-name"]', "Demo Growzelt");
            await typeIntoField('[data-demo="environment-location"]', "Keller");
        },
    },
    // Schritt 2: Auf der Detailseite der Umgebung
    {
        title: "Die Umgebung ist erstellt",
        description:
            "Nach dem Speichern landest du auf der Detailseite der Umgebung. " +
            "Hier findest du später Klimadaten, Pflanzen und Ereignisse an einem Ort.",
        targetSelector: '[data-demo="main-container"]',
        navigationDelay: 80,
        highlightAfterAction: true,
        action: ({ closeTopModal, addEnvironment, router }) => {
            closeTopModal();
            addEnvironment(DEMO_ENVIRONMENT);
            router.push(ENV_ROUTE);
        },
    },
    // Schritt 3: Pflanze anlegen
    {
        title: "Erste Pflanze hinzufügen",
        description:
            "Im Pflanzen-Tab siehst du alle Pflanzen dieser Umgebung. " +
            "Mit dem 'Pflanze anlegen'-Button öffnest du das Formular zum Anlegen einer Pflanze.",
        targetSelector: '[data-demo="plants-tab"]',
    },
    // Schritt 4: Pflanze anlegen - Formular ausfüllen
    {
        title: "Das Pflanzen-Formular",
        description:
            "Du vergibst einen Namen, optional die Sorte und wählst ein Profil – " +
            "z.B. 'Kräuter'. Das Profil definiert Zielwerte für pH und EC " +
            "die später im Chart als grüne Zone angezeigt werden.",
        targetSelector: '[data-demo="modal"]',
        action: async ({ clickElement, waitForSelector, typeIntoField }) => {
            clickElement('[data-demo="add-plant-values-btn"]');
            await waitForSelector('[data-demo="modal"]');
            await typeIntoField('[data-demo="plant-name"]', "Basilikum Demo");
            await typeIntoField('[data-demo="plant-species"]', "Ocimum basilicum");
        },
    },
    // Schritt 5: Pflanze angelegt, jetzt auf der Detailseite
    {
        title: "Basilikum hinzugefügt",
        description:
            "Die Pflanze erscheint jetzt im Pflanzen-Tab. " +
            "Als nächstes trägst du eine Klimamessung ein " +
            "um den Verlauf im Chart zu sehen.",
        targetSelector: '[data-demo="plants-tab"]',
        action: ({ closeTopModal, addPlant }) => {
            closeTopModal();
            addPlant(DEMO_PLANT);
        },
    },
    // Schritt 6: Klimamessung eintragen
    {
        title: "Klimamessung eintragen",
        description:
            "Über 'Ereignis hinzufügen' öffnet sich ein Modal mit zwei Tabs: " +
            "'Klimamessung' für Temperatur, Feuchte, VPD und CO₂ – " +
            "und 'Ereignis' für alles ohne Messwert.",
        targetSelector: '[data-demo="add-event-btn"]',
    },
    // Schritt 7: Klimamessung eintragen - Formular ausfüllen
    {
        title: "Das Klimamessung-Formular",
        description:
            "Hier gibst du deine aktuellen Werte ein. " +
            "In der Demo fügen wir drei Messungen der letzten 3 Tage hinzu " +
            "damit der Chart sofort etwas zu zeigen hat.",
        targetSelector: '[data-demo="modal"]',
        navigationDelay: 120,
        action: async ({ clickElement, waitForSelector, typeIntoField }) => {
            clickElement('[data-demo="add-event-btn"]');
            await waitForSelector('[data-demo="modal"]');
            await typeIntoField('#demo-climate-temperature', "23");
            await typeIntoField('#demo-climate-humidity', "65");
            await typeIntoField('#demo-climate-co2', "620");
        },
    },
    // Schritt 8: Klimaverlauf im Chart
    {
        title: "Klimaverlauf im Chart",
        description:
            "Ab 2 Messungen baut sich der Chart auf. Die grüne Zone zeigt deinen " +
            "Zielbereich – Abweichungen erkennst du sofort an der Farbe der Punkte.",
        targetSelector: '[data-demo="data-tab"]',
        action: ({ closeTopModal, addHistoryData }) => {
            closeTopModal();
            DEMO_CLIMATE_ENTRIES.forEach((e) => addHistoryData(DEMO_IDS.environmentId, e));
        },
    },
    // Schritt 9: Ereignis dokumentieren
    {
        title: "Wartung & Ereignisse dokumentieren",
        description:
            "Alles was kein Messwert ist – Filterreinigung, neue Lampe, " +
            "Beobachtungen – kommt als Ereignis hierher. Mit Datum, Typ und Notiz.",
        targetSelector: '[data-demo="event-tab"]',
        action: ({ addEventToEnvironment }) => {
            addEventToEnvironment(DEMO_IDS.environmentId, DEMO_ENVIRONMENT_EVENT);
        },
    },
    // Schritt 10: Auf der Detailseite der Pflanze
    {
        title: "Zur Pflanzen-Detailseite",
        description:
            "Jede Pflanze hat ihre eigene Seite. " +
            "Im Pflanzen-Tab kannst du sie direkt anklicken – " +
            "hier navigieren wir direkt dorthin.",
        targetSelector: '[data-demo="plants-tab"]',
        navigationDelay: 160,
        highlightAfterAction: true,
    },
    //  Schritt 11: Wässerung eintragen
    {
        title: "Wässerung eintragen",
        description:
            "Auch hier öffnet 'Ereignis hinzufügen' ein Modal. " +
            "Der erste Tab ist die Wässerung: pH-Wert, EC und die Wassermenge in ml.",
        targetSelector: '[data-demo="add-event-btn"]',
         action: ({ router }) => {
            router.push(PLANT_ROUTE);
        },
    },
    // Schritt 12: Wässerung eintragen - Formular ausfüllen
    {
        title: "Das Wässerungs-Formular",
        description:
            "Du kannst mehrere Pflanzen gleichzeitig wässern – " +
            "wähle einfach weitere aus der Liste aus. " +
            "In der Demo fügen wir drei Wässerungen der letzten 3 Tage hinzu.",
        targetSelector: '[data-demo="modal"]',
        navigationDelay: 120,
        action: async ({ clickElement, waitForSelector, typeIntoField }) => {
            clickElement('[data-demo="add-event-btn"]');
            await waitForSelector('[data-demo="modal"]');
            await typeIntoField('#demo-water-ph', "6.2");
            await typeIntoField('#demo-water-ec', "1.4");
            await typeIntoField('#demo-water-amount', "500");
        },
    },
    // Schritt 13: pH- und EC-Verlauf im Chart
    {
        title: "pH- und EC-Verlauf",
        description:
            "Der Chart zeigt pH und EC deiner Kräuter-Pflanze – " +
            "die grüne Zone ist der Zielbereich aus dem 'Kräuter'-Profil. " +
            "Alle Werte liegen hier sauber im Bereich.",
        targetSelector: '[data-demo="data-tab"]',
        action: ({ closeTopModal, addPlantHistoryData }) => {
            closeTopModal();
            DEMO_WATER_ENTRIES.forEach((e) => addPlantHistoryData(DEMO_IDS.plantId, e));
        },
    },
    // Schritt 14: Pflanzen-Event dokumentieren
    {
        title: "Pflanzen-Events festhalten",
        description:
            "Umtopfen, Düngung, Schädlingsbehandlung – " +
            "hier wurde ein Umtopfen von 1L auf 3L dokumentiert. ",
        targetSelector: '[data-demo="event-tab"]',
        action: ({ addEventToPlant }) => {
            addEventToPlant(DEMO_IDS.plantId, DEMO_PLANT_EVENT);
        },
    },
    // Schritt 15: Pflanzen-Event dokumentieren
    {
        title: "Pflanzen-Events festhalten",
        description:
            "Um selber ein Event hinzuzufügen kannst du " +
            "hier auf den Button clicken. " +
            "Du kannst auch eigene Event-Typen mit eigenem Icon und Farben anlegen.",
        targetSelector: '[data-demo="add-event-btn"]',
    },
    // Schritt 16: Abschluss
    {
        title: "Das war GrowTrack 🌱",
        description:
            "Environments, Klimaverlauf, Pflanzen, Wässerungen, Events – " +
            "alles an einem Ort, ohne Abo und ohne Cloud. " +
            "Klicke 'Demo beenden' – die Demo-Daten werden gelöscht und du kannst loslegen.",
        targetSelector: undefined,
        action: ({ closeTopModal }) => {
            closeTopModal();
        },
    },
];