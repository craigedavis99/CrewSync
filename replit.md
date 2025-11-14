# CrewSync - Construction Crew Management Software

## Overview

CrewSync is a modern B2B SaaS application designed for small service businesses, specifically focusing on construction crew management and scheduling. The application helps service professionals manage phone calls, schedules, invoices, and customer communications efficiently. Currently, the project is in the landing page phase, showcasing the product's value proposition to potential customers.

The application emphasizes simplicity and ease of use, targeting small business owners who need professional tools without complex learning curves or expensive implementations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18+ with TypeScript for type safety and modern component patterns
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing (minimal alternative to React Router)
- TanStack Query (React Query) for server state management and API data fetching

**UI Framework:**
- shadcn/ui component library (Radix UI primitives with Tailwind CSS)
- Custom theming system with light/dark mode support
- "New York" style variant from shadcn/ui
- Comprehensive component library including dialogs, forms, navigation, cards, and data display elements

**Styling Approach:**
- Tailwind CSS for utility-first styling with custom configuration
- CSS custom properties (HSL-based color system) for dynamic theming
- Design system based on modern B2B SaaS standards (Linear, Notion, Slack-inspired)
- Responsive design with mobile-first approach
- Custom hover and elevation effects through utility classes

**State Management:**
- React Query for server state with aggressive caching strategies
- Local React state (useState, useContext) for UI-specific state
- Custom hooks for reusable stateful logic (use-mobile, use-toast)

**Key Frontend Decisions:**
- Component-based architecture with clear separation between pages, components, and UI primitives
- Example components provided for development reference
- Path aliases (@/, @shared, @assets) for cleaner imports
- No server-side rendering (rsc: false) - purely client-rendered SPA

### Backend Architecture

**Server Framework:**
- Express.js as the HTTP server framework
- TypeScript for type safety across the entire stack
- Node.js runtime environment

**Development Environment:**
- Vite middleware integration for HMR (Hot Module Replacement) in development
- Custom logging middleware for API request tracking
- Replit-specific plugins for development tooling (error overlay, cartographer, dev banner)

**API Structure:**
- RESTful API design pattern (routes prefixed with /api)
- Centralized route registration in server/routes.ts
- Request/response logging with duration tracking and JSON response capture
- JSON body parsing with raw body preservation for webhook verification

**Server Architecture Decisions:**
- Single HTTP server instance shared between Express and Vite
- Custom error handling and logging system
- Static file serving in production mode
- Middleware-based architecture for extensibility

### Data Storage Solutions

**Database Technology:**
- PostgreSQL as the primary relational database
- Neon Database serverless PostgreSQL service (@neondatabase/serverless driver)
- Drizzle ORM for type-safe database interactions

**Schema Management:**
- Drizzle Kit for schema migrations (migrations/ directory)
- Schema definitions in shared/schema.ts for code sharing between client and server
- Zod integration (drizzle-zod) for runtime validation
- UUID-based primary keys using PostgreSQL's gen_random_uuid()

**Current Schema:**
- Users table with id, username, and password fields
- Type-safe insert and select types generated from schema

**Storage Abstraction:**
- IStorage interface for database operations (enables testing and potential database swapping)
- MemStorage in-memory implementation for development/testing
- CRUD methods abstracted behind storage interface
- Separation between storage interface and implementation

**Data Architecture Decisions:**
- Shared schema types between frontend and backend via @shared path alias
- Connection pooling via Neon's serverless driver
- Environment-based database configuration (DATABASE_URL)
- Migration-based schema evolution strategy

### Authentication and Authorization

**Current State:**
- Basic user schema exists with username/password fields
- No authentication implementation yet (session management dependencies present: connect-pg-simple)
- Infrastructure prepared for session-based authentication

**Planned Architecture:**
- Session-based authentication using Express sessions
- PostgreSQL session store via connect-pg-simple
- Cookie-based session management with HTTP-only cookies

### External Dependencies

**Third-Party UI Libraries:**
- Radix UI primitives for accessible, unstyled component foundations
- Lucide React for consistent icon system
- Embla Carousel for carousel/slider functionality
- CMDK for command palette/search interfaces

**Development Tools:**
- ESBuild for server-side code bundling in production
- TSX for TypeScript execution in development
- Replit-specific development plugins (vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner)

**Utility Libraries:**
- date-fns for date manipulation and formatting
- clsx and tailwind-merge (via cn utility) for conditional className management
- class-variance-authority for component variant styling
- nanoid for unique ID generation

**Form Management:**
- React Hook Form (via @hookform/resolvers)
- Zod for schema validation

**Build & Deployment:**
- PostCSS with Tailwind CSS and Autoprefixer
- Vite for frontend bundling
- ESBuild for backend bundling
- Single-command build process creating both client and server bundles

**Design Assets:**
- Custom brand colors: Navy Blue (#1e293b), Cyan Blue (#38bdf8), Yellow (#fbbf24)
- Inter font family for professional typography
- Generated placeholder images for landing page features
- Logo asset integration

**Environment Configuration:**
- Environment variables for database connection (DATABASE_URL required)
- NODE_ENV-based conditional behavior for development vs production
- Replit-specific environment detection (REPL_ID)