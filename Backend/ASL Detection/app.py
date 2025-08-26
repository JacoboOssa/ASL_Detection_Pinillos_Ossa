from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io

app = FastAPI()

# Permitir conexiones desde el frontend (en local acepta todo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar tu modelo
model = load_model("ASL_detector_CNN.h5")
class_names = [
 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
 'U', 'V', 'W', 'X', 'Y', 'Z',
 'del', 'nothing', 'space'
]
image_size = 64  # Pon el tamaño que usaste al entrenar

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Leer y procesar la imagen
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image = image.resize((image_size, image_size))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Hacer la predicción
    pred = model.predict(img_array)
    pred_idx = int(np.argmax(pred))
    pred_class = class_names[pred_idx]
    pred_score = float(pred[0][pred_idx])
    return {"prediction": pred_class, "confidence": pred_score}

