# DeFi Risk Sentinel - Design Guidelines

## Design Approach

**Selected Approach:** Modern Financial Dashboard with AI-Enhanced Aesthetics

**Justification:** DeFi Risk Sentinel combines financial data visualization with AI-powered insights. The design draws inspiration from leading DeFi platforms (Uniswap, Aave, DeFiLlama) while incorporating modern AI product aesthetics (Linear, Vercel). This creates a trustworthy, professional interface that balances data density with clarity.

**Core Principles:**
- Clarity First: Financial data must be immediately scannable and actionable
- Trust Through Design: Professional aesthetics build confidence in AI recommendations
- Progressive Disclosure: Complexity revealed only when needed
- Real-time Feedback: Visual indicators for live data and AI processing states

---

## Color Palette

### Dark Mode (Primary)
**Background Hierarchy:**
- Primary Background: 240 10% 3.9%
- Secondary Background: 240 3.7% 15.9%
- Muted Background: 240 4.8% 9%
- Card/Surface: 240 10% 3.9% with subtle border

**Brand & Accent Colors:**
- Primary Brand: 280 85% 60% (Deep purple - AI/tech association)
- Primary Hover: 280 85% 55%
- Secondary Accent: 200 95% 55% (Cyan - trust, clarity)

**Semantic Colors:**
- Success/Low Risk: 142 76% 36%
- Warning/Medium Risk: 38 92% 50%
- Danger/High Risk: 0 84% 60%
- Info: 213 94% 68%

**Text:**
- Primary Text: 0 0% 98%
- Secondary Text: 240 5% 64.9%
- Muted Text: 240 3.8% 46.1%

### Light Mode
**Background Hierarchy:**
- Primary Background: 0 0% 100%
- Secondary Background: 240 4.8% 95.9%
- Muted Background: 240 4.8% 95.9%

**Text:**
- Primary Text: 240 10% 3.9%
- Secondary Text: 240 3.8% 46.1%

---

## Typography

**Font Families:**
- Primary (UI): "Inter" via Google Fonts - excellent readability for data
- Monospace (Data): "JetBrains Mono" - for addresses, numbers, code

**Hierarchy:**
- Hero Headline: text-5xl font-bold (48px)
- Page Title: text-3xl font-bold (30px)
- Section Title: text-2xl font-semibold (24px)
- Card Title: text-lg font-semibold (18px)
- Body: text-base (16px)
- Caption/Metadata: text-sm text-muted-foreground (14px)
- Data Points: text-sm font-mono (14px monospace)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Tight spacing: p-2, gap-2 (component internals)
- Standard spacing: p-4, gap-4, mb-6 (cards, sections)
- Generous spacing: p-8, gap-8, my-12 (major sections)
- Hero/Landing: py-24, px-16 (impact areas)

**Grid System:**
- Container: max-w-7xl mx-auto px-4
- Dashboard: grid grid-cols-1 lg:grid-cols-3 gap-6
- Metrics: grid grid-cols-2 md:grid-cols-4 gap-4

---

## Component Library

### Navigation
- Sticky header with wallet connection (RainbowKit button) + network indicator
- Dark background with subtle border-b
- Logo (left), Navigation links (center), Wallet (right)
- Mobile: Hamburger menu with slide-out drawer

### Landing Page Components

**Hero Section:**
- Full-width dark gradient background (from primary brand to darker variant)
- Large headline with animated gradient text effect on "AI-Powered"
- Subheading explaining value proposition
- Primary CTA: Large "Connect Wallet" button with cool mode enabled
- Supporting visual: Abstract network/nodes illustration or animated dashboard preview
- Height: 80vh minimum

**Features Grid:**
- 3-column layout (stacks on mobile)
- Icon + Title + Description cards
- Icons: Use Heroicons (shield-check, chart-bar, bell, etc.)
- Cards with subtle hover lift effect

**How It Works Section:**
- Numbered steps (1-2-3-4) with visual flow
- Alternating left-right layout for each step
- Screenshots or illustrations showing the process

**Trust Indicators:**
- "Powered by Somnia" badge
- "AI-Driven Analysis" badge
- Security/Audit mentions if applicable

### Dashboard Components

