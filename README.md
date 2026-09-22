# Agentic Lead Command Center

A 3D pipeline visualization and operations console for monitoring autonomous AI-driven sales workflows, built with **Vite**, **React 19**, **TypeScript**, **Three.js**, and **Tailwind CSS**.

---

## 1. Product Overview

The **Agentic Lead Command Center** provides operational observability for an autonomous, multi-agent sales pipeline. In an agentic revenue system, incoming leads are ingested, qualified by AI heuristics, routed to specialized agents, nurtured, negotiated, and closed.

This prototype physicalizes the lead pipeline into three interconnected views, answering three fundamental operational questions:
1. **Operations Dashboard**: *"How is the business performing?"*
2. **3D Command Center**: *"What is happening right now?"*
3. **Individual Lead Journey**: *"What happened to this lead?"*

> **Scope Notice**:  
> This is a **standalone client-side frontend prototype**. It operates entirely in the browser using deterministic simulation and mock data. There is no backend server, live database, production AI model, or external API integration (WhatsApp, Facebook, Website, and Email are modeled as inbound source channels).

---

## 2. The Problem It Solves

When businesses automate sales processes using autonomous AI agents (qualification bots, conversational agents, scheduling assistants, and pricing closers), visibility into the pipeline is often lost:
- **Pipeline Blindspots**: Operators cannot visually observe where leads are congregating, which stages are backlogged, or which AI agent currently holds custody of a deal.
- **Siloed Inbound Channels**: Leads arriving from disparate channels (WhatsApp, Website Direct, Facebook Ads, Inbound Email) lack a unified spatial representation.
- **Opaque Agent Handoffs**: Transitions between autonomous agents are traditionally buried in disparate logs rather than tracked in an understandable visual timeline.
- **Supervisory Control**: Operators need an intuitive way to inspect active leads in real time and manually advance stalled records through the pipeline.

---

## 3. The Three Connected Experiences

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│   [Engine Status] [UTC Clock] [Tabs: Dashboard / 3D / Journey] [Sim]   │
└────────────────────────────────────────────────────────────────────────┘
        │                                  │                   │
        ▼                                  ▼                   ▼
┌──────────────────┐             ┌──────────────────┐ ┌──────────────────┐
│   Operations     │             │    3D Command    │ │   Individual     │
│   Dashboard      │────────────▶│      Center      │ │   Lead Journey   │
│ (2D Aggregated)  │   Launch    │  (WebGL Flow)    │ │ (Audit Timeline) │
└──────────────────┘     CTA     └─────────┬────────┘ └────────┬─────────┘
                                           │                   ▲
                                           │   Inspect Full    │
                                           └─── Journey ───────┘
