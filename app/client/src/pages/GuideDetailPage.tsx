import { useQuery } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { useAppContext } from '@/context/AppContext';
import AppHeader from '@/components/AppHeader';
import { mockGuides } from '@/lib/mocks';
import { Guide } from '@/lib/types';

const GuideDetailPage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute<{ id: string }>('/guides/:id');
  const { state } = useAppContext();
  const { isOffline } = state;
  
  const guideId = params?.id ? parseInt(params.id) : 0;

  // In offline mode, use cached guides
  const offlineGuide = mockGuides.find(g => g.id === guideId);
  
  const { data: guide, isLoading, error } = useQuery<Guide>({
    queryKey: [`/api/guides/${guideId}`],
    enabled: !isOffline && guideId > 0,
    initialData: isOffline ? offlineGuide : undefined
  });

  if (!match) {
    return <div>Guide not found</div>;
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <AppHeader title="Caricamento..." showBackButton onBack={() => setLocation('/guides')} />
        <div className="flex items-center justify-center h-64">
          <p>Caricamento guida...</p>
        </div>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="px-4 py-6">
        <AppHeader title="Errore" showBackButton onBack={() => setLocation('/guides')} />
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <p className="text-error">Si è verificato un errore nel caricamento della guida.</p>
          <button 
            onClick={() => setLocation('/guides')}
            className="mt-4 bg-medical text-white font-medium py-2 px-4 rounded-lg"
          >
            Torna alle guide
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-20">
      <AppHeader title={guide.title} showBackButton onBack={() => setLocation('/guides')} showProfile={false} showWeather={false} />
      
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        {/* Video Tutorial Placeholder */}
        {guide.videoUrl && (
          <div className="rounded-xl bg-gray-200 mb-4 overflow-hidden">
            <img src={guide.videoUrl} alt={`Video tutorial ${guide.title}`} className="w-full h-auto" />
            <div className="p-3 bg-gray-800 text-white flex items-center justify-center">
              <span className="material-icons mr-2">play_circle</span>
              Video tutorial disponibile offline
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-xs text-success">
            <span className="material-icons text-xs mr-1">download_done</span>
            Disponibile offline
          </div>
          <button className="text-medical flex items-center text-sm">
            <span className="material-icons text-sm mr-1">share</span>
            Condividi
          </button>
        </div>
        
        <h2 className="text-xl font-bold mb-4">{guide.content.description}</h2>
        
        <div className="space-y-4 mb-6">
          {guide.content.steps.map((step, index) => (
            <div key={index} className="flex">
              <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center font-bold text-medical mr-3 flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div>
                <h3 className="font-bold mb-1">{step.title}</h3>
                <p className="text-sm text-gray-700">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Important Note */}
        {guide.content.notes && guide.content.notes.length > 0 && guide.content.notes.map((note, index) => (
          <div key={index} className="bg-warning/20 border border-warning rounded-lg p-3 flex items-start mb-6">
            <span className="material-icons text-warning mr-2 mt-0.5">warning</span>
            <div>
              <p className="font-medium">{note.title}</p>
              <p className="text-sm">{note.description}</p>
            </div>
          </div>
        ))}
        
        {/* Step Illustration */}
        {guide.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-6">
            <img src={guide.imageUrl} alt={`Illustrazione ${guide.title}`} className="w-full h-auto" />
          </div>
        )}
        
        {/* DAE Steps if available */}
        {guide.content.daeSteps && guide.content.daeSteps.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-4">Utilizzo del DAE (Defibrillatore)</h2>
            
            <div className="space-y-4">
              {guide.content.daeSteps.map((step, index) => (
                <div key={index} className="flex">
                  <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center font-bold text-medical mr-3 flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-700">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GuideDetailPage;
