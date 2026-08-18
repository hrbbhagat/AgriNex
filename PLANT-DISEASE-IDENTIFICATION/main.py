import streamlit as st
import tensorflow as tf
import numpy as np
from pathlib import Path
from PIL import Image

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
    # Reset stream position so repeated preview/predict actions read the full image.
    if hasattr(test_image, "seek"):
        test_image.seek(0)

    model = load_disease_model()
    image = Image.open(test_image).convert("RGB")
    image_arr = np.array(image)

    # Simple leaf-presence heuristic based on green pixel dominance.
    r = image_arr[:, :, 0].astype(np.float32)
    g = image_arr[:, :, 1].astype(np.float32)
    b = image_arr[:, :, 2].astype(np.float32)
    green_mask = (g > (r * 1.05)) & (g > (b * 1.05)) & (g > 40)
    leaf_ratio = float(np.mean(green_mask))

    resized = tf.image.resize(image_arr, [128, 128]).numpy().astype(np.float32) / 255.0
    input_arr = np.expand_dims(resized, axis=0)
    predictions = model.predict(input_arr, verbose=0)[0]
    result_index = int(np.argmax(predictions))
    confidence = float(np.max(predictions))
    return result_index, confidence, leaf_ratio

# Page Config
st.set_page_config(
    page_title="AgriNex AI - Plant Disease Scanner",
    page_icon="🔬",
    layout="centered"
)

# Custom Styling
st.markdown("""
<style>
  .stApp { background-color: #FAF9F5; font-family: 'Inter', sans-serif; }
  .header-card-dis {
      background: linear-gradient(135deg, #1B4332 0%, #0F2D20 100%);
      color: white;
      padding: 2.2rem;
      border-radius: 20px;
      text-align: center;
      margin-bottom: 2rem;
      box-shadow: 0 10px 30px rgba(27, 67, 50, 0.15);
  }
  .header-card-dis h1 { color: #FFFFFF !important; font-size: 2.2rem !important; font-weight: 800 !important; }
  .header-card-dis p { color: rgba(255,255,255,0.85) !important; font-size: 1rem !important; }
  .stButton > button {
      background: #1B4332 !important;
      color: white !important;
      font-weight: 700 !important;
      border-radius: 9999px !important;
      padding: 0.6rem 2rem !important;
      border: none !important;
      width: 100% !important;
  }
  .dis-res-card {
      background: linear-gradient(135deg, #1B4332 0%, #0F2D20 100%);
      color: white;
      padding: 2rem;
      border-radius: 20px;
      margin-top: 1.5rem;
  }
  .dis-res-card h2 { color: #D97706 !important; font-size: 2.2rem !important; margin: 0.5rem 0 !important; }
</style>
""", unsafe_allow_html=True)

def render_prediction_ui(section_title):
    st.markdown("""
    <div class="header-card-dis">
        <h1>🔬 Plant Disease Vision Diagnostic</h1>
        <p>Deep Learning CNN Computer Vision • 38 Disease Categories & Healthy Leaf Analysis</p>
    </div>
    """, unsafe_allow_html=True)

    input_method = st.radio(
        "Select image source:",
        ["Upload Photo", "Camera Capture"],
        horizontal=True,
        key=f"source_{section_title}"
    )

    uploaded_image = None
    camera_image = None

    if input_method == "Upload Photo":
        uploaded_image = st.file_uploader("Choose a Leaf Image:", type=["jpg", "jpeg", "png"], key=f"upload_{section_title}")
    else:
        camera_image = st.camera_input("Take a leaf picture", key=f"camera_{section_title}")

    test_image = uploaded_image if input_method == "Upload Photo" else camera_image

    if test_image is not None:
        st.image(test_image, caption="Selected Leaf Image", width=360)

    if(st.button("🔬 Run AI Disease Diagnosis", key=f"predict_{section_title}")):
        if test_image is None:
            st.warning("Please provide a leaf image before prediction.")
            return
        st.snow()
        try:
            result_index, confidence, leaf_ratio = model_prediction(test_image)
        except Exception as e:
            st.error(f"Failed to load model or run prediction: {e}")
            return

        if input_method == "Camera Capture":
            if leaf_ratio < 0.02 or confidence < 0.45:
                st.warning("No clear leaf detected. Please capture a close-up image of a single leaf.")
                return
        else:
            if leaf_ratio < 0.02:
                st.warning("No clear leaf found. Please capture a closer image of a single leaf in good lighting.")
                return

            if confidence < 0.45:
                st.warning("Low confidence prediction. Please retake the photo with clearer focus.")
                return

        disease_name = CLASS_NAMES[result_index].replace("___", " - ").replace("_", " ")
        st.markdown(f"""
        <div class="dis-res-card">
            <span style="font-size:0.85rem;letter-spacing:1px;font-weight:700;color:#D97706;">AI DIAGNOSTIC REPORT</span>
            <h2>🌿 {disease_name}</h2>
            <p style="font-size:1.1rem;font-weight:700;color:#74C69D;">AI Confidence Score: {confidence * 100:.1f}%</p>
            <p style="margin-top:0.8rem;font-size:0.95rem;color:rgba(255,255,255,0.85);">
                Identified using TensorFlow Deep Learning CNN model trained on plant pathology datasets.
            </p>
        </div>
        """, unsafe_allow_html=True)

# Sidebar
st.sidebar.title("🌿 AgriNex AI")
app_mode = st.sidebar.selectbox("Select Mode", ["DISEASE RECOGNITION", "HOME"])

# Main Execution
if(app_mode=="HOME" or app_mode=="DISEASE RECOGNITION"):
    render_prediction_ui("DISEASE RECOGNITION")