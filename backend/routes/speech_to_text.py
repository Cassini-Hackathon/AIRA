import os
import sys
import tempfile
import base64
from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Body
from pydantic import BaseModel
from typing import Optional
import io
import numpy as np
from fastapi import Request
import json

# Aggiungi la directory dei modelli al path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../ai_models/src')))

# Importa le funzioni necessarie dal modello di speech-to-text
import whisper
import torch

router = APIRouter(
    prefix="/speech-to-text",
    tags=["speech-to-text"],
    responses={404: {"description": "Not found"}},
)

def load_model():
    """Carica il modello Whisper nella versione 'tiny' utilizzando la GPU."""
    try:
        device = "cuda" if torch.cuda.is_available() else "cpu"
        if device == "cuda":
            print(f"Caricamento del modello Whisper 'tiny' su GPU: {torch.cuda.get_device_name(0)}")
            torch.cuda.empty_cache()  # Libera memoria GPU non utilizzata
        else:
            print("GPU non disponibile. Caricamento del modello su CPU...")
        
        model = whisper.load_model("tiny", device=device)
        print(f"Modello caricato con successo su {device.upper()}!")
        return model
    except Exception as e:
        print(f"Errore nel caricamento del modello: {str(e)}")
        return None

# Carica il modello all'avvio del server
model = load_model()

class TranscriptionResponse(BaseModel):
    text: str
    error: Optional[str] = None

class TranscriptionRequest(BaseModel):
    file_base64: str

@router.get("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(file_path: Optional[str] = None, file_base64: Optional[str] = None):
    """
    Trascrive un file audio.
    
    Args:
        file_path (str, optional): Percorso del file audio da trascrivere.
            Se non specificato, viene utilizzato un file predefinito.
        file_base64 (str, optional): Contenuto del file audio codificato in base64.
            Se specificato, ha precedenza su file_path.
    
    Returns:
        TranscriptionResponse: Un oggetto contenente la trascrizione del testo o un messaggio di errore.
    """
    temp_file_path = None
    
    try:
        if file_base64:
            print("Elaborazione file base64...")
            # Decodifica il file base64 e salvalo come file temporaneo
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
                    temp_file_path = temp_file.name
                    audio_content = base64.b64decode(file_base64)
                    temp_file.write(audio_content)
                
                file_path = temp_file_path
                print(f"File base64 salvato temporaneamente in: {file_path}")
            except Exception as decode_error:
                return TranscriptionResponse(
                    text="", 
                    error=f"Errore nella decodifica del file base64: {str(decode_error)}"
                )
        elif file_path is None:
            # Usando un file predefinito se non viene fornito un percorso
            # Questo è il percorso hardcoded che viene usato come fallback
            file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../ai_models/audio/prova.mp3'))
            print(f"Utilizzo file predefinito: {file_path}")
        
        # Verifica che il percorso esista
        if not os.path.exists(file_path):
            return TranscriptionResponse(
                text="", 
                error=f"File non trovato: {file_path}"
            )
        
        if not model:
            return TranscriptionResponse(
                text="", 
                error="Modello non caricato correttamente. Controlla i log del server."
            )
        
        print(f"Trascrizione di: {file_path}")
        # Trascrivi l'audio
        result = model.transcribe(
            file_path,
            fp16=torch.cuda.is_available(),
            beam_size=5
        )
        
        return TranscriptionResponse(text=result["text"])
        
    except Exception as e:
        return TranscriptionResponse(
            text="", 
            error=f"Errore durante la trascrizione: {str(e)}"
        )
    finally:
        # Pulisci il file temporaneo se esiste
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
                print(f"File temporaneo rimosso: {temp_file_path}")
            except Exception as clean_error:
                print(f"Errore nella pulizia del file temporaneo: {str(clean_error)}")
                pass

@router.post("/transcribe-upload", response_model=TranscriptionResponse)
async def transcribe_uploaded_audio(audio_file: UploadFile = File(...)):
    """
    Riceve un file audio caricato dall'utente e lo trascrive.
    
    Args:
        audio_file (UploadFile): Il file audio caricato dall'utente.
    
    Returns:
        TranscriptionResponse: Un oggetto contenente la trascrizione del testo o un messaggio di errore.
    """
    # Controlla se il formato del file è supportato
    supported_formats = ['.mp3', '.wav', '.m4a', '.ogg', '.flac']
    file_ext = os.path.splitext(audio_file.filename)[1].lower()
    
    if file_ext not in supported_formats:
        return TranscriptionResponse(
            text="", 
            error=f"Formato file non supportato. Formati supportati: {', '.join(supported_formats)}"
        )
    
    if not model:
        return TranscriptionResponse(
            text="", 
            error="Modello non caricato correttamente. Controlla i log del server."
        )
    
    try:
        # Salva temporaneamente il file audio caricato
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            temp_file_path = temp_file.name
            audio_content = await audio_file.read()
            temp_file.write(audio_content)
        
        print(f"Trascrizione del file caricato: {audio_file.filename}")
        # Trascrivi l'audio
        result = model.transcribe(
            temp_file_path,
            fp16=torch.cuda.is_available(),
            beam_size=5
        )
        
        # Rimuovi il file temporaneo
        os.unlink(temp_file_path)
        
        return TranscriptionResponse(text=result["text"])
        
    except Exception as e:
        # Assicurati di pulire anche in caso di errore
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        
        return TranscriptionResponse(
            text="", 
            error=f"Errore durante la trascrizione: {str(e)}"
        )

@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio_base64(request: TranscriptionRequest):
    """
    Trascrive un file audio inviato come base64.
    
    Args:
        request: Richiesta contenente il file audio in formato base64.
    
    Returns:
        TranscriptionResponse: Un oggetto contenente la trascrizione del testo o un messaggio di errore.
    """
    try:
        print("Ricevuto file base64 per trascrizione diretta")
        
        if not model:
            return TranscriptionResponse(
                text="", 
                error="Modello non caricato correttamente. Controlla i log del server."
            )
        
        # Decodifica il file base64
        try:
            audio_bytes = base64.b64decode(request.file_base64)
            print(f"File base64 decodificato, dimensione: {len(audio_bytes)} bytes")
            
            # Salva temporaneamente i dati come file (necessario per Whisper)
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
                temp_file_path = temp_file.name
                temp_file.write(audio_bytes)
            
            print(f"Trascrizione diretta da file temporaneo: {temp_file_path}")
            
            # Trascrivi l'audio usando il modello
            result = model.transcribe(
                temp_file_path,
                fp16=torch.cuda.is_available(),
                beam_size=5
            )
            
            # Pulisci il file temporaneo
            try:
                os.unlink(temp_file_path)
                print(f"File temporaneo rimosso: {temp_file_path}")
            except Exception as clean_error:
                print(f"Errore nella pulizia del file temporaneo: {str(clean_error)}")
            
            return TranscriptionResponse(text=result["text"])
            
        except Exception as decode_error:
            return TranscriptionResponse(
                text="", 
                error=f"Errore nella decodifica o elaborazione del file base64: {str(decode_error)}"
            )
            
    except Exception as e:
        return TranscriptionResponse(
            text="", 
            error=f"Errore durante la trascrizione: {str(e)}"
        ) 