```

### Experience 1: Operations Dashboard (`?view=dashboard`)
*Focus: "How is the business performing?"*

A dense, 2D operational overview designed for quick executive and supervisory assessment:
- **KPI Summary Cards**: Real-time metrics computed directly from active lead state:
  - **Active Leads**: Total count of in-flight opportunities currently traversing stages 1 through 5.
  - **Qualified**: Leads meeting or exceeding the qualification threshold (Score $\ge 80$).
  - **Won Today (Count & ARR)**: Total contracts executed today and their aggregate contract value.
  - **Won This Week**: Rolling weekly volume and accumulated deal ARR.
  - **Conversion Rate**: Percentage of processed leads successfully reaching the terminal stage.
  - **Average Velocity**: Average cycle time from intake to close.
- **Stage Funnel Breakdown**: Horizontal distribution chart displaying lead counts across all 6 stages, equipped with direct camera shortcuts to inspect any stage in the 3D scene.
- **Multi-Channel Source Matrix**: Proportional volume and share across modeled inbound channels: WhatsApp, Website Direct, Facebook Ads, and Inbound Email.
- **AI Agent Fleet Workload**: Operational status cards for 4 modeled agents (*Conversation Agent v3.4, Sales Closer Agent v4.1, Meeting Agent v2.8, Support Agent v3.0*) showing active status (*processing, routing, idle*), current assigned leads, lifetime processed count, and average resolution latency.
- **Recent Activity Feed**: Real-time chronological event log with links to inspect individual leads.
- **Launch CTA**: Fast navigation banner transitioning directly to the 3D Command Center.

---

### Experience 2: 3D Command Center (`?view=command-center`)
*Focus: "What is happening right now?"*

The primary monitoring experience, rendering the sales pipeline across **6 spatial zones** in an interactive 3D WebGL scene:
1. **Intake Port** (`x: -50`): Inbound entry stage with multi-channel feeder conduits (WhatsApp, Website, Facebook, Email).
2. **AI Qualification** (`x: -30`): Heuristic scoring platform with concentric scanning rings.
3. **AI Agent Routing** (`x: -10`): Hexagonal central dispatch hub with 4 satellite agent pods.
4. **Engagement Track** (`x: +10`): Multi-touch nurturing and conversational cadence zone.
5. **Deal Desk** (`x: +30`): Proposal synthesis and procurement negotiation platform.
6. **Terminal / Won** (`x: +50`): Final closed-won station with circular completion ring.

#### 3D Interactions & Features
- **Dynamic 3D Lead Nodes**: Rendered as faceted icosahedrons with color-coded cores matching the assigned AI agent and orbital rings indicating priority tier (*Low, Medium, High, Critical*).
- **Physicalized Motion**: When a lead advances, it travels smoothly along a cubic Bézier curve between platforms rather than teleporting.
- **Pulsing Conduits**: Flow lines connecting stages feature animated traveling particle pulses.
- **Floating 3D Zone Badges**: Holographic billboard text sprites above each platform display live, synchronized lead counts.
- **Raycast Hover & Selection**:
  - Hovering over a lead displays a cursor tooltip with ID, company, contact name, and qualification score.
  - Clicking a lead smoothly pans the camera and opens the **Lead Drawer Preview**.
- **Lead Drawer Preview**:
  - Displays selected lead details, channel source, stage, priority, ARR, and assigned agent.
  - **Advance Stage (Manual Push)**: Manually advances the selected lead to the next sequential stage.
  - **Inspect Full Journey**: Deep-links to the full lifecycle audit page for this lead.
  - Dismisses via close `(X)` button, clicking the background, or pressing `Escape`.
- **Zone Navigation Dock**: Bottom dock allowing one-click camera fly-tos to any stage or resetting to pipeline overview.
- **Pipeline Filter Bar**: Multi-criteria filtering by channel source, assigned agent, priority tier, health status, and free-text search.

---

### Experience 3: Individual Lead Journey (`?view=lead-journey`)
*Focus: "What happened to this lead?"*

A detailed audit and drill-down view tracing a single lead's entire lifecycle:
- **Lead Header Card**: Contact credentials, source channel badge, stage indicator, priority tier, health status, contract ARR value, and qualification score.
- **Stage Progress Stepper**: 6-step horizontal progress tracker with completed checks and an active pulsing beacon on the current stage.
- **Agent Handoff Flow**: Visual sequence diagram showing the chain of custody across assigned AI agents.
- **Timestamped Chronological Timeline**: Audit trail recording discrete lifecycle events with human-readable timestamps (`HH:MM:SS`), event categories, descriptions, and metadata badges.
- **Technical Metadata Inspector**: Displays applied operational tags, operational dispatch notes, and a formatted view of the raw ingested lead JSON record.
- **Unselected Lead Catalog**: If opened without an active selection, displays a searchable catalog grid of all leads to choose from.

---

## 4. Main User Flow

1. **Assess Performance (Dashboard)**: The user opens the application, reviews macro KPIs (active lead count, conversion rate, velocity), identifies channel distribution, and checks agent fleet workload.
2. **Enter Real-Time Flow (3D Command Center)**: The user clicks "Launch 3D Command Center" or the top navigation tab to observe leads moving between zones in 3D space.
3. **Filter & Inspect (Command Center)**: The user filters by channel or priority, hovers over active nodes to inspect scores, and clicks a specific node.
4. **Intervene or Trace (Lead Drawer)**: The camera centers on the selected node and the drawer slides open. The user can manually advance the lead to the next stage or click "Inspect Full Journey".
5. **Audit Lifecycle (Lead Journey)**: The user reviews the complete history: when the lead entered, which agent touched it first, subsequent agent handoffs, timestamped events, and technical parameters.

---

## 5. Technical Architecture

```
src/
├── app/
│   ├── ErrorBoundary.tsx      # Root error boundary with console recovery
│   └── Navigation.tsx         # Top bar with tabs, UTC clock, and simulation controls
├── data/
│   ├── agentsData.ts          # Agent definitions (Conversation, Sales, Meeting, Support)
│   ├── initialLeads.ts        # Seed mock lead records with historical event logs
│   └── pipelineConfig.ts      # 6 pipeline stage definitions and 3D world coordinates
├── features/
│   ├── command-center/        # 3D Command Center view, HUD, filter bar, dock, and drawer
│   ├── dashboard/             # 2D Dashboard view, KPI cards, funnel chart, agent matrix
│   └── lead-journey/          # Individual lead journey view, stepper, timeline, inspector
├── hooks/
│   ├── usePipelineStore.ts    # Shared module-level reactive state store
│   └── useSimulation.ts       # Deterministic pipeline simulation engine
├── three/
│   ├── CameraRig.ts           # Damped OrbitControls and smooth camera fly-to transitions
│   ├── EnvironmentGrid.ts     # Dark cyber grid and coordinate markings
│   ├── FlowLineManager.ts     # Cubic Bézier energy conduits and particle pulses
│   ├── InteractionManager.ts  # Raycasting for hover tooltips and node selection
│   ├── LeadNodeManager.ts     # 3D lead node geometry, glowing cores, and motion tweens
│   ├── Lighting.ts            # Ambient and directional three-point lighting setup
│   ├── SceneManager.ts        # Three.js lifecycle coordinator and decoupled render loop
│   └── ZoneManager.ts         # 6 spatial stage platforms and floating count sprites
├── types/
│   └── pipeline.ts            # TypeScript interfaces for leads, events, agents, stages
└── utils/
    ├── colors.ts              # Stage, source, priority, and agent color palettes
    └── formatters.ts          # Currency, number, and timestamp formatters
