from PIL import Image
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration
import sys
import os

# Check for CUDA availability and set device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Inizializza modello e processor BLIP
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
model = model.to(device)  # Move model to GPU

def describe_image(image_path):
    if not os.path.exists(image_path):
        print(f"Errore: il file '{image_path}' non esiste.")
        return

    image = Image.open(image_path).convert('RGB')
    inputs = processor(images=image, return_tensors="pt")
    
    # Move input tensors to GPU
    for k, v in inputs.items():
        inputs[k] = v.to(device)
        
    output = model.generate(**inputs)
    caption = processor.decode(output[0], skip_special_tokens=True)
    return caption

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Utilizzo: python image-to-text.py path/alla/immagine.jpg")
        sys.exit(1)

    image_path = sys.argv[1]
    caption = describe_image(image_path)
    if caption:
        print(f"Descrizione: {caption}")