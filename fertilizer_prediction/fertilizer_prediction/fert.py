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

# Custom Styling
st.markdown("""
<style>
  .stApp {
      background-color: #FAF9F5;
      font-family: 'Inter', sans-serif;
  }
  .main-header {
      background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%);
      color: white;
      padding: 2.5rem;
      border-radius: 20px;
      text-align: center;
      margin-bottom: 2rem;
      box-shadow: 0 10px 30px rgba(27, 67, 50, 0.15);
  }
  .main-header h1 {
      color: #FFFFFF !important;
      font-size: 2.4rem !important;
      font-weight: 800 !important;
      margin-bottom: 0.5rem !important;
  }
  .main-header p {
      color: rgba(255,255,255,0.85) !important;
      font-size: 1.05rem !important;
  }
  div[data-testid="stForm"] {
      background: white;
      border: 1px solid #E2E8F0;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 8px 30px rgba(0,0,0,0.04);
  }
  .stButton > button {
      background: #1B4332 !important;
      color: white !important;
      font-weight: 700 !important;
      border-radius: 9999px !important;
      padding: 0.6rem 2rem !important;
      border: none !important;
      width: 100% !important;
      transition: all 0.3s ease !important;
  }
  .stButton > button:hover {
      background: #2D6A4F !important;
      box-shadow: 0 8px 25px rgba(27, 67, 50, 0.25) !important;
  }
  .res-card {
      background: linear-gradient(135deg, #1B4332 0%, #0F2D20 100%);
      color: white;
      padding: 2rem;
      border-radius: 20px;
      text-align: center;
      margin-top: 1.5rem;
  }
  .res-card h2 {
      color: #D97706 !important;
      font-size: 2.2rem !important;
      margin-top: 0.5rem !important;
  }
</style>
""", unsafe_allow_html=True)

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

    return model, preprocessor


model, preprocessor = load_or_train_model()

# Header Container
st.markdown("""
<div class="main-header">
    <h1>🧪 AgriNex AI Fertilizer Recommender</h1>
    <p>Precision NPK soil nutrient analysis & optimal fertilizer dosage prediction engine</p>
</div>
""", unsafe_allow_html=True)

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

    st.markdown(f"""
    <div class="res-card">
        <span style="font-size:0.85rem;letter-spacing:1px;font-weight:700;color:#D97706;">OPTIMAL AI RECOMMENDATION</span>
        <h2>{prediction}</h2>
        <p style="margin-top:0.5rem;font-size:0.95rem;color:rgba(255,255,255,0.85);">
            Targeted for {crop_type} on {soil_type} soil under current humidity ({humidity}%) and NPK values.
        </p>
    </div>
    """, unsafe_allow_html=True)
    st.balloons()

