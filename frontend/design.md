# Horse Racing AI — Premium Client Demo Frontend

Build a premium, modern **AI Horse Racing Analytics Dashboard** in **React + Vite + Tailwind CSS + Framer Motion**.

The application is a **client demonstration/prototype**, not a production betting platform. The UI should feel highly polished and professional while clearly identifying unfinished functionality as **Demo**, **Prototype**, or **Coming Soon**.

---

## 1. Technology

Use:

* React
* Vite
* Tailwind CSS
* Framer Motion
* Lucide React icons
* Recharts
* Axios or Fetch API
* Component-based architecture
* Responsive design
* Dark theme

Do NOT use a generic admin-dashboard template.

The interface should feel like a premium **AI analytics SaaS product**.

---

# 2. Visual Direction

Design inspiration:

* Premium AI SaaS
* Quantitative analytics platforms
* Sports analytics dashboards
* Bloomberg/terminal-style information density
* Modern futuristic AI interfaces
* Minimal glassmorphism
* Subtle motion
* High-quality data visualization

### Background

Use an almost-black background:

```text
#050505
#08090B
#0D0F12
```

Cards:

```text
rgba(255,255,255,0.04)
rgba(255,255,255,0.06)
```

Borders:

```text
rgba(255,255,255,0.08)
```

Text:

```text
#F5F5F5
#A1A1AA
#71717A
```

Use a restrained accent color such as electric green/cyan for AI/value signals.

Do not make the entire interface neon.

---

# 3. Application Name

Use:

**RaceAI**

Subtitle:

**AI-Powered Horse Racing Analytics**

Alternative small label:

**Prediction & Value Intelligence**

Create a professional logo using:

```text
RA
```

inside a minimal circular/rounded mark.

---

# 4. Main Application Layout

Create:

```text
┌─────────────────────────────────────────────────────────┐
│ Logo       Dashboard    Races    Predictions    Demo    │
│                                      Settings     ●     │
├───────────────┬─────────────────────────────────────────┤
│               │                                         │
│ Sidebar       │ Main Dashboard                          │
│               │                                         │
│ Overview      │                                         │
│ Live Races    │                                         │
│ Predictions   │                                         │
│ Value Bets    │                                         │
│ Analytics     │                                         │
│               │                                         │
│ ───────────   │                                         │
│ Data Status   │                                         │
│ Model Status  │                                         │
│               │                                         │
└───────────────┴─────────────────────────────────────────┘
```

Desktop-first but fully responsive.

---

# 5. Dashboard

The main dashboard should immediately communicate the value of the product.

Top heading:

**Horse Racing Intelligence**

Subheading:

**AI-assisted race analysis, probability estimation and value detection.**

Add a small status badge:

```text
● DEMO MODE
```

---

# 6. KPI Cards

Create four premium animated cards:

### Races Analyzed

```text
30
```

### Horses Analyzed

```text
234
```

### BET Signals

```text
43
```

### WATCH Signals

```text
48
```

Animate numbers using Framer Motion when the page loads.

Cards should have:

* subtle hover movement
* border glow on hover
* icon
* small trend indicator
* smooth transitions

---

# 7. AI Model Status

Create a prominent card:

### AI Prediction Engine

```text
TabPFN
Pretrained Tabular AI
```

Status:

```text
● Demo Model Active
```

Show:

```text
Feature Processing       ✓
Race Analysis            ✓
Probability Estimation   ✓
Value Detection          ✓
Live Model Inference     ◌ Prototype
```

Important:

Do NOT claim that live TabPFN inference is fully operational.

Use:

```text
Prototype
```

for the unfinished inference component.

Add a button:

**View Model Details**

Opening a modal should explain:

```text
This demonstration uses a pretrained tabular AI approach
combined with racing and market features to demonstrate
probability and value analysis.

Full production inference infrastructure is planned for
future deployment.
```

---

# 8. Race Analysis Section

Create a race selector.

Example:

```text
Select Race

RID2791-GB-14
```

When selected, display all horses in that race.

Table:

| Horse            | Odds | Market % |   AI % |   Value | Signal |
| ---------------- | ---: | -------: | -----: | ------: | ------ |
| Tango De Juilley | 11.0 |   10.37% | 24.55% | +14.18% | BET    |
| Ted Spread       | 11.0 |   10.37% | 20.75% | +10.37% | BET    |
| Neville          |  8.0 |   12.23% | 21.23% |  +9.00% | BET    |

