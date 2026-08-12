import os
import pandas as pd
import joblib
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier

dataset_path = os.path.join('..', '..', 'Datasets', 'Fertilizer_recommendation.csv')
if not os.path.exists(dataset_path):
    dataset_path = 'data_core.csv'

print(f"Loading dataset from: {dataset_path}")
df = pd.read_csv(dataset_path)

# Strip leading/trailing whitespace from column names
df.columns = df.columns.str.strip()

# Extract features and target matching fert.py
X = df[['Temparature', 'Humidity', 'Moisture', 'Soil Type', 'Crop Type', 'Nitrogen', 'Potassium', 'Phosphorous']]
y = df['Fertilizer Name']

# Build ColumnTransformer to OneHotEncode Soil Type and Crop Type
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(sparse_output=False, handle_unknown='ignore'), ['Soil Type', 'Crop Type'])
    ],
    remainder='passthrough'
)

# Fit preprocessor on X
X_processed = preprocessor.fit_transform(X)

# Train Random Forest Classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_processed, y)

print("Model training complete.")

# Save preprocessor and model pickles
joblib.dump(model, 'fertilizer_model.pkl')
joblib.dump(preprocessor, 'preprocessor.pkl')

print("Successfully saved fertilizer_model.pkl and preprocessor.pkl!")
