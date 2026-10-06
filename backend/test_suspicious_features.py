import pandas as pd
from tabpfn import TabPFNClassifier
from sklearn.metrics import roc_auc_score, log_loss

TRAIN_FILE = "data/processed/features/tabpfn_train_5000_features.csv"
VALID_FILE = "data/processed/validation.csv"

train = pd.read_csv(TRAIN_FILE)
valid = pd.read_csv(VALID_FILE, low_memory=False).sample(
    n=2000,
    random_state=42
)

base_features = [
    "course", "time", "class", "band",
    "dist.f.", "dist.m.", "going",
    "season", "race_group", "race_type",
    "Month", "Year", "Runners", "Race_Money",
    "dec", "age", "lbs"
]

test_features = [
    ("BASE", base_features),
    ("BASE + OR", base_features + ["or"]),
    ("BASE + TS", base_features + ["ts"]),
    ("BASE + RPR", base_features + ["rpr"]),
]

# Prepare validation data
categorical_columns = [
    "course", "time", "class", "band",
    "going", "race_group", "race_type"
]

numeric_columns = [
    "dist.f.", "dist.m.", "season", "Month",
    "Year", "Runners", "Race_Money",
    "dec", "age", "lbs", "or", "ts", "rpr"
]

for column in categorical_columns:
    valid[column] = valid[column].fillna("Unknown").astype(str)

for column in numeric_columns:
    valid[column] = pd.to_numeric(valid[column], errors="coerce")
    valid[column] = valid[column].fillna(valid[column].median())

valid["target"] = valid["target"].astype(int)

for name, features in test_features:

    print("\n================================")
    print(name)
    print("Features:", len(features))
    print("================================")

    X_train = train[features].copy()
    y_train = train["target"]

    X_valid = valid[features].copy()
    y_valid = valid["target"]

    model = TabPFNClassifier(
        device="cpu",
        fit_mode="fit_preprocessors",
        random_state=42,
    )

    model.fit(X_train, y_train)

    probabilities = model.predict_proba(X_valid)[:, 1]

    auc = roc_auc_score(y_valid, probabilities)
    loss = log_loss(y_valid, probabilities)

    print(f"ROC-AUC: {auc:.4f}")
    print(f"Log Loss: {loss:.4f}")

print("\nFeature comparison complete.")
