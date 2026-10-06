# Add Paper Betting & ROI Analytics to RaceAI

Extend the existing Horse Racing AI frontend by adding a polished **Paper Betting & ROI Analytics** section.

The frontend is already connected to the real FastAPI API:

```text
http://127.0.0.1:8000/api/predictions
```

Do NOT redesign the existing application.

Keep the current:

* Dark premium AI SaaS design
* Framer Motion animations
* Floating/Antigravity effects
* Glassmorphism
* Charts
* Cards
* Typography
* Responsive layout
* Existing navigation

Only add the new functionality and integrate it naturally into the existing UI.

---

## 1. Important: This is Paper Betting

This is a **historical paper-betting demonstration**, NOT real-money betting.

Add a subtle label:

```text
PAPER BETTING
Historical Simulation
```

Do not display language suggesting guaranteed profit or real betting.

---

# 2. Add a New Page

Add a new navigation item:

```text
Paper Betting
```

Suggested icon:

```text
CircleDollarSign
```

Use Lucide React icons.

Route:

```text
/paper-betting
```

---

# 3. Paper Betting Calculation

Use the real prediction data from:

```text
GET /api/predictions
```

Do NOT hardcode prediction results.

Only horses with:

```text
recommendation === "BET"
```

are considered paper bets.

Use:

```text
1 unit stake per BET
```

for every bet.

---

# 4. Actual Result

The current `/api/predictions` endpoint may not expose the actual winner.

Therefore, first check whether the API response already contains an actual result/target field.

If the API does NOT contain the actual result:

Do NOT invent results.

Instead, update the backend endpoint to include the existing historical result field from the demo prediction dataset.

Expose:

```text
actual_result
```

or:

```text
target
```

where:

```text
1 = winner
0 = not winner
```

Keep the existing API fields unchanged.

The frontend must then use this real historical result.

---

# 5. Profit Calculation

For every paper bet:

### If horse wins

Profit:

```text
profit = decimal_odds - 1
```

Example:

```text
Odds = 11.00

Stake = 1 unit

Profit = 11 - 1
       = +10 units
```

### If horse loses

```text
profit = -1
```

Do NOT calculate profit using predicted probability.

Do NOT use simulated/random results.

---

# 6. KPI Cards

At the top of the Paper Betting page, create premium animated KPI cards.

Display:

```text
Total Paper Bets
Winning Bets
Win Rate
Total Profit
ROI
Average Odds
```

Example:

```text
43
Paper Bets

8
Winners

18.60%
Win Rate

+6.40
Units

+14.88%
ROI

9.42
Average Odds
```

The numbers above are examples only.

Calculate the real values dynamically.

---

# 7. Formulas

### Total Bets

```javascript
const totalBets = bets.length;
```

### Winning Bets

```javascript
const winningBets = bets.filter(
  bet => bet.actual_result === 1
).length;
```

### Win Rate

```javascript
const winRate =
  totalBets > 0
    ? winningBets / totalBets
    : 0;
```

### Total Stake

Because every bet is 1 unit:

```javascript
const totalStake = totalBets;
```

### Total Profit

```javascript
const totalProfit = bets.reduce(
  (sum, bet) => sum + bet.profit,
  0
);
```

### ROI

```javascript
const roi =
  totalStake > 0
    ? totalProfit / totalStake
    : 0;
```

### Average Odds

```javascript
const averageOdds =
  totalBets > 0
    ? bets.reduce(
        (sum, bet) => sum + Number(bet.dec),
        0
      ) / totalBets
    : 0;
```

---

# 8. Betting Table

Create a detailed paper-betting table.

Columns:

```text
Race
Horse
Odds
Market Probability
AI Probability
Value Edge
Recommendation
Result
Profit
```

Example:

```text
RID123
Tango De Juilley
11.00
10.37%
24.55%
+14.18%
BET
WIN
+10.00
```

For losing bets:

```text
LOSS
-1.00
```

Use clear visual distinction between WIN and LOSS.

---

# 9. Cumulative Profit Chart

Add a large premium chart:

```text
Cumulative Paper Profit
```

Calculate cumulative profit in chronological order.

Example:

```javascript
let cumulative = 0;

const profitHistory = bets.map((bet, index) => {
  cumulative += bet.profit;

  return {
    bet: index + 1,
    profit: cumulative
  };
});
```

Use Recharts.

Chart:

```text
X-axis → Bet Number
Y-axis → Cumulative Profit
```

Add a zero reference line.

Animate the chart when it appears.

---

# 10. Profit / Loss Chart