Use visual badges:

```text
BET     green
WATCH   amber
SKIP    gray
```

---

# 9. Prediction Visualization

Create a beautiful horizontal comparison chart:

```text
Tango De Juilley

Market Probability
██████████                         10.37%

AI Probability
████████████████████████           24.55%

Value Edge
+14.18%
```

Use Recharts.

Animate bars with Framer Motion.

---

# 10. Value Opportunity Panel

Create a large card:

## Top Value Opportunities

Display the top 10 horses ranked by value edge.

Example:

```text
01  Tango De Juilley       +14.18%
02  Yasir                  +12.84%
03  Shantou Flyer          +10.56%
04  Ted Spread             +10.37%
05  Hurricane Vic          +10.31%
```

Each row should animate when entering the viewport.

Clicking a horse opens a detail drawer.

---

# 11. Horse Detail Drawer

When a horse is clicked, open a right-side animated drawer.

Show:

```text
Horse Analysis

Tango De Juilley

Race
RID2791-GB-14

Decimal Odds
11.00

Market Probability
10.37%

AI Probability
24.55%

Value Edge
+14.18%

Recommendation
BET
```

Add a confidence visualization.

Also show:

```text
Feature Signals

Course       ████████
Distance     ██████
Going        ███████
Class        █████
Market       ████████
```

Label this:

**Demo Feature Interpretation**

Do not imply these bars are SHAP values unless actual SHAP values are implemented.

---

# 12. Demo Video / Analyzer Section

Create a dedicated navigation item:

**Video Analyzer**

This section should look impressive but clearly be marked:

```text
VIDEO ANALYZER
PROTOTYPE
```

Create a large video-analysis workspace.

Layout:

```text
┌──────────────────────────────────────────────┐
│                                              │
│              VIDEO PREVIEW                   │
│                                              │
│          ▶ Horse Racing Demo                 │
│                                              │
│                                              │
└──────────────────────────────────────────────┘

Analysis Timeline
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Detected Events

00:04  Race Start
00:11  Horse Movement
00:18  Position Change
00:27  Final Stretch

AI Analysis
────────────────────

Race footage analysis is currently a prototype.

Future version:
• Horse tracking
• Position detection
• Speed estimation
• Race-event detection
• Computer vision analytics
```

### Demo video

Include a visually polished demo-video placeholder.

If no real video is available, use a generated/static visual treatment instead of pretending that a real AI video model is analyzing the footage.

Add:

```text
Demo Preview
```

and:

```text
Video Analysis — Coming Soon
```

The user should immediately understand that this feature is **not yet fully implemented**.

Add:

**Upload Race Video**

button.

When clicked, show:

```text
Video analysis is currently available as a prototype preview.
Full computer vision processing will be enabled in a future version.
```

---

# 13. Animated AI Visualization

Add a subtle animated centerpiece to the dashboard.

Use Framer Motion to create:

* moving particles
* orbiting dots
* subtle grid
* glowing prediction nodes
* animated data streams

The visualization should represent:

```text
Race Data
     ↓
Feature Engine
     ↓
AI Model
     ↓
Probability
     ↓
Value Detection
```

Keep it subtle and premium.

Avoid excessive particle effects.

---

# 14. Antigravity / Floating Effects

Use tasteful floating effects for major cards.

Cards can slightly move:

```text
y: [-2, 2, -2]
```

with very slow animation.

Use Framer Motion:

* fade-in
* slide-up
* scale on hover
* staggered list animation
* animated number counters
* drawer transitions
* modal transitions

Do NOT animate everything.

Performance is important.

---

# 15. Analytics Page

Create:

## Performance Analytics

Charts:

### Probability Distribution

Show predicted probabilities.

### Value Edge Distribution

Show positive and negative edges.

### Recommendation Breakdown

Donut chart:

```text
BET      43
WATCH    48
SKIP     143
```

### Race Coverage

```text
30 races analyzed
234 horses evaluated
```

Add a small disclaimer:

```text
Demo statistics are based on a limited historical sample.
They are intended for product demonstration only.
```

---

# 16. Data Explorer

Create a searchable table containing:

