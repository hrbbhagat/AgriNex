# AgriNex - Smart Agricultural Intelligence System

AgriNex is a comprehensive agricultural intelligence platform that leverages machine learning and deep learning to provide intelligent solutions for modern farming. The system offers three core functionalities: crop recommendation, plant disease identification, and fertilizer prediction.

## 🌾 Overview

AgriNex combines cutting-edge AI/ML technologies with user-friendly web interfaces to help farmers make data-driven decisions about crop selection, disease management, and fertilizer optimization. The platform integrates multiple machine learning models trained on agricultural datasets to provide accurate and actionable insights.

## 🚀 Deployed Live Streamlit Applications

AgriNex trained machine learning models are deployed live on Streamlit Cloud:

- 🌾 **Crop Recommendation AI**: [smart-crop-recommendations.streamlit.app](https://smart-crop-recommendations.streamlit.app/)
- 🧪 **Fertilizer Prediction AI**: [fertilizer-predictions.streamlit.app](https://fertilizer-predictions.streamlit.app/)
- 🔬 **Plant Disease Identification**: [plant-diseases-identification.streamlit.app](https://plant-diseases-identification.streamlit.app/)

## ✨ Features

- **Embedded Streamlit ML Apps**: Real-time predictions directly integrated into tool pages (`crop-prediction.html`, `fertilizer.html`, `disease-detection.html`)
- **Universal AI Kisan Chatbot**: Responsive floating AI assistant widget for crop, fertilizer, disease, and Mandi queries
- **Crop Recommendation**: Intelligent crop suggestion based on soil nutrients (N, P, K), temperature, humidity, pH level, and rainfall
- **Plant Disease Detection**: AI-powered identification of plant diseases using image recognition (supports 38+ disease classes)
- **Fertilizer Prediction**: Automated fertilizer recommendations based on soil conditions and environmental factors
- **Live Mandi Ticker & Govt Schemes**: Real-time wholesale APMC commodity rates and PM-KISAN subsidy guidance
- **Comprehensive Farm Dashboard**: Telemetry meters, 7-day weather spraying advice, yield revenue calculator, and KVK directory

## 🛠️ Tech Stack

### Frontend
- **React.js** - Interactive user interface
- **HTML/CSS/JavaScript** - Web standards

### Backend & ML Services
- **Python** - Core language for ML/AI services
- **Streamlit** - Framework for data apps and model serving
- **Flask** - Web framework for APIs

### Machine Learning & AI
- **TensorFlow** - Deep learning framework
- **Keras** - Neural network API for plant disease identification
- **scikit-learn** - Machine learning algorithms for crop and fertilizer prediction
- **Random Forest Classifier** - Ensemble learning for crop recommendation

### Data Processing & Visualization
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **Matplotlib** - 2D plotting and visualization
- **Seaborn** - Statistical data visualization
- **OpenCV** - Computer vision for image processing

### Datasets
- **PlantVillage Dataset** - 38 plant disease classes
- **Crop Recommendation Dataset** - Soil and environmental parameters
- **Fertilizer Recommendation Dataset** - Soil nutrient analysis

## 📁 Project Structure

```
AgriNex/
├── CROP PREDICT/                          # React frontend + ML model training
│   ├── frontend/                          # React application
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   └── manifest.json
│   │   └── src/
│   │       ├── App.js
│   │       ├── home.js
│   │       ├── index.js
│   │       └── index.css
│   ├── saved_model/                       # Pre-trained crop prediction models
│   │   ├── model_v1.h5
│   │   ├── model_v2.h5
│   │   └── model_v3.h5
│   └── training/
│       ├── model.ipynb                    # Model training notebook
│       └── PlantVillage/                  # Training dataset
│
├── CROP-RECOMMENDATION/                   # Streamlit crop recommendation app
│   ├── webapp.py                          # Main Streamlit application
│   ├── Crop_recommendation.csv            # Dataset
│   ├── requirements.txt
│   └── fgd.html
│
├── PLANT-DISEASE-IDENTIFICATION/          # Streamlit disease detection app
│   ├── main.py                            # Main Streamlit application
│   ├── trained_plant_disease_model.keras  # Trained Keras model
│   ├── Train_plant_disease.ipynb          # Training notebook
│   ├── Test_plant_disease.ipynb           # Testing notebook
│   ├── training_hist.json                 # Training history
│   ├── settings.json                      # Configuration
│   ├── requirements.txt
│   └── test/                              # Test images
│
├── fertilizer_prediction/                 # Fertilizer prediction module
│   └── fertilizer_prediction/
│       ├── fert.py                        # Fertilizer prediction script
│       ├── p1.ipynb                       # Analysis notebook
│       ├── data_core.csv                  # Dataset
│       └── requirements.txt
│
├── Datasets/                              # Consolidated datasets
│   ├── Crop_recommendation.csv
│   ├── Fertilizer_recommendation.csv
│   ├── README.md
│   └── PlantVillage/                      # Plant disease images
│       ├── Potato___healthy/
│       ├── Potato___Late_blight/
│       └── [38+ disease classes]
│
└── AgriSens-web-app/                      # Integrated web application
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 12+ (for frontend)
- pip or conda for package management
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/AgriNex.git
cd AgriNex
```

#### 2. Setup Crop Recommendation Service
```bash
cd CROP-RECOMMENDATION
pip install -r requirements.txt
streamlit run webapp.py
```
The app will be available at `http://localhost:8501`

#### 3. Setup Plant Disease Identification Service
```bash
cd ../PLANT-DISEASE-IDENTIFICATION
pip install -r requirements.txt
streamlit run main.py
```
The app will be available at `http://localhost:8502`

#### 4. Setup Fertilizer Prediction Service
```bash
cd ../fertilizer_prediction/fertilizer_prediction
pip install -r requirements.txt
python fert.py
```

#### 5. Setup React Frontend (Optional)
```bash
cd ../CROP\ PREDICT/frontend
npm install
npm start
```
The frontend will be available at `http://localhost:3000`

## 📊 Model Details

### Crop Recommendation Model
- **Algorithm**: Random Forest Classifier
- **Features**: N, P, K (soil nutrients), Temperature, Humidity, pH, Rainfall
- **Output Classes**: 22 different crops
- **Accuracy**: ~99%
- **Training Data**: 2,200+ samples

### Plant Disease Detection Model
- **Framework**: TensorFlow/Keras
- **Architecture**: Convolutional Neural Network (CNN)
- **Input Size**: 128x128 RGB images
- **Output Classes**: 38 plant disease classes
- **Supported Crops**: Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato

### Fertilizer Prediction Model
- **Algorithm**: Machine Learning Classifier
- **Features**: Soil nutrients, pH, moisture, temperature
- **Output**: Recommended fertilizer type and quantity
- **Training Data**: Agricultural benchmark datasets

## 💻 Usage Examples

### Crop Recommendation
```python
Input: N=90, P=42, K=43, Temperature=20.87, Humidity=82.00, pH=6.5, Rainfall=202.9
Output: Recommendation for "Maize" crop
```

### Disease Detection
```python
Input: Plant leaf image
Output: Disease identified with confidence score
Example: "Potato___Late_blight - 95% confidence"
```

### Fertilizer Recommendation
```python
Input: Soil parameters and crop type
Output: Specific fertilizer recommendation with dosage
```

## 📈 Dataset Information

- **PlantVillage Dataset**: 61,486 images across 38 disease classes
- **Crop Dataset**: Features covering 22 different crops with environmental parameters
- **Fertilizer Dataset**: Comprehensive soil and crop parameters with recommendations

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Model Training & Evaluation

To retrain or evaluate models:

### Crop Prediction
```bash
cd CROP\ PREDICT/training
jupyter notebook model.ipynb
```

### Plant Disease Detection
```bash
cd PLANT-DISEASE-IDENTIFICATION
jupyter notebook Train_plant_disease.ipynb
```

## 🔧 Configuration

Each service has a `settings.json` or configuration file for model parameters and settings. Modify these files to adjust:
- Model paths
- Input parameters
- Output formats
- Service ports

## 📦 Dependencies

See individual `requirements.txt` files in each module directory for specific dependencies:
- Core ML dependencies: TensorFlow, Keras, scikit-learn
- Data processing: Pandas, NumPy
- Visualization: Matplotlib, Seaborn
- Web frameworks: Streamlit, Flask
- Image processing: OpenCV, Pillow

## 🐛 Troubleshooting

### Model Loading Issues
- Ensure model files (.keras, .h5) are in the correct directories
- Verify TensorFlow and Keras versions match training environment

### Streamlit Port Already in Use
```bash
streamlit run app.py --server.port 8503
```

### Missing Dependencies
```bash
pip install --upgrade -r requirements.txt
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team & Credits

AgriNex is developed as an agricultural AI solution combining expertise in:
- Machine Learning & Deep Learning
- Agricultural Science
- Full-Stack Web Development

## 📞 Support

For issues, questions, or suggestions:
1. Open an issue on GitHub
2. Check existing documentation
3. Review dataset README files for data-specific questions

## 🌱 Future Enhancements

- [ ] Weather API integration
- [ ] Real-time market price prediction
- [ ] Mobile application
- [ ] Multi-language support
- [ ] Cloud deployment
- [ ] Advanced analytics dashboard
- [ ] IoT sensor integration
- [ ] Community feedback system

---

**Made with ❤️ for sustainable agriculture**
