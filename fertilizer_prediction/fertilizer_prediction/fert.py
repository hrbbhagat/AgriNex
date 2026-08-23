import os
import streamlit as st
import pandas as pd
import joblib
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier

# Page Config
st.set_page_config(
    page_title="AgriNex AI - Fertilizer Recommender",
    page_icon="🧪",
    layout="centered"
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data_core.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'fertilizer_model.pkl')
PREPROCESSOR_PATH = os.path.join(BASE_DIR, 'preprocessor.pkl')


@st.cache_resource(show_spinner="Training model on first run…")
def load_or_train_model():
    """
    Load pre-trained model if available and compatible, otherwise train fresh
    from data_core.csv. Training on the deployment environment avoids
    scikit-learn version mismatch errors with serialised .pkl files.
    """
    df = pd.read_csv(DATA_PATH)
    df.columns = df.columns.str.strip()

    X = df[['Temparature', 'Humidity', 'Moisture', 'Soil Type', 'Crop Type',
             'Nitrogen', 'Potassium', 'Phosphorous']]
    y = df['Fertilizer Name']

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(sparse_output=False, handle_unknown='ignore'),
             ['Soil Type', 'Crop Type'])
        ],
        remainder='passthrough'
    )
    X_processed = preprocessor.fit_transform(X)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_processed, y)

    training_size = len(X)
    return model, preprocessor, training_size


model, preprocessor, training_size = load_or_train_model()

st.title("🧪 AgriNex AI Fertilizer Recommender")
st.caption("Precision NPK soil nutrient analysis and optimal fertilizer dosage prediction engine")
st.sidebar.title("🌿 AgriNex AI")
st.sidebar.metric("Training Samples", f"{training_size:,}")

with st.form("input_form"):
    st.subheader("🌡️ Environmental Conditions")
    col1, col2, col3 = st.columns(3)
    with col1:
        temperature = st.number_input("Temperature (°C)", min_value=0.0, max_value=50.0, value=25.0)
    with col2:
        humidity = st.number_input("Humidity (%)", min_value=0.0, max_value=100.0, value=50.0)
    with col3:
        moisture = st.number_input("Moisture (%)", min_value=0.0, max_value=100.0, value=30.0)

    st.subheader("🌱 Soil & Crop Profile")
    col4, col5 = st.columns(2)
    with col4:
        soil_type = st.selectbox("Soil Type", ["Sandy", "Loamy", "Black", "Red", "Clayey"])
    with col5:
        crop_type = st.selectbox("Crop Type", ["Maize", "Sugarcane", "Cotton", "Tobacco", "Paddy",
                                               "Barley", "Wheat", "Millets", "Oil seeds", "Pulses",
                                               "Ground Nuts"])

    st.subheader("🧪 Soil Nutrient Levels (ppm)")
    col6, col7, col8 = st.columns(3)
    with col6:
        nitrogen = st.number_input("Nitrogen (N)", min_value=0, max_value=140, value=20)
    with col7:
        potassium = st.number_input("Potassium (K)", min_value=0, max_value=205, value=10)
    with col8:
        phosphorous = st.number_input("Phosphorous (P)", min_value=0, max_value=145, value=15)

    submitted = st.form_submit_button("🧪 Predict Recommended Fertilizer")

if submitted:
    input_data = pd.DataFrame({
        'Temparature': [temperature],
        'Humidity': [humidity],
        'Moisture': [moisture],
        'Soil Type': [soil_type],
        'Crop Type': [crop_type],
        'Nitrogen': [nitrogen],
        'Potassium': [potassium],
        'Phosphorous': [phosphorous]
    })

    processed_data = preprocessor.transform(input_data)
    prediction = model.predict(processed_data)[0]
    st.success(f"Recommended fertilizer: **{prediction}**")
    st.write(
        f"Targeted for {crop_type} on {soil_type} soil under humidity ({humidity}%) "
        f"with the provided NPK values."
    )
    with st.expander("📘 About this fertilizer"):
        st.write(f"**{prediction}** is recommended based on your soil and crop profile.")
        st.write("Always follow the manufacturer's dosage guidelines and consult your local agronomist before application.")
    st.balloons()

st.divider()
st.caption("🧪 AgriNex AI · Fertilizer Recommender · Powered by Random Forest Classifier")

