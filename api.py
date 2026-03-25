from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import uvicorn
import tensorflow as tf
import numpy as np
from PIL import Image
import io
from datetime import datetime
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
load_dotenv()
# --- CLOUDINARY SETUP ---
# JUST ADD YOUR CLOUD NAME HERE!
cloudinary.config( 
  cloud_name = "CLOUDINARY_CLOUD_NAME", 
  api_key = "CLOUDINARY_API_KEY", 
  api_secret = "CLOUDINARY_API_SECRET" 
)

# --- MONGODB SETUP ---
MONGO_DETAILS = "MONGODB_URL"
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.crophealth
reports_collection = database.get_collection("reports")
print("🟢 Async MongoDB Connected Successfully!")

# --- AI MODEL SETUP ---
print("Loading the AI Brain...")
model = tf.keras.models.load_model('plant_disease_model.keras')
print("Brain loaded successfully!")

CLASS_NAMES = [
    "Chili_Bacterial Spot", "Chili_Cercospora Leaf Spot", "Chili_Curl Virus",
    "Chili_Healthy Leaf", "Chili_Nutrition Deficiency", "Chili_White spot",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight",
    "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

TREATMENT_PLANS = {
    "Chili_Bacterial Spot": "Remove infected leaves. Apply copper-based bactericide sprays. Avoid overhead watering.",
    "Chili_Cercospora Leaf Spot": "Apply fungicides containing chlorothalonil. Practice crop rotation.",
    "Chili_Curl Virus": "Control insects with neem oil. Remove infected plants.",
    "Chili_Healthy Leaf": "Your chili plant is perfectly healthy! Maintain a good watering schedule.",
    "Chili_Nutrition Deficiency": "Apply a balanced N-P-K fertilizer. Check soil pH.",
    "Chili_White spot": "Improve air circulation. Apply appropriate broad-spectrum fungicides.",
    "Tomato___Bacterial_spot": "Prune infected leaves. Spray with a copper-based bactericide.",
    "Tomato___Early_blight": "Prune lower leaves to increase airflow. Apply a copper-based fungicide.",
    "Tomato___Late_blight": "Extremely contagious. Remove and destroy all infected plants immediately.",
    "Tomato___Leaf_Mold": "Improve air circulation by pruning. Avoid getting leaves wet.",
    "Tomato___Septoria_leaf_spot": "Remove infected bottom leaves. Apply fungicidal sprays.",
    "Tomato___Spider_mites Two-spotted_spider_mite": "Spray plants with water. Apply neem oil.",
    "Tomato___Target_Spot": "Remove severely infected leaves. Apply fungicides like azoxystrobin.",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "Control whitefly populations using yellow sticky traps. Remove infected plants.",
    "Tomato___Tomato_mosaic_virus": "No cure. Remove and burn infected plants immediately.",
    "Tomato___healthy": "Your tomato plant is completely healthy! Keep up the good work."
}

# --- Pydantic Model for Database Entries ---
class Report(BaseModel):
    disease: str
    confidence: str
    treatment: str
    lat: float
    lng: float
    image_url: str 

# --- ENDPOINTS ---

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    
    # 1. AI PREDICTION LOGIC
    image = Image.open(io.BytesIO(contents)).resize((224, 224))
    img_array = tf.keras.utils.img_to_array(image)
    img_array = tf.expand_dims(img_array, 0)
    
    predictions = model.predict(img_array)
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = round(100 * (np.max(predictions[0])), 2)
    recommended_treatment = TREATMENT_PLANS.get(predicted_class, "Consult an expert.")
    
    # 2. UPLOAD TO CLOUDINARY
    upload_result = cloudinary.uploader.upload(contents, folder="crophealth_ai")
    secure_image_url = upload_result.get("secure_url")
    
    return {
        "disease": predicted_class,
        "confidence": f"{confidence}%",
        "treatment": recommended_treatment,
        "image_url": secure_image_url # Send the URL back to React!
    }

@app.post("/api/reports")
async def save_report(report: Report):
    report_dict = report.dict()
    report_dict["date"] = datetime.utcnow()
    new_report = await reports_collection.insert_one(report_dict)
    return {"message": "Report saved successfully", "id": str(new_report.inserted_id)}

@app.get("/api/reports")
async def get_reports():
    reports = []
    async for report in reports_collection.find():
        report["_id"] = str(report["_id"])
        reports.append(report)
    return reports

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)