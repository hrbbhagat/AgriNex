import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

print("Loading dataset...")
df = pd.read_csv('data_core.csv')

X = df.drop('Fertilizer Name', axis=1)
y = df['Fertilizer Name']

preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(sparse_output=False, handle_unknown='ignore'), ['Soil Type', 'Crop Type'])
    ],
    remainder='passthrough'
)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Fitting preprocessor...")
X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

print("Training RandomForest model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_processed, y_train)

y_pred = model.predict(X_test_processed)
acc = accuracy_score(y_test, y_pred)
print(f"Model trained successfully with Accuracy: {acc * 100:.2f}%")

print("Saving models...")
joblib.dump(model, 'fertilizer_model.pkl')
joblib.dump(preprocessor, 'preprocessor.pkl')
print("Saved fertilizer_model.pkl and preprocessor.pkl successfully!")
