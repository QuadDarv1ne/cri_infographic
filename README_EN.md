<div align="center">

# CRI and Color Temperature v1.0.0

### Interactive Infographic on Color Rendering Index

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-new--york-black)](https://ui.shadcn.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055?logo=framer)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE)

---

**Author:** Dupley Maxim Igorevich

**Intellectual Property:** Dupley Maxim Igorevich

</div>

---

## About the Project

**CRI and Color Temperature** is an interactive web infographic dedicated to the Color Rendering Index (CRI) and color temperature of light. The project allows users to visually explore how different light sources affect color perception and includes interactive visualizations, comparison tables, and a quiz to test knowledge.

Information is based on GOST 54350-2015.

## Infographic Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | **CRI Scale** | Interactive CRI slider with visual gauge and room preview |
| 2 | **Where High CRI Matters** | Cards showcasing areas where color rendering quality is critical |
| 3 | **Light Source Types** | Comparison of incandescent, fluorescent, LED, and other lamps by CRI and temperature |
| 4 | **Color Temperature** | Interactive color temperature dial with light tone visualization |
| 5 | **Color Temperature Ranges** | Table of main ranges (warm, neutral, cool) and their applications |
| 6 | **Color Perception** | Color grid showing how color temperature affects hue perception |
| 7 | **Light Source Comparison** | Configure parameters of two light sources and compare color rendering |
| 8 | **Quiz** | 5 questions to test knowledge about CRI and color temperature |

## Features

- **Interactive CRI scale** with real-time visual feedback
- **Room preview** — see how interior perception changes with different light parameters
- **Animated visualizations** powered by Framer Motion
- **Responsive design** for all devices
- **Sticky navigation** across infographic sections
- **Scroll progress bar** and scroll-to-top button
- **Particle background** for visual depth

## Installation and Setup

### Prerequisites

- **Node.js** version 18 or higher (20+ recommended)
- **bun** (recommended) or npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cri_infographic.git
cd cri_infographic

# Install dependencies
bun install

# Run in development mode
bun run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
# Build the project
bun run build

# Run the built application
bun run start
```

## Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16 | React framework with App Router and optimization |
| **TypeScript** | 5 | Static typing for code reliability |
| **Tailwind CSS** | 4 | Utility-first CSS for rapid UI development |
| **shadcn/ui** | — | UI components in New York style |
| **Framer Motion** | 12 | Smooth animations and transitions |
| **Radix UI** | — | Accessible UI component primitives |
| **Lucide React** | — | Icon set for the interface |
| **Zustand** | 5 | Lightweight state management |

## Project Structure

```
cri_infographic/
├── public/                         # Static files
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with metadata
│   │   ├── page.tsx                # Main page (infographic sections)
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── CRIGauge.tsx            # Interactive CRI scale
│   │   ├── CRICards.tsx            # High CRI application areas
│   │   ├── ColorTemperatureDial.tsx # Color temperature dial
│   │   ├── TemperatureTable.tsx    # Temperature ranges table
│   │   ├── ColorGrid.tsx           # Color perception under different lighting
│   │   ├── RoomPreview.tsx         # Room preview visualization
│   │   ├── LightComparison.tsx     # Light source comparison
│   │   ├── CRIQuiz.tsx             # Quiz (5 questions)
│   │   ├── LightSourceTypes.tsx    # Light source types
│   │   ├── StickyNav.tsx           # Sticky navigation
│   │   ├── ParticleBackground.tsx  # Animated background
│   │   ├── ScrollToTop.tsx         # Scroll to top button
│   │   └── ui/                     # shadcn/ui components
│   └── lib/
│       └── utils.ts                # Utilities
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── README.md
├── README_RU.md
├── README_EN.md
└── LICENSE
```

## Configuration

### Database

SQLite is used by default (`prisma/dev.db`). PostgreSQL and MySQL are also supported. Set your database via `DATABASE_URL` in `.env`:

| Database | `DATABASE_URL` |
|----------|----------------|
| **SQLite** (default) | `file:./dev.db` |
| **PostgreSQL** | `postgresql://user:pass@localhost:5432/cri_infographic` |
| **MySQL** | `mysql://user:pass@localhost:3306/cri_infographic` |

Database commands:

```bash
bun run db:generate  # Generate Prisma client
bun run db:push      # Push schema to database
bun run db:migrate   # Create and apply migration
```

---

## Author

**Dupley Maxim Igorevich**

This project is the intellectual property of Dupley Maxim Igorevich. All rights to the source code, design, content, and materials belong to the author.

---

<div align="center">

**CRI and Color Temperature v1.0.0** — (c) 2026 Dupley Maxim Igorevich

</div>