Add another chart showing:

```text
Winning Bets
Losing Bets
```

Use a bar chart.

Each bet should show:

```text
+10
-1
+3.5
-1
...
```

The chart should use the real calculated profit values.

---

# 11. Recommendation Performance

Add a performance summary:

```text
BET
WATCH
SKIP
```

For the paper-betting calculation, only BET is financially simulated.

However, show how many recommendations exist:

```text
BET      43
WATCH    48
SKIP     143
```

Use the API data to calculate these dynamically.

---

# 12. Best Winning Bets

Create a section:

```text
Top Winning Opportunities
```

Sort winning paper bets by profit descending.

Display the top 5.

Example:

```text
1
Tango De Juilley
+10.00 units
11.00 odds

2
Horse Name
+7.50 units
8.50 odds
```

Do not hardcode horses.

---

# 13. Biggest Losses

Add:

```text
Biggest Losses
```

Sort losing bets by negative profit.

Display the worst 5.

Example:

```text
Horse Name
-1.00 unit
21.00 odds
```

---

# 14. ROI Visualization

Create a premium ROI card.

Display:

```text
Paper ROI

+14.88%
```

Also show:

```text
Total Stake
100 units

Total Return
114.88 units
```

Calculate:

```javascript
totalReturn = totalStake + totalProfit;
```

Add a small animated progress/gauge visualization.

Do not imply that ROI represents future performance.

---

# 15. Historical Simulation Notice

At the bottom of the page, add a clear but elegant information panel:

```text
Historical Paper-Betting Simulation

This section uses historical race results to demonstrate how the
prediction recommendations would have performed under a simple
1-unit-per-bet paper betting strategy.

This is a prototype analysis and does not represent guaranteed
future performance or real-money betting results.
```

Keep this visually subtle but readable.

---

# 16. Empty State

If there are no BET recommendations:

Display:

```text
No Paper Bets Available

There are currently no predictions meeting the BET criteria.
```

Do not create fake data.

---

# 17. Loading State

While loading API data:

```text
Calculating paper-betting performance...
```

Use the existing skeleton animation.

Do not show hardcoded KPI numbers while loading.

---

# 18. API Error

If the API is unavailable:

```text
Paper Betting Analytics Offline

Unable to retrieve prediction data.

Retry
```

Use the existing API error handling and Retry functionality.

---

# 19. Responsive Design

The page must work properly on:

```text
Desktop
Laptop
Tablet
Mobile
```

On mobile:

* KPI cards become a vertical/grid layout
* Charts resize automatically
* Table becomes horizontally scrollable
* No content should overflow the viewport

---

# 20. Existing Dashboard Integration

Add a small summary card to the existing Dashboard:

```text
Paper Betting Performance

43 Bets
8 Winners
18.60% Win Rate
+6.40 Units
+14.88% ROI

View Analysis →
```

All values must come from the same calculated paper-betting data.

Do not duplicate hardcoded values.

---

# 21. Important Data Rules

Do NOT:

* Generate fake winners
* Randomize results
* Hardcode ROI
* Hardcode profit
* Claim this is a production betting model
* Claim guaranteed profitability
* Connect to real-money betting services
* Add payment/betting functionality
* Change the existing prediction algorithm

This is strictly a **paper-betting historical demonstration**.

---

# 22. Final User Flow

The finished application should work like:

```text
FastAPI
   ↓
/api/predictions
   ↓
React API Service
   ↓
Predictions
   ↓
Filter recommendation === "BET"
   ↓
Read historical actual_result
   ↓
Calculate 1-unit paper bet
   ↓
Calculate Win/Loss
   ↓
Calculate Profit
   ↓
Calculate ROI
   ↓
Display Paper Betting Dashboard
```

---

# 23. Final Verification

After implementation verify:

1. `/paper-betting` opens correctly.
2. Prediction data comes from the real API.
3. Only `BET` recommendations become paper bets.
4. Every paper bet has a 1-unit stake.
5. Winners use `odds - 1` profit.
6. Losers use `-1` profit.
7. Win rate is calculated dynamically.
8. Total profit is calculated dynamically.
9. ROI is calculated dynamically.
10. Cumulative profit chart uses real calculated results.
11. Winning/losing tables use real results.
12. Dashboard summary updates from the same data.
13. No mock betting results exist.
14. API failure shows a proper error state.
15. The page clearly identifies the feature as a historical paper-betting simulation.

Keep the existing RaceAI visual identity and animations. Make this look like a premium AI analytics product rather than a generic betting website.
