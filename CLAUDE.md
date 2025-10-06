# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL: Documentation Workflow - READ THIS FIRST ⚠️

**MANDATORY**: For EVERY interaction (questions, discussions, code changes), you MUST document IMMEDIATELY in the correct file BEFORE responding to the user:

### For discussions/questions WITHOUT code changes:
**→ Update `prompts-discussion.md` with:**
- User's full question
- Your complete response with reasoning
- Preserve all formatting and structure

**Examples:**
- "What do you think about feature X?" → `prompts-discussion.md`
- "Should we use technology Y?" → `prompts-discussion.md`
- "Can you suggest top 5 features?" → `prompts-discussion.md`

### For changes that involve code/files:
**→ Update ALL three files:**
1. **`prompts.md`**: User prompt + actions taken
2. **`prompts-visualization.md`**: Code block + files changed + line stats + description
3. **`public/dev-journey.svg`**: Add new step to visualization

**Examples:**
- "Add search functionality" → All 3 files
- "Fix bug in component X" → All 3 files
- "Update CLAUDE.md" → All 3 files (yes, even documentation changes!)

**⚠️ NO EXCEPTIONS. Document FIRST, respond SECOND. ⚠️**

## Project Overview

DUMP (Digital Unorganized Memory Pile) is a Progressive Web App (PWA) for capturing and storing images using the device camera. Images are stored locally in IndexedDB for offline access. Built with React + TypeScript + Vite.

## Commands

### Development
```bash
npm run dev          # Start development server (accessible at 0.0.0.0 for Gitpod)
npm run build        # Build for production (runs TypeScript compiler + Vite build)
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Testing
```bash
npm test             # Run tests in watch mode
npm run test:ui      # Run tests with Vitest UI
npm run test:coverage # Run tests with coverage report
```

## Architecture

### Data Flow & State Management

The app uses a layered architecture where state flows from IndexedDB through custom hooks to React components:

1. **Data Layer** (`src/lib/db.ts`): IndexedDB operations for storing/retrieving images as File objects with metadata
2. **Hook Layer**: Three custom hooks manage different concerns:
   - `useImageStorage`: Manages CRUD operations and maintains image list state
   - `useImageUrls`: Creates and manages object URLs from File objects, handles cleanup to prevent memory leaks
   - `useCameraCapture`: Handles camera input interaction via hidden file input
3. **Component Layer**: Presentation components receive data and callbacks via props

### Key Design Patterns

**Object URL Management**: Images are stored as File objects in IndexedDB. The `useImageUrls` hook creates temporary object URLs for rendering and automatically revokes them when images are deleted or component unmounts to prevent memory leaks.

**Hook Composition**: The main `App` component composes three specialized hooks, each handling a single concern. This separation makes testing easier and keeps logic reusable.

### Testing Setup

Tests use Vitest + React Testing Library with `jsdom` environment. IndexedDB tests use `fake-indexeddb` to mock browser storage (configured in `src/test/setup.ts`). When writing tests for database operations, ensure `fake-indexeddb/auto` is imported in the setup file.

### PWA Configuration

The app uses `vite-plugin-pwa` with `autoUpdate` registration. The PWA manifest is configured for standalone display mode with Norwegian text. Icon is `dump-icon.svg` in the public folder.


## Git Workflow

**IMPORTANT**: Never create git commits without explicit permission. Always ask the user before committing changes, as they prefer to review changes with `git diff` in their own editor first.