**Stats Overview Cards:**
- Grid of 4 metric cards at top
- Large number (text-3xl font-bold)
- Label below (text-sm text-muted-foreground)
- Trend indicator (arrow up/down with percentage)
- Subtle colored left border based on status

**Protocol Risk Table:**
- Full-width responsive table
- Columns: Protocol Name | TVL | Risk Score | Confidence | Trust Index | Actions
- Risk Score: Colored badge (Low=green, Medium=yellow, High=red)
- Confidence: Progress bar with percentage
- Trust Index: Numeric score with colored indicator
- Hover: Row highlight with subtle background change
- Actions: "View Details" button (variant="ghost")

**AI Insight Card:**
- Prominent card with AI sparkle icon
- Title: "AI Risk Analysis"
- Explanation text in readable paragraph
- Timestamp: "Updated 2 hours ago"
- Accent border (primary color)

**Risk Timeline Chart:**
- Full-width card
- Title + date range selector
- Line chart using Recharts
- Multiple protocols as different colored lines
- Tooltip on hover showing exact values
- Grid lines for easy reading

**Position Cards:**
- Grid layout for user's DeFi positions
- Each card shows: Pool name, Amount, APY, Risk level
- Visual risk indicator (colored dot or badge)
- "Rebalance" action button

### Alerts/Notifications
- Toast notifications for real-time events
- Alert banners for high-risk warnings
- Color-coded: red for danger, yellow for warning, blue for info

### Buttons
- Primary: Solid with brand color, white text
- Secondary: Outline with transparent background
- Ghost: No background, hover shows subtle fill
- Sizes: sm, default, lg
- When on images: backdrop-blur-md with semi-transparent background

### Forms/Inputs
- Dark mode: dark background with subtle border
- Focus: colored ring (primary color)
- Labels above inputs
- Helper text below in muted color

---

## Animations

**Minimal & Purposeful:**
- Wallet connection: Cool mode emoji explosion (RainbowKit built-in)
- Card hover: Subtle lift (transform translateY(-2px))
- Data loading: Skeleton loaders with shimmer effect
- Chart updates: Smooth transitions (300ms ease)
- Page transitions: Fade in/out (200ms)

**AI Processing Indicator:**
- Pulsing gradient border on AI insight card when analyzing
- Subtle shimmer on "Analyzing..." text

---

## Images

**Hero Section:**
- Large feature image: Abstract 3D visualization of blockchain nodes/network or AI-powered dashboard mockup
- Style: Dark themed, purple/cyan gradients, modern and tech-forward
- Placement: Right side of hero on desktop, below text on mobile
- Dimensions: Approximately 600x500px, optimized for web

**Feature Section Icons:**
- Use Heroicons consistently throughout
- Size: w-12 h-12 for feature cards
- Color: Primary brand color or gradient

**No additional images needed** - rely on data visualization (charts) and iconography for visual interest

---

## Unique Design Elements

**Glassmorphism Cards:**
- Semi-transparent cards with backdrop-blur
- Subtle border with gradient
- Used for AI insights and high-priority information

**Risk Gradient Bars:**
- Horizontal bars showing risk progression
- Color gradients from green → yellow → red
- Used in Trust Index visualization

**Blockchain Address Display:**
- Monospace font
- Truncated with ellipsis (0x1234...5678)
- Click to copy with toast confirmation
- Subtle background highlight

**Network Status Indicator:**
- Small colored dot next to network name
- Green: Connected, Yellow: Slow, Red: Disconnected
- Pulsing animation when active

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px - Single column, stacked cards
- Tablet: 768px - 1024px - 2-column grid
- Desktop: > 1024px - 3-column grid, full features

**Mobile Optimizations:**
- Bottom navigation bar for key actions
- Collapsible sections for data-heavy areas
- Simplified charts (fewer data points)
- Larger touch targets (min 44x44px)

---

## Accessibility & Dark Mode

**Contrast:**
- Maintain WCAG AA standards minimum (4.5:1 for text)
- All interactive elements clearly distinguishable
- Focus indicators visible and consistent

**Dark Mode Implementation:**
- Dark mode as default and primary experience
- Light mode available via toggle in header
- All components have both variants
- Input fields maintain good contrast in both modes
- Form inputs: dark backgrounds with lighter borders in dark mode