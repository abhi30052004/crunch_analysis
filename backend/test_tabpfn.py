import pandas as pd
import numpy as np

from tabpfn import TabPFNClassifier
from sklearn.metrics import accuracy_score, log_loss, roc_auc_score


TRAIN_FILE = "data/processed/features/train_features.csv"
VALID_FILE = "data/processed/features/validation_features.csv"

# Small sample for the first test
TRAIN_SAMPLES = 5000
VALID_SAMPLES = 2000


print("Loading data...")

train_df = pd.read_csv(TRAIN_FILE)
valid_df = pd.read_csv(VALID_FILE)

# Take samples
train_df = train_df.sample(
    n=TRAIN_SAMPLES,
    random_state=42
)

valid_df = valid_df.sample(
    n=VALID_SAMPLES,
    random_state=42
)

X_train = train_df.drop(columns=["target"])
y_train = train_df["target"]

X_valid = valid_df.drop(columns=["target"])
y_valid = valid_df["target"]


print("\n========== DATA ==========")
print("Training:", X_train.shape)
print("Validation:", X_valid.shape)

print("\n========== TARGET ==========")
print("Training win rate:", y_train.mean())
print("Validation win rate:", y_valid.mean())


# --------------------------------------------------
# TabPFN
# --------------------------------------------------

print("\n========== STARTING TABPFN ==========")

model = TabPFNClassifier(
    device="cpu"
)

print("Training TabPFN...")

model.fit(
    X_train,
    y_train
)

print("Training complete.")


# --------------------------------------------------
# Predictions
# --------------------------------------------------

print("\nGenerating predictions...")

probabilities = model.predict_proba(X_valid)

# Probability of winner class
win_probability = probabilities[:, 1]

predictions = (
    win_probability >= 0.5
).astype(int)


# --------------------------------------------------
# Metrics
# --------------------------------------------------

accuracy = accuracy_score(
    y_valid,
    predictions
)

logloss = log_loss(
    y_valid,
    probabilities
)

auc = roc_auc_score(
    y_valid,
    win_probability
)


print("\n========== RESULTS ==========")

print(f"Accuracy:  {accuracy:.4f}")
print(f"Log Loss:  {logloss:.4f}")
print(f"ROC-AUC:   {auc:.4f}")

print("\n========== SAMPLE PREDICTIONS ==========")

result = pd.DataFrame({
    "actual": y_valid.values,
    "win_probability": win_probability
})

print(
    result.head(20).to_string(index=False)
)

print("\nTabPFN test completed successfully.")