from PIL import Image
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration
import sys
import os
import json
import time
from datetime import datetime

# Check for CUDA availability and set device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Directory di output per i risultati JSON
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

# Inizializza modello e processor BLIP
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
model = model.to(device)  # Move model to GPU

def describe_image(image_path):
    if not os.path.exists(image_path):
        return None

    try:
        image = Image.open(image_path).convert('RGB')
        inputs = processor(images=image, return_tensors="pt")
        
        # Move input tensors to GPU
        for k, v in inputs.items():
            inputs[k] = v.to(device)
            
        output = model.generate(**inputs)
        caption = processor.decode(output[0], skip_special_tokens=True)
        return caption
    except Exception as e:
        return None

def save_to_json(caption, image_path, elapsed_time, output_dir=OUTPUT_DIR):
    """Salva i risultati della descrizione in un file JSON."""
    # Assicurati che la directory di output esista
    os.makedirs(output_dir, exist_ok=True)
    
    # Genera un nome file basato sul nome dell'immagine e timestamp
    img_filename = os.path.basename(image_path)
    base_name = os.path.splitext(img_filename)[0]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"{base_name}_{timestamp}.json"
    output_path = os.path.join(output_dir, output_filename)
    
    # Crea il dizionario con i dati da salvare
    result = {
        "image_file": image_path,
        "caption": caption,
        "processing_time_seconds": round(elapsed_time, 2),
        "timestamp": datetime.now().isoformat()
    }
    
    # Salva il file JSON
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    return output_path

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(1)

    image_path = "img/" + sys.argv[1]
    
    start_time = time.time()
    caption = describe_image(image_path)
    elapsed_time = time.time() - start_time
    
    if caption:
        save_to_json(caption, image_path, elapsed_time)