```text
Race ID
Horse
Course
Odds
Market Probability
AI Probability
Value Edge
Recommendation
Result
```

Features:

* Search
* Sort
* Filter
* BET only
* WATCH only
* SKIP only
* Value edge > 5%
* Pagination

Use sticky table headers.

---

# 17. Demo Mode

The application should visibly communicate that this is a prototype.

Add a top-right badge:

```text
DEMO ENVIRONMENT
```

Create an information tooltip:

```text
This application demonstrates the intended AI workflow.
Some advanced AI and video-analysis components are currently
under development.
```

This is important for client presentation.

---

# 18. Coming Soon Components

Create polished cards for:

### Live Race Intelligence

```text
COMING SOON
Real-time race data integration
```

### Computer Vision

```text
PROTOTYPE
Video-based horse tracking
```

### Advanced Historical Features

```text
COMING SOON
Horse / jockey / trainer historical form
```

### Production AI Inference

```text
IN DEVELOPMENT
GPU/cloud accelerated TabPFN inference
```

These should look like planned product capabilities, not broken features.

---

# 19. Landing / Demo Home

Create a beautiful initial screen before entering the dashboard.

Hero:

**Predict Smarter. Find Racing Value.**

Subtitle:

**An AI-powered horse racing analytics platform for probability estimation and value discovery.**

CTA:

```text
Explore Demo
```

Secondary CTA:

```text
View AI Analysis
```

Hero visualization:

```text
Race Data → AI Model → Probability → Value
```

Add animated background grid and subtle glow.

---

# 20. UX Requirements

The application must feel:

* Fast
* Premium
* Minimal
* Professional
* Data-driven
* AI-focused
* Client-demo ready

Avoid:

* Generic Bootstrap appearance
* Excessive gradients
* Excessive neon
* Huge text everywhere
* Too many animations
* Fake statistics
* Fake AI claims
* Broken buttons

Every unfinished feature should have a clear:

```text
DEMO
PROTOTYPE
COMING SOON
```

state.

---

# 21. API Integration

Use the existing backend:

```text
http://127.0.0.1:8000
```

Prediction endpoint:

```text
GET /api/predictions
```

Example response:

```json
{
  "race_ID": "RID2773-GB-14",
  "horse_name": "Unefille De Guye",
  "dec": 4.5,
  "market_probability": 0.1932,
  "demo_probability": 0.1340,
  "value_edge": -0.0592,
  "recommendation": "SKIP"
}
```

Create a reusable API service:

```text
src/
├── api/
│   └── predictions.js
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── KPICard.jsx
│   ├── PredictionTable.jsx
│   ├── ValueCard.jsx
│   ├── RaceSelector.jsx
│   ├── ProbabilityChart.jsx
│   ├── HorseDrawer.jsx
│   ├── VideoAnalyzer.jsx
│   └── AIStatus.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Dashboard.jsx
│   ├── Predictions.jsx
│   ├── Analytics.jsx
│   ├── VideoAnalyzerPage.jsx
│   └── DataExplorer.jsx
├── App.jsx
└── main.jsx
```

---

# 22. Loading States

Do not show blank screens.

Use skeleton loaders:

```text
████████████████
██████████
███████████████
```

For API errors:

```text
Unable to connect to the prediction engine.

Make sure the backend API is running.

Retry
```

---

# 23. Empty States

Create polished empty states rather than blank tables.

Example:

```text
No race selected

Select a race to view AI probability
and value analysis.
```

---

# 24. Responsive Design

Desktop:

Full dashboard.

Tablet:

Collapsible sidebar.

Mobile:

Bottom navigation / hamburger menu.

Tables should become horizontal scroll cards on mobile.

---

# 25. Final Quality Requirement

The final result should look like a **real startup/product demo**, not a college project.

Prioritize:

1. Visual hierarchy
2. Clean typography
3. Smooth animations
4. Excellent spacing
5. Data visualization
6. Clear AI workflow
7. Professional empty/loading states
8. Demo/prototype transparency
9. Responsive layout
10. Consistent component system

The application should be impressive enough to demonstrate to a client even though the advanced AI and video-analysis modules are still under development.

Do not spend time implementing unfinished AI functionality just to make the buttons work. Build the **best possible visual and interactive prototype around the currently working prediction API**.
