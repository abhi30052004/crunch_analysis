import pandas as pd
import os

INPUT_FILE = "data/processed/tabpfn_train_5000.csv"
OUTPUT_FILE = "data/processed/features_safe/tabpfn_train_5000_features.csv"

FEATURE_COLUMNS = [
    "course",
    "time",
    "class",
    "band",
    "dist.f.",
    "dist.m.",
    "going",
    "season",
    "race_group",
    "race_type",
    "Month",
    "Year",
    "Runners",
    "Race_Money",
    "sp",
    "dec",
    "age",
    "lbs",
    "gear",
]

TARGET_COLUMN = "target"

CATEGORICAL_COLUMNS = [
    "course",
    "time",
    "class",
    "band",
    "going",
    "race_group",
    "race_type",
    "sp",
    "gear",
]

NUMERIC_COLUMNS = [
    "dist.f.",
    "dist.m.",
    "season",
    "Month",
    "Year",
    "Runners",
    "Race_Money",
    "dec",
    "age",
    "lbs",
]

print("Loading 5,000-horse race sample...")

df = pd.read_csv(INPUT_FILE, low_memory=False)

df = df[FEATURE_COLUMNS + [TARGET_COLUMN]].copy()

for column in CATEGORICAL_COLUMNS:
    df[column] = df[column].fillna("Unknown").astype(str)

for column in NUMERIC_COLUMNS:
    df[column] = pd.to_numeric(df[column], errors="coerce")
    df[column] = df[column].fillna(df[column].median())

df[TARGET_COLUMN] = df[TARGET_COLUMN].astype(int)

os.makedirs("data/processed/features_safe", exist_ok=True)

df.to_csv(OUTPUT_FILE, index=False)

print("\n========== SAFE TABPFN SAMPLE ==========")
print(f"Rows: {len(df):,}")
print(f"Columns: {len(df.columns)}")
print(f"Features: {len(FEATURE_COLUMNS)}")
print(f"Winners: {df[TARGET_COLUMN].sum():,}")
print(f"Win rate: {df[TARGET_COLUMN].mean() * 100:.2f}%")
print(f"Saved: {OUTPUT_FILE}")
