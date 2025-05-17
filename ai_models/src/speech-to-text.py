import whisper
import argparse
import os
import time
import torch

# Percorso del file MP3 da trascrivere
MP3_FILE_PATH = "prova.mp3"  # Modifica con il nome del tuo file MP3

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

def transcribe_audio(model, file_path, beam_size=5):
    """Trascrive l'audio usando il modello Whisper."""
    try:
        print("Inizio trascrizione...")
        # Utilizzo FP16 per prestazioni migliori su GPU
        result = model.transcribe(
            file_path,
            fp16=torch.cuda.is_available(),
            beam_size=beam_size  # Utilizziamo beam_size invece di batch_size
        )
        return result["text"]
    except Exception as e:
        return f"Errore durante la trascrizione: {str(e)}"

def main():
    parser = argparse.ArgumentParser(description='Trascrizione file audio usando openai-whisper (modello tiny)')
    parser.add_argument('--file', type=str, default=MP3_FILE_PATH, 
                       help=f'Path del file audio da trascrivere (default: {MP3_FILE_PATH})')
    parser.add_argument('--beam_size', type=int, default=5,
                       help='Dimensione del beam per la trascrizione (default: 5)')
    args = parser.parse_args()
    
    file_path = args.file
    beam_size = args.beam_size
    
    # Stampa informazioni sulla GPU
    if torch.cuda.is_available():
        print(f"GPU rilevata: {torch.cuda.get_device_name(0)}")
        print(f"Memoria totale GPU: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
        print(f"Memoria disponibile: {torch.cuda.memory_reserved(0) / 1024**3:.2f} GB riservata")
    else:
        print("Nessuna GPU CUDA rilevata. Verrà utilizzata la CPU.")
    
    # Verifica che il file esista
    if not os.path.exists(file_path):
        print(f"Errore: Il file {file_path} non esiste.")
        return
    
    # Verifica che sia un file audio supportato
    valid_extensions = ['.mp3', '.wav', '.m4a', '.ogg']
    if not any(file_path.lower().endswith(ext) for ext in valid_extensions):
        print(f"Errore: Il formato del file potrebbe non essere supportato. Formati supportati: {', '.join(valid_extensions)}")
        print("Il programma tenterà comunque la trascrizione...")
    
    print(f"Elaborazione del file audio: {file_path}")
    
    # Carica il modello Whisper su GPU
    model = load_model()
    if not model:
        print("Errore nel caricamento del modello. Impossibile procedere.")
        return
    
    # Invia il file per la trascrizione
    start_time = time.time()
    transcription = transcribe_audio(model, file_path, beam_size)
    elapsed_time = time.time() - start_time
    
    print("\n--- Risultato della trascrizione ---")
    print(transcription)
    print(f"\nElaborazione completata in {elapsed_time:.2f} secondi")
    
    # Mostra velocità di elaborazione
    print(f"Velocità di elaborazione: {elapsed_time:.2f} secondi")
    if hasattr(model, 'dims'):
        print(f"Modello utilizzato: whisper-tiny ({model.dims.n_text_state} parametri)")

if __name__ == "__main__":
    main()