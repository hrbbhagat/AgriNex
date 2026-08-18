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
# display image using streamlit
# width is used to set the width of an image
st.image(img)

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
    # # Making predictions using the model
    prediction = RF_Model_pkl.predict(np.array([nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]).reshape(1, -1))
    return prediction

## Streamlit code for the web app interface
def main():  
    st.set_page_config(
        page_title="AgriNex AI - Smart Crop Recommendation",
        page_icon="🌾",
        layout="wide"
    )

    st.markdown("""
    <style>
      .stApp { background-color: #FAF9F5; font-family: 'Inter', sans-serif; }
      .header-card {
          background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%);
          color: white;
          padding: 2.2rem;
          border-radius: 20px;
          text-align: center;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(27, 67, 50, 0.15);
      }
      .header-card h1 { color: #FFFFFF !important; font-size: 2.2rem !important; font-weight: 800 !important; }
      .header-card p { color: rgba(255,255,255,0.85) !important; font-size: 1rem !important; }
      .stButton > button {
          background: #1B4332 !important;
          color: white !important;
          font-weight: 700 !important;
          border-radius: 9999px !important;
          padding: 0.6rem 2rem !important;
          border: none !important;
          width: 100% !important;
      }
      .crop-res-card {
          background: linear-gradient(135deg, #1B4332 0%, #0F2D20 100%);
          color: white;
          padding: 2rem;
          border-radius: 20px;
          text-align: center;
          margin-top: 1rem;
      }
      .crop-res-card h2 { color: #D97706 !important; font-size: 2.5rem !important; text-transform: capitalize; }
    </style>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="header-card">
        <h1>🌾 Smart Crop Recommendation Engine</h1>
        <p>AI Decision System based on NPK soil chemistry, pH level & local meteorological figures</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.sidebar.title("🌿 AgriNex AI")
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
        
        inputs = np.array([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]])
        if st.sidebar.button("Run AI Prediction"):
            if not inputs.any() or np.isnan(inputs).any():
                st.error("Please provide valid parameter values before running prediction.")
            else:
                prediction = predict_crop(nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall)
                recommended_crop = str(prediction[0]).title()
                st.markdown(f"""
                <div class="crop-res-card">
                    <span style="font-size:0.85rem;letter-spacing:1px;font-weight:700;color:#D97706;">RECOMMENDED OPTIMAL CROP</span>
                    <h2>🌾 {recommended_crop}</h2>
                    <p style="margin-top:0.5rem;font-size:0.95rem;color:rgba(255,255,255,0.85);">
                        Exhibits highest yield compatibility under Nitrogen ({nitrogen}ppm), Temp ({temperature}°C), and Rainfall ({rainfall}mm).
                    </p>
                </div>
                """, unsafe_allow_html=True)
                st.balloons()

    with col2:
        st.subheader("📊 Input Parameter Overview")
        st.metric("Soil N-P-K", f"{nitrogen:.0f} - {phosphorus:.0f} - {potassium:.0f}")
        st.metric("Climate Temp / Humidity", f"{temperature}°C / {humidity}%")
        st.metric("Soil pH & Rainfall", f"{ph} pH / {rainfall} mm")


## Running the main function
if __name__ == '__main__':
    main()


