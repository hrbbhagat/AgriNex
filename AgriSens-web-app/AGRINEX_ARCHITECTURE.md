# AgriNex AI Architecture & Model Deployment Guide

This document specifies the technical integration and deployment architecture for the AgriNex Smart Agriculture platform.

## 🛰️ Live Streamlit Applications

AgriNex integrates three core machine learning models deployed as standalone Streamlit web applications:

1. **Crop Recommendation AI Model**
   - **Streamlit Endpoint**: `https://smart-crop-recommendations.streamlit.app/`
   - **Page Integration**: `crop-prediction.html`
   - **Algorithm**: Random Forest Classifier
   - **Input Features**: Soil Nitrogen (N), Phosphorus (P), Potassium (K), Soil pH (3.5–9.5), Temperature (°C), Humidity (%), Rainfall (mm)
   - **Output**: 22 Major Crop Classes (Paddy, Wheat, Maize, Cotton, Jute, etc.)

2. **Fertilizer NPK Dosage Model**
   - **Streamlit Endpoint**: `https://fertilizer-predictions.streamlit.app/`
   - **Page Integration**: `fertilizer.html`
   - **Algorithm**: Soil Deficit Nutrient Classifier
   - **Input Features**: Soil Texture (Loamy, Black, Red, Sandy, Clayey), Target Crop, Farm Acreage, Soil NPK ppm
   - **Output**: Exact 50kg bag calculations for Urea (46% N), DAP (18-46-0), MOP (Potash), and application schedule

3. **Plant Disease Identification Vision Model**
   - **Streamlit Endpoint**: `https://plant-diseases-identification.streamlit.app/`
   - **Page Integration**: `disease-detection.html`
   - **Algorithm**: TensorFlow / Keras Convolutional Neural Network (CNN)
   - **Input Features**: RGB Crop Leaf Images (JPEG, PNG)
   - **Output**: 38 Disease Classes, Confidence Score %, and Targeted Fungicide/Pesticide Remedies

## 🤖 Universal AI Kisan Chatbot
- **Frontend Widget**: Floating FAB button & chat window in `styles.css`
- **Script Logic**: `initChatbot()` in `script.js`
- **Capabilities**: Conversational answers in English/Hindi for crop suitability, NPK fertilizer dosing, plant leaf disease treatment, APMC Mandi rates, and PM-KISAN schemes.
