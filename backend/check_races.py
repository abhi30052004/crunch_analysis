import pandas as pd

files = {
    "TRAIN": "data/processed/train.csv",
    "VALIDATION": "data/processed/validation.csv",
    "TEST": "data/processed/test.csv",
}

for name, file in files.items():

    df = pd.read_csv(file, low_memory=False)

    print(
        f"{name}: "
        f"rows={len(df):,}, "
        f"races={df['race_ID'].nunique():,}, "
        f"winners={df['target'].sum():,}"
    )