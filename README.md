# 🕷️ Vaibhav Chaudhary Portfolio - Dual Identity Portfolio

A stunning portfolio website that toggles between two identities:
- **Parker Mode**: Professional, clean, corporate tech vibe (Stark Industries)
- **Spidey Mode**: Action-packed, vibrant, hero-themed interface

## Features

### 🎨 Dual Identity System
- Seamless theme toggle between Parker and Spidey modes
- Zustand state management with persistence
- Dynamic CSS variables for instant theme switching
- Custom cursor effects (Spider-Sense in Spidey mode)

### 🚀 Sections

1. **Hero Section**
   - Dynamic content based on active mode
   - Smooth animations with Framer Motion
   - Spider-Sense ripple effects in Spidey mode

2. **Tech Arsenal (Skills)**
   - Categorized skills (Core Web, ML/DS, Infrastructure)
   - Web-connected grid in Spidey mode
   - Clean professional list in Parker mode
   - Skill proficiency bars

3. **Experience Timeline**
   - Vertical timeline with achievements
   - Web strand design in Spidey mode
   - Professional timeline in Parker mode
   - Quantitative metrics display

4. **Mission Files (Projects)**
   - Project cards with live status indicators
   - "Suit Upgrade" tags for ML/AI projects
   - Detailed project sheets with tech specs
   - ML model information display

5. **ML Lab (Stark Industries Research)**
   - Research projects showcase
   - Vector Database and Agentic AI specialization
   - Impact metrics and status badges

6. **Contact (Daily Bugle)**
   - Email copy functionality with "Webbed!" message
   - Sentiment analyzer for messages
   - Contact form integration

### 🎯 Special Features

- **Command Palette (Ctrl+K)**: Quick navigation to any section
- **Spider-Sense Alert**: Inactivity detection (30s) with animated alert
- **Sentiment Analyzer**: Real-time message sentiment detection
- **Responsive Design**: Mobile-first, works on all devices

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with CSS variables
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Customization

### Adding Projects

Edit `components/mission-files.tsx` and add to the `projects` array.

### Adding Skills

Edit `components/tech-arsenal.tsx` and add to the `skills` array.

### Modifying Themes

Edit CSS variables in `app/global.css`:
- Parker Mode: `:root` variables
- Spidey Mode: `.spidey-mode` variables

## Project Structure

```
├── app/
│   ├── global.css          # Theme CSS variables
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   └── tailwind.config.ts   # Tailwind configuration
├── components/
│   ├── navigation.tsx       # Navbar with theme toggle
│   ├── hero.tsx             # Hero section
│   ├── tech-arsenal.tsx     # Skills section
│   ├── experience-timeline.tsx
│   ├── mission-files.tsx    # Projects showcase
│   ├── ml-lab.tsx           # ML research section
│   ├── contact.tsx          # Contact form
│   ├── footer.tsx           # Footer
│   ├── command-palette.tsx  # Ctrl+K navigation
│   ├── spider-sense-alert.tsx
│   ├── sentiment-analyzer.tsx
│   ├── hero-toggle.tsx     # Theme toggle button
│   └── identity-wrapper.tsx # Theme wrapper
└── store/
    └── useIdentityStore.ts  # Zustand store
```

## License

MIT License - Feel free to use this for your own portfolio!

## Credits

Inspired by the dual identity of Peter Parker / Spider-Man. Built with great power and great responsibility! 🕷️

