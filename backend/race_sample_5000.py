import pandas as pd
import os

INPUT_FILE = "data/processed/train.csv"
OUTPUT_FILE = "data/processed/tabpfn_train_5000.csv"

TARGET_HORSES = 5000
RANDOM_STATE = 42

print("Loading training data...")

df = pd.read_csv(INPUT_FILE, low_memory=False)

df["date"] = pd.to_datetime(df["date"], errors="coerce")

# Race-level information
race_sizes = (
    df.groupby("race_ID")
    .size()
    .reset_index(name="horse_count")
)

# Randomize races
race_sizes = race_sizes.sample(
    frac=1,
    random_state=RANDOM_STATE
).reset_index(drop=True)

# Select complete races until approximately 5,000 horses
selected_races = []
total_horses = 0

for _, row in race_sizes.iterrows():

    if total_horses + row["horse_count"] > TARGET_HORSES:
        continue

    selected_races.append(row["race_ID"])
    total_horses += row["horse_count"]

    if total_horses >= TARGET_HORSES:
        break

sample = df[df["race_ID"].isin(selected_races)].copy()

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