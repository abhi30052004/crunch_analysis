import pandas as pd
from tabpfn import TabPFNClassifier
from sklearn.metrics import accuracy_score, log_loss, roc_auc_score

TRAIN_FILE = "data/processed/features_safe/tabpfn_train_5000_features.csv"
VALID_FILE = "data/processed/features_safe/validation_features.csv"

print("Loading data...")

train_df = pd.read_csv(TRAIN_FILE)
valid_df = pd.read_csv(VALID_FILE)

X_train = train_df.drop(columns=["target"])
y_train = train_df["target"]

# Keep validation manageable on CPU
valid_df = valid_df.sample(
    n=2000,
    random_state=42
)

X_valid = valid_df.drop(columns=["target"])
y_valid = valid_df["target"]

print("\n========== DATA ==========")
print("Training:", X_train.shape)
print("Validation:", X_valid.shape)

print("\n========== TARGET ==========")
print("Training win rate:", y_train.mean())
print("Validation win rate:", y_valid.mean())

print("\n========== STARTING TABPFN ==========")

model = TabPFNClassifier(
    device="cpu",
    fit_mode="fit_preprocessors",
    random_state=42,
)

print("Training TabPFN...")

model.fit(X_train, y_train)

print("Training complete.")

print("\nGenerating predictions...")

probabilities = model.predict_proba(X_valid)

win_probability = probabilities[:, 1]

predictions = (win_probability >= 0.5).astype(int)

accuracy = accuracy_score(y_valid, predictions)
logloss = log_loss(y_valid, probabilities)
auc = roc_auc_score(y_valid, win_probability)

print("\n========== SAFE MODEL RESULTS ==========")
print(f"Accuracy:  {accuracy:.4f}")
print(f"Log Loss:  {logloss:.4f}")
print(f"ROC-AUC:   {auc:.4f}")

print("\n========== SAMPLE PREDICTIONS ==========")

result = pd.DataFrame({
    "actual": y_valid.values,
    "win_probability": win_probability
})

print(result.head(20).to_string(index=False))

print("\nSafe TabPFN test completed successfully.")
