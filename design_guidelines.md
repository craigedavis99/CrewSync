# CrewSynch Landing Page Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (SaaS/B2B Product)
Drawing inspiration from modern B2B SaaS leaders like Linear, Notion, and Slack - clean, professional, trust-building interfaces that emphasize clarity and conversion.

**Core Principle:** Professional credibility meets approachable functionality. The construction/crew management context requires both authority and ease-of-use signals.

## Brand Colors (From Logo)

- **Navy Blue:** #1e293b (primary text, backgrounds)
- **Cyan Blue:** #38bdf8 (tech accents, interactive elements)
- **Yellow:** #fbbf24 (CTA highlights, important actions)
- **Supporting:** White #ffffff, Gray #64748b, Light Gray #f1f5f9

## Typography

**Font Stack:**
- Primary: 'Inter' (headings, UI) - professional, modern SaaS standard
- Secondary: 'Inter' (body text) - maintain consistency

**Hierarchy:**
- Hero Headline: 3.5rem/4rem (56px/64px), font-weight 700
- Section Headings: 2.25rem (36px), font-weight 700
- Subheadings: 1.5rem (24px), font-weight 600
- Body Text: 1rem (16px), font-weight 400, line-height 1.7
- Small Text: 0.875rem (14px), font-weight 400

## Layout System

**Spacing Units:** Tailwind scale - primarily using 2, 4, 6, 8, 12, 16, 20, 24, 32
- Component padding: p-4, p-6, p-8
- Section spacing: py-16, py-20, py-24
- Element gaps: gap-4, gap-6, gap-8

**Container Strategy:**
- Max-width: 1280px (max-w-7xl)
- Content max-width: 1024px (max-w-6xl) for text-heavy sections
- Consistent horizontal padding: px-6 (mobile), px-8 (desktop)

## Navigation Bar Design

**Structure:**
- Height: 80px desktop, 72px mobile
- Fixed positioning with backdrop blur effect
- Navy blue background with 95% opacity
- Subtle bottom border (1px, gray-200)

**Logo Placement:**
- Left-aligned, 48px height
- 24px left padding from container edge

**Navigation Items:**
- Horizontal center alignment
- 16px spacing between items
- Typography: 0.9375rem (15px), font-weight 500
- Navy blue text with cyan underline on hover (2px, animated)
- Smooth 200ms transitions

**CTA Buttons:**
- "Sign up for Free Trial": Yellow background (#fbbf24), navy text, rounded-lg, px-6 py-3, font-weight 600, shadow-md
- "Log In": Navy outline (2px), transparent background, cyan text, rounded-lg, px-6 py-3, font-weight 600
- Both buttons: 44px min-height for touch targets

**Mobile Behavior:**
- Hamburger menu (navy) right-aligned
- Slide-in drawer with navy background
- Stacked navigation items with generous spacing (py-4)
- Buttons full-width in mobile drawer

## Hero Section

**Layout:**
- Full viewport height (90vh)
- Two-column grid (desktop): 60/40 split for content/visual
- Single column (mobile) with content first

**Content Column:**
- Headline: "Streamline Your Construction Crew Management" (or similar)
- Subheading: Problem/solution statement, 1.25rem, gray-600
- Dual CTAs: Primary yellow button + Secondary outlined button
- Trust indicators below CTAs: "Trusted by 500+ construction teams" with small logos or icons

**Visual Column:**
- Large hero image showing construction crew using tablets/technology on site
- Image treatment: Subtle cyan-to-navy gradient overlay (15% opacity)
- Floating UI cards showcasing app features (scheduling, crew assignments)
- Buttons on image: Blurred background (backdrop-blur-md), white/cyan borders

## Additional Landing Page Sections

**Features Section (3-column grid):**
- Icons: Construction-themed (hard hat, calendar, team, tools)
- Each card: Icon top, title, description, cyan accent line
- White background cards with subtle shadow, rounded-xl

**Benefits Section (Alternating 2-column):**
- Row 1: Image left, content right
- Row 2: Content left, image right
- Images: Real construction scenarios, team collaboration
- Content: Headline, bullet points with checkmarks (cyan)

**Social Proof Section:**
- 3-column testimonial cards
- Profile images, company logos, star ratings
- Navy background section with white text

**CTA Section:**
- Centered content, navy background
- Large headline, yellow CTA button
- Trust badges below (security, compliance icons)

**Footer:**
- 4-column layout: Company, Product, Resources, Contact
- CrewSynch logo, social links (cyan hover states)
- Newsletter signup with cyan submit button
- Copyright and legal links

## Images Specification

**Hero Image:**
- Large background image: Construction workers using modern technology (tablets, mobile devices) on active job site
- Image size: 1920x1080px minimum
- Position: Right side of hero, 40% width on desktop
- Treatment: Slight cyan tint overlay for brand consistency

**Section Images:**
- Feature callouts: Dashboard screenshots, mobile app interface mockups (800x600px)
- Benefits section: Authentic construction team photos, diverse crews (1200x800px)
- All images: Subtle rounded corners (rounded-xl), shadow-lg

## Component Library

**Buttons:**
- Primary: Yellow bg, navy text, rounded-lg, shadow-md
- Secondary: Navy outline, cyan text, rounded-lg
- Tertiary: Cyan text only, no border, underline on hover

**Cards:**
- White background, rounded-xl, shadow-sm
- Hover: shadow-lg transition (300ms)
- Padding: p-8

**Form Inputs:**
- 48px height, rounded-lg
- Navy border (1px), cyan focus ring
- Placeholder text: gray-400

**Icons:**
- Heroicons library via CDN
- Sizes: 24px (regular), 20px (small), 32px (large)
- Cyan color for accent icons

## Animations

**Minimal, purposeful only:**
- Navigation underlines: 200ms slide-in
- Button hover: 150ms scale (1.02)
- Card hover: 300ms shadow transition
- Hero elements: 800ms fade-in on load
- NO scroll-triggered animations, NO parallax effects
