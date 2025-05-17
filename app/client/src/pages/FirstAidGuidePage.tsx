import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAppContext } from '@/context/AppContext';
import AppHeader from '@/components/AppHeader';
import { guideCategories, mockGuides } from '@/lib/mocks';
import { Guide } from '@/lib/types';

const FirstAidGuidePage = () => {
  const [, navigate] = useLocation();
  const { state } = useAppContext();
  const { isOffline } = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // In offline mode, use cached guides
  const { data: guides, isLoading } = useQuery<Guide[]>({
    queryKey: ['/api/guides', selectedCategory],
    enabled: !isOffline,
    initialData: isOffline ? mockGuides : undefined
  });

  const filteredGuides = mockGuides?.filter(guide => {
  // const filteredGuides = guides?.filter(guide => {
    const matchesSearch = searchQuery === '' || 
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.content.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || guide.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleGuideClick = (guideId: number) => {
    navigate(`/guides/${guideId}`);
  };

  return (
    <div className="px-4 py-6 pb-20">
      <AppHeader title="Guide di Primo Soccorso" />
      
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex items-center text-xs text-success mb-4">
          <span className="material-icons text-xs mr-1">download_done</span>
          Tutte le guide sono disponibili offline
        </div>
        
        {/* Search Box */}
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Cerca guida..." 
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
        </div>
        
        <h2 className="text-xl font-bold mb-4">Categorie</h2>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {guideCategories.map((category) => (
            <button 
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`${selectedCategory === category.name ? 'bg-gray-200' : 'bg-gray-100'} hover:bg-gray-200 text-dark rounded-xl py-3 px-4 flex flex-col items-center`}
            >
              <span className="material-icons text-medical mb-2">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>
        
        <h2 className="text-xl font-bold mb-4">Guide Popolari</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-gray-50 rounded-xl p-4 h-20"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGuides && filteredGuides.length > 0 ? (
              filteredGuides.map((guide) => (
                <a 
                  key={guide.id} 
                  onClick={() => handleGuideClick(guide.id)} 
                  className="block bg-gray-50 hover:bg-gray-100 rounded-xl p-4 cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="bg-medical rounded-lg p-2 mr-4">
                      <span className="material-icons text-white">
                        {guide.category === 'Emergenze Cardiache' ? 'favorite' :
                         guide.category === 'Ferite e Traumi' ? 'healing' :
                         guide.category === 'Soffocamento' ? 'sentiment_very_dissatisfied' : 'thermostat'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold">{guide.title}</h3>
                      <p className="text-sm text-gray-600">{guide.content.description}</p>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">Nessuna guida trovata</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstAidGuidePage;
