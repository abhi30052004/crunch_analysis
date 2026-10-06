import pandas as pd
import os

INPUT_FILE = "data/processed/train.csv"
OUTPUT_FILE = "data/processed/tabpfn_train_sample.csv"

RANDOM_STATE = 42
NUMBER_OF_RACES = 1000

print("Loading training data...")

df = pd.read_csv(INPUT_FILE, low_memory=False)

print(f"Total training rows: {len(df):,}")
print(f"Total races: {df['race_ID'].nunique():,}")

# Get unique race IDs
race_ids = df["race_ID"].dropna().unique()

# Select complete races
sample_races = pd.Series(race_ids).sample(
    n=NUMBER_OF_RACES,
    random_state=RANDOM_STATE
)

# Keep every horse from the selected races
sample = df[df["race_ID"].isin(sample_races)].copy()

# Sort by date and race
sample["date"] = pd.to_datetime(sample["date"], errors="coerce")

sample = sample.sort_values(
    ["date", "race_ID"]
).reset_index(drop=True)

os.makedirs("data/processed", exist_ok=True)

sample.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\n========== RACE SAMPLE ==========")
print(f"Selected races: {sample['race_ID'].nunique():,}")
print(f"Selected horses: {len(sample):,}")
print(f"Average horses/race: {len(sample) / sample['race_ID'].nunique():.2f}")

print("\n========== TARGET ==========")
print(f"Winners: {sample['target'].sum():,}")
print(f"Win rate: {sample['target'].mean() * 100:.2f}%")

print("\n========== DATE RANGE ==========")
print(f"From: {sample['date'].min().date()}")
print(f"To:   {sample['date'].max().date()}")

print("\nSaved:")
print(OUTPUT_FILE)