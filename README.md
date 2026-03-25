**# 🌿 CropHealth Intelligence Network (Plant Disease Detection & Treatment)

An advanced, full-stack agricultural monitoring platform that leverages **Convolutional Neural Networks (CNN)** to diagnose crop diseases and geospatial mapping to track global outbreaks in real-time.

## 🚀 Overview

This platform is designed to provide farmers and agricultural administrators with a high-tech "intelligence dossier" on crop health. Users can upload images of infected leaves, receive an instant AI-powered diagnosis, and view recommended neutralization protocols. Every diagnosis is mapped onto an interactive 3D globe to track disease spread geographically.

## ✨ Key Features

* **🧠 AI Diagnosis Engine**: Custom CNN model trained to detect 16+ varieties of Tomato and Chili diseases.
* **🌍 Geospatial Outbreak Tracking**: Interactive 3D globe using **Mapbox GL** to visualize disease spread based on user reports.
* **☁️ Cloud Image Integration**: Automated leaf sample and user profile image storage via **Cloudinary**.
* **🗃️ Classified Farmer Dossiers**: Secure, role-based user authentication (JWT) with a "criminal record" style history dashboard for tracking recurring farm infections.
* **📍 Smart Location Picker**: Integrated search and click-to-drop functionality for precise farm mapping.

## 🛠️ Tech Stack

* **Frontend**: React.js, Vite, Tailwind CSS, Mapbox GL, Lucide Icons.
* **Backend**: Python, FastAPI, Motor (Async MongoDB Driver), Passlib (Bcrypt).
* **AI/ML**: TensorFlow/Keras, NumPy, Pillow.
* **Database**: MongoDB (NoSQL).
* **Cloud Services**: Cloudinary (Image Hosting).

## ⚙️ Setup & Installation

To run this project locally, you will need two separate terminal windows (one for the frontend, one for the backend).

### 1. Environment Variables
Create a `.env` file in both the root folder and the `frontend/` folder.

**Backend `.env` (Root directory):**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URL=mongodb://127.0.0.1:27017**
