import streamlit as st
import tensorflow as tf
import numpy as np
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "trained_plant_disease_model.keras"

CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
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
    'Tomato___healthy'
]

# Page Config
st.set_page_config(
    page_title="AgriNex AI - Plant Disease Scanner",
    page_icon="🔬",
    layout="centered"
)


@st.cache_resource
def load_disease_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
    return tf.keras.models.load_model(str(MODEL_PATH))


def predict_from_upload(uploaded_file):
    """Run prediction strictly on uploaded images using the trained model."""
    # Reset stream so repeated calls read the full image
    if hasattr(uploaded_file, "seek"):
        uploaded_file.seek(0)

    model = load_disease_model()
    image = Image.open(uploaded_file).convert("RGB")
    image_arr = np.array(image)

    # Resize and normalise for the model
    resized = tf.image.resize(image_arr, [128, 128]).numpy().astype(np.float32) / 255.0
    input_arr = np.expand_dims(resized, axis=0)

    predictions = model.predict(input_arr, verbose=0)[0]
    result_index = int(np.argmax(predictions))
    confidence = float(np.max(predictions))
    return result_index, confidence


def render_prediction_ui():
    st.title("🔬 Plant Disease Vision Diagnostic")
    st.caption("Deep Learning CNN with 38 disease categories — upload a clear leaf photo for accurate diagnosis")

    with st.expander("🌿 Supported Crops & Diseases (38 categories)"):
        crops = sorted(set(c.split("___")[0].replace("_", " ") for c in CLASS_NAMES))
        for crop in crops:
            st.write(f"• {crop}")

    input_method = st.radio(
        "Select image source:",
        ["Upload Photo", "Camera Capture"],
        horizontal=True,
        key="source_main"
    )

    # ── Camera path ──────────────────────────────────────────────────────────
    if input_method == "Camera Capture":
        st.camera_input("Take a leaf picture", key="camera_main")
        st.warning(
            "⚠️ No clear image can be captured via live camera for reliable diagnosis. "
            "Please switch to **Upload Photo** and upload a high-quality leaf image for an accurate prediction."
        )
        return  # Stop here — no model run for camera

    # ── Upload path ──────────────────────────────────────────────────────────
    uploaded_image = st.file_uploader(
        "Choose a leaf image:", type=["jpg", "jpeg", "png"], key="upload_main"
    )

    if uploaded_image is not None:
        st.image(uploaded_image, caption="Uploaded Leaf Image", width=360)

    if st.button("🔬 Run AI Disease Diagnosis", key="predict_main"):
        if uploaded_image is None:
            st.warning("Please upload a leaf image before running the diagnosis.")
            return

        with st.spinner("Analysing leaf image…"):
            try:
                result_index, confidence = predict_from_upload(uploaded_image)
            except FileNotFoundError as e:
                st.error(f"Model not found: {e}")
                return
            except Exception as e:
                st.error(f"Prediction failed: {e}")
                return

        disease_name = CLASS_NAMES[result_index].replace("___", " — ").replace("_", " ")
        st.success(f"**Diagnosis:** {disease_name}")
        st.info(f"**Confidence:** {confidence * 100:.1f}%")
        st.progress(confidence)
        st.write("Identified using a TensorFlow CNN model trained on the PlantVillage dataset.")
        st.balloons()


# Sidebar
st.sidebar.title("🌿 AgriNex AI")
st.sidebar.selectbox("Select Mode", ["DISEASE RECOGNITION", "HOME"])

# Main Execution
render_prediction_ui()
