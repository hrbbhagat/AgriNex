## Importing necessary libraries for the web app
import streamlit as st
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report
from sklearn import metrics
from sklearn import tree
from sklearn.metrics import accuracy_score
import warnings
warnings.filterwarnings('ignore')
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Display Images
# import Image from pillow to open images
from PIL import Image
img = Image.open("crop.png")

df= pd.read_csv('Crop_recommendation.csv')

#features = df[['temperature', 'humidity', 'ph', 'rainfall']]
X = df[['N', 'P','K','temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']
labels = df['label']

# Split the data into training and testing sets
Xtrain, Xtest, Ytrain, Ytest = train_test_split(X, y, test_size=0.3, random_state=42)
RF = RandomForestClassifier(n_estimators=20, random_state=5)
RF.fit(Xtrain,Ytrain)
predicted_values = RF.predict(Xtest)
x = metrics.accuracy_score(Ytest, predicted_values)


# Function to load and display an image of the predicted crop
def show_crop_image(crop_name):
    # Assuming we have a directory named 'crop_images' with images named as 'crop_name.jpg'
    image_path = os.path.join('crop_images', crop_name.lower()+'.jpg')
    if os.path.exists(image_path):
        st.image(image_path, caption=f"Recommended crop: {crop_name}", use_column_width=True)
    else:
        st.error("Image not found for the predicted crop.")


import pickle
# Dump the trained Naive Bayes classifier with Pickle
RF_pkl_filename = 'RF.pkl'
# Open the file to save as pkl file
RF_Model_pkl = open(RF_pkl_filename, 'wb')
pickle.dump(RF, RF_Model_pkl)
# Close the pickle instances
RF_Model_pkl.close()


#model = pickle.load(open('RF.pkl', 'rb'))
RF_Model_pkl=pickle.load(open('RF.pkl','rb'))

## Function to make predictions
def predict_crop(nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall):
    input_arr = np.array([nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]).reshape(1, -1)
    prediction = RF_Model_pkl.predict(input_arr)
    # Top-3 crop probabilities
    proba = RF_Model_pkl.predict_proba(input_arr)[0]
    top3_idx = np.argsort(proba)[::-1][:3]
    top3 = [(RF_Model_pkl.classes_[i], round(proba[i] * 100, 1)) for i in top3_idx]
    return prediction, top3

## Streamlit code for the web app interface
def main():  
    st.set_page_config(
        page_title="AgriNex AI - Smart Crop Recommendation",
        page_icon="🌾",
        layout="wide"
    )
    st.title("🌾 Smart Crop Recommendation Engine")
    st.caption("AI decision system based on NPK soil chemistry, pH level, and local meteorological figures")
    st.image(img)
    
    st.sidebar.title("🌿 AgriNex AI")
    st.sidebar.success(f"✅ Model Accuracy: {round(x * 100, 2)}%")
    st.sidebar.header("Enter Farm Soil & Climate Parameters")
    
    nitrogen = st.sidebar.number_input("Nitrogen (N ppm)", min_value=0.0, max_value=140.0, value=90.0, step=1.0)
    phosphorus = st.sidebar.number_input("Phosphorus (P ppm)", min_value=0.0, max_value=145.0, value=42.0, step=1.0)
    potassium = st.sidebar.number_input("Potassium (K ppm)", min_value=0.0, max_value=205.0, value=43.0, step=1.0)
    temperature = st.sidebar.number_input("Temperature (°C)", min_value=0.0, max_value=51.0, value=25.0, step=0.5)
    humidity = st.sidebar.number_input("Humidity (%)", min_value=0.0, max_value=100.0, value=80.0, step=1.0)
    ph = st.sidebar.number_input("Soil pH Level", min_value=0.0, max_value=14.0, value=6.5, step=0.1)
    rainfall = st.sidebar.number_input("Annual Rainfall (mm)", min_value=0.0, max_value=500.0, value=200.0, step=5.0)

    col1, col2 = st.columns([1.2, 0.8])
    with col1:
        st.subheader("🌾 Optimal Crop Suitability Prediction")
        st.write("Click **Run AI Prediction** in the sidebar to process parameters through the trained Random Forest Classifier model.")

        # Warn user about unusual input values
        warnings_list = []
        if ph < 3.5 or ph > 10.0:
            warnings_list.append(f"⚠️ Soil pH {ph} is outside the typical agricultural range (3.5–10.0).")
        if temperature > 45.0:
            warnings_list.append(f"⚠️ Temperature {temperature}°C is extremely high — verify your input.")
        if rainfall > 450.0:
            warnings_list.append(f"⚠️ Rainfall {rainfall} mm seems unusually high — verify your input.")
        for w in warnings_list:
            st.warning(w)
        
        inputs = np.array([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]])
        if st.sidebar.button("Run AI Prediction"):
            if not inputs.any() or np.isnan(inputs).any():
                st.error("Please provide valid parameter values before running prediction.")
            else:
                prediction, top3 = predict_crop(nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall)
                recommended_crop = str(prediction[0]).title()
                st.success(f"Recommended optimal crop: {recommended_crop}")
                st.write(
                    f"Best compatibility under Nitrogen ({nitrogen} ppm), "
                    f"Temperature ({temperature} C), and Rainfall ({rainfall} mm)."
                )
                st.subheader("🌿 Top 3 Crop Suggestions")
                for rank, (crop, prob) in enumerate(top3, 1):
                    st.write(f"{rank}. **{crop.title()}** — {prob}% match")
                st.balloons()

    with col2:
        st.subheader("📊 Input Parameter Overview")
        st.metric("Soil N-P-K", f"{nitrogen:.0f} - {phosphorus:.0f} - {potassium:.0f}")
        st.metric("Climate Temp / Humidity", f"{temperature}°C / {humidity}%")
        st.metric("Soil pH & Rainfall", f"{ph} pH / {rainfall} mm")

        with st.expander("ℹ️ What do these parameters mean?"):
            st.write("**N (Nitrogen):** Promotes leaf and stem growth.")
            st.write("**P (Phosphorus):** Supports root development and flowering.")
            st.write("**K (Potassium):** Improves disease resistance and fruit quality.")
            st.write("**pH:** Soil acidity — most crops prefer 6.0–7.5.")
            st.write("**Rainfall:** Annual precipitation in millimetres.")

    st.divider()
    st.caption("🌾 AgriNex AI · Smart Crop Recommendation Engine · Powered by Random Forest Classifier")


## Running the main function
if __name__ == '__main__':
    main()

