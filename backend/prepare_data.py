import pandas as pd
import os

INPUT_FILE = "data/raw/data.csv"
OUTPUT_FILE = "data/processed/racing_clean.csv"

print("Loading dataset...")
df = pd.read_csv(INPUT_FILE, low_memory=False)

print(f"Original rows: {len(df):,}")

# --------------------------------------------------
# 1. Convert date
# --------------------------------------------------
df["date"] = pd.to_datetime(df["date"], errors="coerce")

# --------------------------------------------------
# 2. Convert finishing position to numeric
# --------------------------------------------------
df["pos_numeric"] = pd.to_numeric(df["pos"], errors="coerce")

# --------------------------------------------------
# 3. Create target
# --------------------------------------------------
df["target"] = (df["pos_numeric"] == 1).astype(int)

# --------------------------------------------------
# 4. Remove rows where result is unavailable
# --------------------------------------------------
df = df.dropna(subset=["pos_numeric", "date"])

# --------------------------------------------------
# 5. Sort chronologically
# --------------------------------------------------
df = df.sort_values(["date", "race_ID"]).reset_index(drop=True)

# --------------------------------------------------
# 6. Remove columns that reveal the race result
# --------------------------------------------------
leakage_columns = [
    "pos",
    "pos_numeric",
    "btn",
    "fin_time",
    "act_score",
    "prize_money",
    "comment"
]

df = df.drop(columns=leakage_columns, errors="ignore")

# --------------------------------------------------
# 7. Remove columns that are derived from odds
# --------------------------------------------------
# We will keep decimal odds (dec) because it is
# available before the race.
df = df.drop(
    columns=["prob", "exp_chance", "dec_clean"],
    errors="ignore"
)

# --------------------------------------------------
# 8. Save
# --------------------------------------------------
os.makedirs("data/processed", exist_ok=True)

df.to_csv(OUTPUT_FILE, index=False)

print("\n========== PREPARATION COMPLETE ==========")
print(f"Rows: {len(df):,}")
print(f"Columns: {len(df.columns)}")
print(f"Winners: {df['target'].sum():,}")
print(f"Non-winners: {(df['target'] == 0).sum():,}")
print(f"Win percentage: {df['target'].mean() * 100:.2f}%")
print(f"Saved to: {OUTPUT_FILE}")

print("\n========== REMAINING COLUMNS ==========")
for column in df.columns:
    print(column)