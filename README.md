# PlantMate 🌱

PlantMate is a personal web application for managing and monitoring plants across different growing environments.

The project started as a hobby project to explore **React, Next.js, TypeScript, client-side state management and data visualization** while building a more realistic application instead of a small tutorial project.

> **Status: Hobby project / no longer actively developed**

The application is not intended to be production-ready. It represents a snapshot of my learning and experimentation with frontend application architecture.

---

## Overview

PlantMate organizes plants into different environments and provides a dashboard-style interface for monitoring plant data and environmental conditions.

The application includes concepts such as:

* Environments
* Plants
* Plant events
* Historical plant data
* Environmental metrics
* Dashboard views
* Forms and validation
* Responsive UI components
* Interactive demonstrations

The project is implemented as a client-side Next.js application. Data is currently stored locally in the browser rather than in a backend database.

---

## Features

### Dashboard

The dashboard provides an overview of the available environments and plant-related information.

### Environments

Environments can contain multiple plants and represent different growing areas or setups.

### Plants

Plants can be created, updated and removed.

Plant data can also contain historical measurements and events.

### Plant history

Historical data can be associated with individual plants and displayed through the application's visualization components.

### Environmental data

The application contains structures for environmental and climate-related values, including form handling and validation.

### Data visualization

Plant and environmental data can be visualized using charts and sparklines.

### Demo mode

PlantMate includes a small interactive demo system that can guide users through parts of the application.

---

## Tech Stack

### Framework

* Next.js
* React
* TypeScript

### UI

* Sass
* Lucide React
* Custom reusable React components

### Data Visualization

* Recharts

### Client-side State

* React Context
* Custom React hooks
* Browser Local Storage

### Tooling

* ESLint
* TypeScript
* npm

---

## Project Structure

```text
src/
├── app/
│   ├── dashboard/
│   ├── environments/
│   ├── login/
│   └── ...
│
├── components/
│   ├── Button/
│   ├── Card/
│   ├── Form/
│   ├── MetricGrid/
│   ├── Modal/
│   ├── Sparkline/
│   ├── Table/
│   └── ...
│
├── config/
│
├── context/
│   ├── DemoContext.tsx
│   ├── EnvironmentContext.tsx
│   ├── ModalContext.tsx
│   ├── PlantContext.tsx
│   └── ToastContext.tsx
│
├── demo/
│
├── helpers/
│
├── hooks/
│
├── styles/
│
└── types/
```

The project separates pages, reusable UI components, application state, hooks, helper functions and domain types.

---

## Application Architecture

The application primarily uses React Context for client-side application state.

A simplified representation looks like this:

```text
                    ┌───────────────┐
                    │     Next.js   │
                    │      App      │
                    └───────┬───────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
       Components       Contexts          Hooks
            │               │               │
            └───────────────┼───────────────┘
                            │
                            ▼
                     Local Storage
```

Plant and environment state is managed on the client.

For example, the plant context provides operations for:

* adding plants
* updating plants
* deleting plants
* adding plant events
* removing plant events
* adding historical data
* removing historical data
* retrieving plants belonging to an environment

---

## Routing

The application uses the Next.js App Router.

The current structure includes routes for:

```text
/
├── dashboard
├── login
└── environments
    └── [environmentId]
        └── plants
            └── [plantId]
```

This allows individual environments and plants to have their own pages while keeping the application's domain structure reflected in the URL.

---

## TypeScript

TypeScript is used throughout the application with strict type checking enabled.

Domain-specific types are kept in the `src/types` directory rather than defining all application types directly inside components.

This includes types related to:

* plants
* environments
* authentication
* events
* tables
* demo functionality

---

## Reusable Components

One of the main goals of the project was to avoid building every page from scratch.

The application therefore contains reusable components such as:

* Buttons
* Cards
* Forms
* Modals
* Tables
* Tooltips
* Toast notifications
* Empty states
* Metric grids
* Sparklines
* Page layouts

The components are used throughout the application to keep the UI consistent.

---

## Local Development

### Requirements

* Node.js
* npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

### Build

```bash
npm run build
```

### Start production build

```bash
npm run start
```

### Lint

```bash
npm run lint
```

---

## Data Persistence

PlantMate currently uses browser-side persistence rather than a backend database.

Application state is stored using Local Storage.

This was a deliberate simplification for the hobby project and keeps the application self-contained without requiring a backend service.

---

## Current Limitations

PlantMate is **not a production-ready application**.

Some areas that would be required for a production version are currently missing or incomplete:

* Backend API
* Server-side persistence
* Database
* Real authentication
* Authorization
* Multi-user support
* Cloud/device data ingestion
* Automated tests
* Production monitoring
* Deployment infrastructure

The current implementation should therefore be viewed as a frontend-focused prototype and learning project.

---

## What I Learned

The main purpose of PlantMate was experimentation and learning.

During development I worked with:

* Next.js App Router
* React Context
* Custom hooks
* TypeScript domain models
* Form handling
* Client-side persistence
* Reusable component design
* Nested application routes
* Data visualization
* Responsive UI design
* Application-level state management

The project also helped me understand where client-side state management starts becoming difficult and where a backend/API would become useful.

---

## Future Ideas

The project is currently no longer actively developed.

If development were continued, possible next steps would include:

* Backend API
* Database persistence
* Real authentication
* Server-side data fetching
* IoT/sensor integration
* Real-time environmental measurements
* More advanced plant analytics
* Notifications and alerts
* Automated testing

These are ideas rather than implemented features.

---

## Project Status

**Archived as a personal hobby/learning project.**

PlantMate is not intended to demonstrate a production-ready architecture.

Instead, it represents an earlier stage of my development journey and experimentation with building a larger React/Next.js application from scratch.
