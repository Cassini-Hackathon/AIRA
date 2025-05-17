import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageOff } from 'lucide-react';
import clsx from 'clsx';

type CameraCaptureProps = {
  onPhotoTaken?: (photo: string | undefined) => void;
};

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoTaken }) => {
  const [photo, setPhoto] = useState<string>();
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    try {
      setLoading(true);
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      setPhoto(image.dataUrl);
      onPhotoTaken?.(image.dataUrl);
    } catch (error) {
      console.error('Errore nello scattare la foto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <div
        onClick={takePhoto}
        className={clsx(
          'relative w-72 h-72 rounded-2xl border-2 border-dashed border-gray-400 flex items-center justify-center overflow-hidden cursor-pointer transition hover:shadow-xl',
          loading && 'opacity-50 pointer-events-none'
        )}
      >
        {!photo ? (
          <div className="flex flex-col items-center text-gray-500">
            <ImageOff className="w-16 h-16 mb-2" />
            <span className="text-center text-sm">Clicca per scattare una foto</span>
          </div>
        ) : (
          <img
            src={photo}
            alt="Foto scattata"
            className="w-full h-full object-cover"
          />
        )}

        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-black text-sm font-medium">
            Caricamento...
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
