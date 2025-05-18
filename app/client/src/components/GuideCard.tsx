import { Guide } from '@/lib/types';

interface GuideCardProps {
  guide: Guide;
  onClick?: () => void;
}

const GuideCard = ({ guide, onClick }: GuideCardProps) => {
  return (
    <div className="flex-shrink-0 w-44 bg-white rounded-xl shadow-md overflow-hidden" onClick={onClick}>
      {guide.imageUrl && (
        <img src={guide.imageUrl} alt={guide.title} className="w-full h-24 object-cover" />
      )}
      {!guide.imageUrl && (
        <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
          <span className="material-icons text-medical text-3xl">healing</span>
        </div>
      )}
      <div className="p-3">
        <div className="flex items-center text-xs text-success mb-1">
          <span className="material-icons text-xs mr-1">download_done</span>
          Disponibile offline
        </div>
        <h3 className="font-bold">{guide.title.length > 20 ? `${guide.title.substring(0, 20)}...` : guide.title}</h3>
        <p className="text-sm text-gray-600 truncate">{guide.content.description}</p>
      </div>
    </div>
  );
};

export default GuideCard;