```

---

## 6. State Management & Simulation

### Shared Reactive State Store (`usePipelineStore.ts`)
State is managed via a shared module-level reactive store utilizing a lightweight listener-notification pattern:
- **Synchronized State**: Active leads array, selected lead ID, focused 3D zone, active view, filter criteria, and simulation parameters.
- **Cross-View Synchronization**: When a lead advances—either automatically via the simulation engine or manually through the drawer—the 3D node position, dashboard KPI counters, funnel bars, and journey timeline update simultaneously.

### Deterministic Simulation Engine (`useSimulation.ts`)
- **Progression Loop**: Evaluates candidate leads across stages and advances them sequentially along the pipeline order (`intake → qualification → routing → followup → deal → won`).
- **Event Generation**: Appends immutable, timestamped `LeadEvent` records to the advancing lead's audit history.
- **Periodic Ingestion**: Periodically generates and injects new synthetic leads into the Intake Port stage.
- **Controls**:
  - **Play / Pause**: Pause or resume the automatic progression loop.
  - **Step**: Manually step forward by 1 tick when paused.
  - **Speed Presets**: Toggle between `1x` (~2.8s/tick), `2x`, and `5x` execution rates.
  - **Reset**: Restores pipeline state and event logs to initial seed data.
  - **Inject Lead**: Manually push a new synthetic lead into the Intake Port.

---

## 7. Three.js Rendering Architecture

- **Decoupled Animation Loop**: The 3D render loop runs independently in `requestAnimationFrame` inside `SceneManager`, decoupled from React's component rendering lifecycle to avoid unnecessary React re-renders.
- **Spatial Positioning**: Stages are spaced uniformly along the X-axis (`[-50, -30, -10, +10, +30, +50]`), giving leads a clear, intuitive direction of flow.
- **Bézier Motion Interpolation**: Transitions calculate quadratic/cubic Bézier midpoints with vertical arcs (`Y + 6`), smoothly interpolating position and orientation using cubic easing.
- **Object Cleanup & Disposal**: Geometries, materials, textures, and canvas event listeners are systematically disposed of on unmount to prevent WebGL context leaks.
- **Interaction Raycasting**: Pointer displacement tracking distinguishes intentional node clicks from orbital camera dragging.

---

## 8. Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **3D Graphics**: Three.js
- **Styling**: Tailwind CSS (dark theme, custom operational color palette)
- **Icons**: Lucide React
- **Linter**: Oxlint

---

## 9. Local Setup & Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd <repository-directory>

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build & Production Preview
```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 10. Deployment Instructions

This application builds to static assets in the `dist/` directory and can be deployed directly to **Vercel**, **Netlify**, or **GitHub Pages**.

### Vercel Deployment
```bash
# Deploy using Vercel CLI
npx vercel

# Or push to GitHub and import the repository in the Vercel Dashboard
# Build Command: npm run build
# Output Directory: dist
```

### Netlify Deployment
```bash
# Build Command: npm run build
# Publish Directory: dist
```

---

## 11. Known Limitations

- **Mock Data Scope**: All leads, agent metrics, and pipeline events are generated client-side; no backend database or external APIs are connected.
- **In-Memory Volatility**: State modifications and injected leads persist during the browser session but reset to initial seed data upon a full page reload.
- **Linear Stage Trajectory**: Leads progress through a fixed 6-stage linear sequence; non-linear looping, branch splits, and stage rollbacks are not modeled in this prototype.
- **Device Requirements**: The 3D Command Center requires a WebGL-capable browser and GPU acceleration for smooth rendering.
