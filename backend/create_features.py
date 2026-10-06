import pandas as pd
import os

TRAIN_FILE = "data/processed/train.csv"
VALID_FILE = "data/processed/validation.csv"
TEST_FILE = "data/processed/test.csv"

OUTPUT_DIR = "data/processed/features"

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Features available before the race
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
    "dec",
    "age",
    "lbs",
    "or",
    "ts",
    "rpr",
]

TARGET_COLUMN = "target"


def prepare_file(input_file, output_file):
    print(f"\nLoading {input_file}...")

    df = pd.read_csv(input_file, low_memory=False)

    # Keep only required columns
    df = df[FEATURE_COLUMNS + [TARGET_COLUMN]].copy()

    # Convert categorical columns to strings
    categorical_columns = [
        "course",
        "time",
        "class",
        "band",
        "going",
        "race_group",
        "race_type",
    ]

    for column in categorical_columns:
        df[column] = df[column].fillna("Unknown").astype(str)

    # Numeric columns
    numeric_columns = [
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
        "or",
        "ts",
        "rpr",
    ]

    for column in numeric_columns:
        df[column] = pd.to_numeric(df[column], errors="coerce")

    # Fill missing numeric values using training-independent
    # simple defaults for this baseline
    for column in numeric_columns:
        df[column] = df[column].fillna(df[column].median())

    # Target
    df[TARGET_COLUMN] = df[TARGET_COLUMN].astype(int)

    df.to_csv(output_file, index=False)

    print(f"Saved: {output_file}")
    print(f"Rows: {len(df):,}")
    print(f"Columns: {len(df.columns)}")


prepare_file(
    TRAIN_FILE,
    f"{OUTPUT_DIR}/train_features.csv"
)

prepare_file(
    VALID_FILE,
    f"{OUTPUT_DIR}/validation_features.csv"
)

prepare_file(
    TEST_FILE,
    f"{OUTPUT_DIR}/test_features.csv"
)

print("\n========== FEATURES ==========")

for feature in FEATURE_COLUMNS:
    print(feature)

print("\nTarget:")
print(TARGET_COLUMN)

print("\nFeature preparation complete.")