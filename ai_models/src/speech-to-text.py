import whisper
import argparse
import os
import time
import torch
import json
from datetime import datetime

# Percorso del file MP3 da trascrivere
MP3_FILE_PATH = "audio/prova.mp3"  # Modifica con il nome del tuo file MP3
# Cartella di output per i risultati JSON
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

def load_model():
    """Carica il modello Whisper nella versione 'tiny' utilizzando la GPU."""
    try:
        device = "cuda" if torch.cuda.is_available() else "cpu"
        if device == "cuda":
            torch.cuda.empty_cache()  # Libera memoria GPU non utilizzata
        
        model = whisper.load_model("tiny", device=device)
        return model
    except Exception as e:
        return None

def transcribe_audio(model, file_path, beam_size=5):
    """Trascrive l'audio usando il modello Whisper."""
    try:
        # Utilizzo FP16 per prestazioni migliori su GPU
        result = model.transcribe(
            file_path,
            fp16=torch.cuda.is_available(),
            beam_size=beam_size  # Utilizziamo beam_size invece di batch_size
        )
        return result["text"]
    except Exception as e:
        return f"Errore durante la trascrizione: {str(e)}"

def save_to_json(transcription, file_path, elapsed_time, output_dir=OUTPUT_DIR):
    """Salva i risultati della trascrizione in un file JSON."""
    # Assicurati che la directory di output esista
    os.makedirs(output_dir, exist_ok=True)
    
    # Genera un nome file basato sul nome del file audio e timestamp
    audio_filename = os.path.basename(file_path)
    base_name = os.path.splitext(audio_filename)[0]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"{base_name}_{timestamp}.json"
    output_path = os.path.join(output_dir, output_filename)
    
    # Crea il dizionario con i dati da salvare
    result = {
        "audio_file": file_path,
        "transcription": transcription,
        "processing_time_seconds": round(elapsed_time, 2),
        "timestamp": datetime.now().isoformat()
    }
    
    # Salva il file JSON
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    return output_path

def main():
    parser = argparse.ArgumentParser(description='Trascrizione file audio usando openai-whisper (modello tiny)')
    parser.add_argument('--file', type=str, default=MP3_FILE_PATH, 
                       help=f'Path del file audio da trascrivere (default: {MP3_FILE_PATH})')
    parser.add_argument('--beam_size', type=int, default=5,
                       help='Dimensione del beam per la trascrizione (default: 5)')
    parser.add_argument('--output', type=str, default=OUTPUT_DIR,
                       help=f'Directory per salvare il file JSON (default: {OUTPUT_DIR})')
    args = parser.parse_args()
    
    file_path = args.file
    beam_size = args.beam_size
    output_dir = args.output
    
    # Verifica che il file esista
    if not os.path.exists(file_path):
        return
    
    # Carica il modello Whisper
    model = load_model()
    if not model:
        return
    
    # Esegui la trascrizione
    start_time = time.time()
    transcription = transcribe_audio(model, file_path, beam_size)
    elapsed_time = time.time() - start_time
    
    # Salva i risultati in un file JSON
    json_path = save_to_json(transcription, file_path, elapsed_time, output_dir)

if __name__ == "__main__":
    main()