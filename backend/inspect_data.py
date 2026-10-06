import pandas as pd

file_path = "data/raw/data.csv"

df = pd.read_csv(file_path)

print("\n========== DATASET SHAPE ==========")
print("Rows:", len(df))
print("Columns:", len(df.columns))

print("\n========== COLUMNS ==========")
for i, column in enumerate(df.columns, 1):
    print(f"{i}. {column}")

print("\n========== FIRST 5 ROWS ==========")
print(df.head().to_string())

print("\n========== DATA TYPES ==========")
print(df.dtypes)

print("\n========== MISSING VALUES ==========")
missing = df.isnull().sum()
print(missing[missing > 0].sort_values(ascending=False))

print("\n========== DUPLICATES ==========")
print("Duplicate rows:", df.duplicated().sum())

print("\n========== BASIC INFORMATION ==========")
print(df.info())