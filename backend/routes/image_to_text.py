import os
import sys
import tempfile
import base64
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional

# Aggiungi la directory dei modelli al path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../ai_models/src')))

# Importa il necessario da image-to-text.py
from PIL import Image
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration

router = APIRouter(
    prefix="/image-to-text",
    tags=["image-to-text"],
    responses={404: {"description": "Not found"}},
)

# Inizializza modello e processor BLIP
def load_model():
    """Carica il modello BLIP per l'image captioning."""
    try:
        device = "cuda" if torch.cuda.is_available() else "cpu"
        if device == "cuda":
            print(f"Caricamento del modello BLIP su GPU: {torch.cuda.get_device_name(0)}")
            torch.cuda.empty_cache()
        else:
            print("GPU non disponibile. Caricamento del modello su CPU...")
        
        processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
        model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
        model = model.to(device)
        
        print(f"Modello BLIP caricato con successo su {device.upper()}!")
        return processor, model, device
    except Exception as e:
        print(f"Errore nel caricamento del modello BLIP: {str(e)}")
        return None, None, None

# Carica il modello all'avvio
processor, model, device = load_model()

class ImageToTextResponse(BaseModel):
    caption: str
    error: Optional[str] = None

class ImageBase64Request(BaseModel):
    image_base64: str

def describe_image(image_path):
    """Genera una descrizione testuale per un'immagine dato il suo percorso."""
    if not os.path.exists(image_path):
        return None, "File immagine non trovato"

    try:
        image = Image.open(image_path).convert('RGB')
        inputs = processor(images=image, return_tensors="pt")
        
        # Move input tensors to device
        for k, v in inputs.items():
            inputs[k] = v.to(device)
            
        output = model.generate(**inputs)
        caption = processor.decode(output[0], skip_special_tokens=True)
        return caption, None
    except Exception as e:
        return None, f"Errore nell'elaborazione dell'immagine: {str(e)}"

@router.post("/describe-upload", response_model=ImageToTextResponse)
async def describe_uploaded_image(image_file: UploadFile = File(...)):
    """
    Riceve un'immagine caricata dall'utente e ne genera una descrizione testuale.
    
    Args:
        image_file (UploadFile): Il file immagine caricato dall'utente.
    
    Returns:
        ImageToTextResponse: Un oggetto contenente la descrizione dell'immagine o un messaggio di errore.
    """
    # Controlla se il formato del file è supportato
    supported_formats = ['.jpg', '.jpeg', '.png', '.webp', '.bmp']
    file_ext = os.path.splitext(image_file.filename)[1].lower()
    
    if file_ext not in supported_formats:
        return ImageToTextResponse(
            caption="", 
            error=f"Formato file non supportato. Formati supportati: {', '.join(supported_formats)}"
        )
    
    if not processor or not model:
        return ImageToTextResponse(
            caption="", 
            error="Modello non caricato correttamente. Controlla i log del server."
        )
    
    try:
        # Salva temporaneamente il file immagine caricato
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            temp_file_path = temp_file.name
            image_content = await image_file.read()
            temp_file.write(image_content)
        
        print(f"Elaborazione dell'immagine caricata: {image_file.filename}")
        # Genera la descrizione
        caption, error = describe_image(temp_file_path)
        
        # Rimuovi il file temporaneo
        os.unlink(temp_file_path)
        
        if error:
            return ImageToTextResponse(caption="", error=error)
        
        return ImageToTextResponse(caption=caption)
        
    except Exception as e:
        # Assicurati di pulire anche in caso di errore
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        
        return ImageToTextResponse(
            caption="", 
            error=f"Errore durante l'elaborazione: {str(e)}"
        )

@router.post("/describe", response_model=ImageToTextResponse)
async def describe_base64_image(request: ImageBase64Request):
    """
    Riceve un'immagine in formato base64 e ne genera una descrizione testuale.
    
    Args:
        request: Richiesta contenente l'immagine in formato base64.
    
    Returns:
        ImageToTextResponse: Un oggetto contenente la descrizione dell'immagine o un messaggio di errore.
    """
    try:
        print("Ricevuta immagine base64 per elaborazione")
        
        if not processor or not model:
            return ImageToTextResponse(
                caption="", 
                error="Modello non caricato correttamente. Controlla i log del server."
            )
        
        # Decodifica l'immagine base64
        try:
            image_bytes = base64.b64decode(request.image_base64)
            print(f"Immagine base64 decodificata, dimensione: {len(image_bytes)} bytes")
            
            # Salva temporaneamente i dati come file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                temp_file_path = temp_file.name
                temp_file.write(image_bytes)
            
            print(f"Elaborazione immagine da file temporaneo: {temp_file_path}")
            
            # Genera la descrizione
            caption, error = describe_image(temp_file_path)
            
            # Pulisci il file temporaneo
            try:
                os.unlink(temp_file_path)
                print(f"File temporaneo rimosso: {temp_file_path}")
            except Exception as clean_error:
                print(f"Errore nella pulizia del file temporaneo: {str(clean_error)}")
            
            if error:
                return ImageToTextResponse(caption="", error=error)
            
            return ImageToTextResponse(caption=caption)
            
        except Exception as decode_error:
            return ImageToTextResponse(
                caption="", 
                error=f"Errore nella decodifica o elaborazione dell'immagine base64: {str(decode_error)}"
            )
            
    except Exception as e:
        return ImageToTextResponse(
            caption="", 
            error=f"Errore durante l'elaborazione: {str(e)}"
        ) 