import React, { useState } from 'react';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pause, Play, Mic, StopCircle } from 'lucide-react';

interface AudioRecorderProps {
  onAudioRecorded: (audio: { blob: Blob; url: string; mimeType: string }) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioRecorded }) => {
  const [recording, setRecording] = useState(false);
  const [permission, setPermission] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const requestPermission = async () => {
    const { value } = await VoiceRecorder.requestAudioRecordingPermission();
    setPermission(value);
  };

  const startRecording = async () => {
    if (!permission) await requestPermission();
    await VoiceRecorder.startRecording();
    setRecording(true);
    setAudioReady(false);
  };

  const stopRecording = async () => {
    const result = await VoiceRecorder.stopRecording();
    setRecording(false);
    setAudioReady(true);

    if (result.value?.recordDataBase64) {
      const base64 = result.value.recordDataBase64;

      // Convert base64 → AAC Blob → simulate MP3
      const aacBlob = base64ToBlob(base64, 'audio/aac');
      const mp3Blob = new Blob([aacBlob], { type: 'audio/mpeg' }); // "finto" MP3
      const url = URL.createObjectURL(mp3Blob);

      setAudioUrl(url);
      onAudioRecorded({ blob: mp3Blob, url, mimeType: 'audio/mpeg' });
    }
  };

  const base64ToBlob = (base64: string, mime: string): Blob => {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mime });
  };

  const togglePlayback = () => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    if (!playing) {
      audio.play();
      setPlaying(true);
      audio.onended = () => setPlaying(false);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <Card className="p-6 rounded-2xl shadow-lg bg-white space-y-4 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center">🎙️ Registra Audio</h2>
      <div className="flex justify-center gap-4">
        {!recording && (
          <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600 text-white">
            <Mic className="mr-2" /> Inizia
          </Button>
        )}
        {recording && (
          <Button onClick={stopRecording} className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <StopCircle className="mr-2" /> Ferma
          </Button>
        )}
      </div>

      {audioReady && (
        <div className="text-center">
          <Button onClick={togglePlayback} variant="secondary">
            {playing ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {playing ? 'Pausa' : 'Riproduci'}
          </Button>
        </div>
      )}
    </Card>
  );
};
