import pandas as pd
import os

FILES = {
    "train": "data/processed/train.csv",
    "validation": "data/processed/validation.csv",
    "test": "data/processed/test.csv",
}

OUTPUT_DIR = "data/processed/features_safe"

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


def prepare_file(name, input_file):

    print(f"\nLoading {name}...")

    df = pd.read_csv(input_file, low_memory=False)

    df = df[FEATURE_COLUMNS + [TARGET_COLUMN]].copy()

    for column in CATEGORICAL_COLUMNS:
        df[column] = df[column].fillna("Unknown").astype(str)

    for column in NUMERIC_COLUMNS:
        df[column] = pd.to_numeric(df[column], errors="coerce")

    for column in NUMERIC_COLUMNS:
        df[column] = df[column].fillna(df[column].median())

    df[TARGET_COLUMN] = df[TARGET_COLUMN].astype(int)

    output_file = f"{OUTPUT_DIR}/{name}_features.csv"

    df.to_csv(output_file, index=False)

    print(f"Rows: {len(df):,}")
    print(f"Columns: {len(df.columns)}")
    print(f"Winners: {df[TARGET_COLUMN].sum():,}")
    print(f"Win rate: {df[TARGET_COLUMN].mean() * 100:.2f}%")
    print(f"Saved: {output_file}")


os.makedirs(OUTPUT_DIR, exist_ok=True)

for name, input_file in FILES.items():
    prepare_file(name, input_file)

print("\n========== SAFE FEATURES ==========")

for feature in FEATURE_COLUMNS:
    print(feature)

print("\nFeature preparation complete.")
