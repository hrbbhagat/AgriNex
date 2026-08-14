import os
import streamlit as st
import pandas as pd
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, 'fertilizer_model.pkl'))
preprocessor = joblib.load(os.path.join(BASE_DIR, 'preprocessor.pkl'))

st.title("🌱 Crop Fertilizer Recommender")
st.markdown("Enter soil, crop, and environmental conditions to get fertilizer recommendations.")


with st.form("input_form"):
    st.subheader("Environmental Conditions")
    col1, col2, col3 = st.columns(3)
    with col1:
        temperature = st.number_input("Temperature (°C)", min_value=0.0, max_value=50.0, value=25.0)
    with col2:
        humidity = st.number_input("Humidity (%)", min_value=0.0, max_value=100.0, value=50.0)
    with col3:
        moisture = st.number_input("Moisture (%)", min_value=0.0, max_value=100.0, value=30.0)

    st.subheader("Soil and Crop Details")
    col4, col5 = st.columns(2)
    with col4:
        soil_type = st.selectbox("Soil Type", ["Sandy", "Loamy", "Black", "Red", "Clayey"])
    with col5:
        crop_type = st.selectbox("Crop Type", ["Maize", "Sugarcane", "Cotton", "Tobacco", "Paddy", 
                                              "Barley", "Wheat", "Millets", "Oil seeds", "Pulses", 
                                              "Ground Nuts"])

    st.subheader("Nutrient Levels (ppm)")
    col6, col7, col8 = st.columns(3)
    with col6:
        nitrogen = st.number_input("Nitrogen (N)", min_value=0, max_value=100, value=20)
    with col7:
        potassium = st.number_input("Potassium (K)", min_value=0, max_value=100, value=10)
    with col8:
        phosphorous = st.number_input("Phosphorous (P)", min_value=0, max_value=100, value=15)

    submitted = st.form_submit_button("Recommend Fertilizer")
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

 
    st.success(f"**Recommended Fertilizer:** {prediction}")
    st.balloons()
