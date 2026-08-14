import streamlit as st
import tensorflow as tf
import numpy as np
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "trained_plant_disease_model.keras"
DISEASES_IMAGE_PATH = BASE_DIR / "Diseases.png"

CLASS_NAMES = ['Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
            'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 
            'Cherry_(including_sour)___healthy', 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 
            'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 
            'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 
            'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot',
            'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 
            'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy', 
            'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 
            'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot', 
            'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 
            'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 
            'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
              'Tomato___healthy']

@st.cache_resource
def load_disease_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
    return tf.keras.models.load_model(str(MODEL_PATH))

def model_prediction(test_image):
    model = load_disease_model()
    image = tf.keras.preprocessing.image.load_img(test_image,target_size=(128,128))
    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    input_arr = np.array([input_arr]) #convert single image to batch
    predictions = model.predict(input_arr)
    return np.argmax(predictions) #return index of max element

def render_prediction_ui(section_title):
    st.header(section_title)
    input_method = st.radio(
        "Select image source:",
        ["Upload", "Camera"],
        horizontal=True,
        key=f"source_{section_title}"
    )

    uploaded_image = None
    camera_image = None

    if input_method == "Upload":
        uploaded_image = st.file_uploader("Choose an Image:", type=["jpg", "jpeg", "png"], key=f"upload_{section_title}")
    else:
        camera_image = st.camera_input("Take a picture", key=f"camera_{section_title}")

    test_image = uploaded_image if input_method == "Upload" else camera_image

    if(st.button("Show Image", key=f"show_{section_title}")):
        if test_image is None:
            st.warning("Please provide an image first.")
        else:
            st.image(test_image, caption="Selected image", width=320)

    if(st.button("Predict", key=f"predict_{section_title}")):
        if test_image is None:
            st.warning("Please provide an image before prediction.")
            return
        st.snow()
        st.write("Our Prediction")
        try:
            result_index = model_prediction(test_image)
        except Exception as e:
            st.error(f"Failed to load model or run prediction: {e}")
            return
        st.success("Model is Predicting it's a {}".format(CLASS_NAMES[result_index]))

#Sidebar
st.sidebar.title("AgriSens")
app_mode = st.sidebar.selectbox("Select Page",["HOME","DISEASE RECOGNITION"])


# import Image from pillow to open images
from PIL import Image
if DISEASES_IMAGE_PATH.exists():
    img = Image.open(DISEASES_IMAGE_PATH)
    # width is used to set the width of an image
    st.image(img)
else:
    st.warning("Banner image not found: Diseases.png")

#Main Page
if(app_mode=="HOME"):
    st.markdown("<h1 style='text-align: center;'>SMART DISEASE DETECTION", unsafe_allow_html=True)
    render_prediction_ui("DISEASE RECOGNITION")
    
#Prediction Page
elif(app_mode=="DISEASE RECOGNITION"):
    render_prediction_ui("DISEASE RECOGNITION")