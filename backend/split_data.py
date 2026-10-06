import pandas as pd
import os

INPUT_FILE = "data/processed/racing_clean.csv"

TRAIN_FILE = "data/processed/train.csv"
VALID_FILE = "data/processed/validation.csv"
TEST_FILE = "data/processed/test.csv"

print("Loading cleaned dataset...")

df = pd.read_csv(INPUT_FILE, low_memory=False)

df["date"] = pd.to_datetime(df["date"], errors="coerce")

# Sort by time
df = df.sort_values(["date", "race_ID"]).reset_index(drop=True)

# Get date boundaries
dates = df["date"].dropna().sort_values()

train_end = dates.quantile(0.70)
valid_end = dates.quantile(0.85)

print("\n========== SPLIT DATES ==========")
print("Training ends:   ", train_end.date())
print("Validation ends: ", valid_end.date())
print("Test starts:     ", valid_end.date())

# Time-based split
train = df[df["date"] <= train_end].copy()

validation = df[
    (df["date"] > train_end) &
    (df["date"] <= valid_end)
].copy()

test = df[df["date"] > valid_end].copy()

# Save
os.makedirs("data/processed", exist_ok=True)

train.to_csv(TRAIN_FILE, index=False)
validation.to_csv(VALID_FILE, index=False)
test.to_csv(TEST_FILE, index=False)

print("\n========== DATASET SPLIT ==========")

print(f"Training rows:   {len(train):,}")
print(f"Validation rows: {len(validation):,}")
print(f"Test rows:       {len(test):,}")

print("\n========== WIN RATES ==========")

print(
    f"Training:   {train['target'].mean() * 100:.2f}%"
)

print(
    f"Validation: {validation['target'].mean() * 100:.2f}%"
)

print(
    f"Test:       {test['target'].mean() * 100:.2f}%"
)

print("\n========== DATE RANGES ==========")

print(
    "Training:",
    train["date"].min().date(),
    "to",
    train["date"].max().date()
)

print(
    "Validation:",
    validation["date"].min().date(),
    "to",
    validation["date"].max().date()
)

print(
    "Test:",
    test["date"].min().date(),
    "to",
    test["date"].max().date()
)

print("\nFiles created:")
print(TRAIN_FILE)
print(VALID_FILE)
print(TEST_FILE)