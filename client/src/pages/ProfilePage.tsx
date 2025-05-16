import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import AppHeader from '@/components/AppHeader';
import { User } from '@/lib/types';
import { logoutUser } from '@/lib/auth';

const ProfilePage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // In a real app, this would come from context or a query
  const [user, setUser] = useState<User>({
    id: 2,
    username: 'mario',
    email: 'mario.rossi@example.com',
    fullName: 'Mario Rossi',
    phone: '+39 123 456 7890',
    address: 'Via Roma 123, Milano, IT',
    bloodType: 'B+',
    isAdmin: false
  });
  
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    bloodType: user.bloodType || 'A+',
    allergies: '',
    medicalConditions: '',
    emergencyContact: '',
    notifications: true,
    offlineMode: true,
    locationTracking: true
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedUser: Partial<User>) => {
      // In a real app, this would call an API endpoint
      // For now, we'll just simulate a delay
      return new Promise<User>((resolve) => {
        setTimeout(() => {
          resolve({ ...user, ...updatedUser });
        }, 500);
      });
    },
    onSuccess: (data) => {
      setUser(data);
      toast({
        title: "Profilo aggiornato",
        description: "Le modifiche al profilo sono state salvate con successo.",
        variant: "success"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio del profilo.",
        variant: "destructive"
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleToggleChange = (name: string) => {
    setFormData({
      ...formData,
      [name]: !formData[name as keyof typeof formData]
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      bloodType: formData.bloodType,
      allergies: formData.allergies,
      medicalConditions: formData.medicalConditions,
      emergencyContact: formData.emergencyContact
    });
  };
  
  const handleLogout = () => {
    logoutUser();
    toast({
      title: "Logout effettuato",
      description: "Hai effettuato il logout con successo.",
      variant: "default"
    });
    setLocation('/login');
  };
  
  return (
    <div className="px-4 py-6 pb-20">
      <AppHeader title="Profilo" />
      
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
            <span className="material-icons text-3xl text-gray-500">person</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-bold mb-4">Informazioni Personali</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  name="fullName"
                  className="w-full border border-gray-300 rounded-lg p-3" 
                  value={formData.fullName} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full border border-gray-300 rounded-lg p-3" 
                  value={formData.email} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Telefono</label>
                <input 
                  type="tel" 
                  name="phone"
                  className="w-full border border-gray-300 rounded-lg p-3" 
                  value={formData.phone} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Indirizzo</label>
                <input 
                  type="text" 
                  name="address"
                  className="w-full border border-gray-300 rounded-lg p-3" 
                  value={formData.address} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-bold mb-4">Informazioni Mediche</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Gruppo Sanguigno</label>
                <select 
                  name="bloodType"
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="0+">0+</option>
                  <option value="0-">0-</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Allergie</label>
                <input 
                  type="text" 
                  name="allergies"
                  className="w-full border border-gray-300 rounded-lg p-3" 
                  placeholder="Aggiungi allergie..." 
                  value={formData.allergies}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Condizioni Mediche</label>
                <textarea 
                  name="medicalConditions"
                  className="w-full border border-gray-300 rounded-lg p-3" 
                  rows={2} 
                  placeholder="Aggiungi condizioni mediche..."
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contatto di Emergenza</label>
                <input 
                  type="text" 
                  name="emergencyContact"
                  className="w-full border border-gray-300 rounded-lg p-3" 
                  placeholder="Nome e numero di telefono..." 
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold mb-4">Preferenze App</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifiche Push</p>
                  <p className="text-sm text-gray-500">Ricevi avvisi importanti</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.notifications}
                    onChange={() => handleToggleChange('notifications')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Modalità Offline</p>
                  <p className="text-sm text-gray-500">Salva guide per uso offline</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.offlineMode}
                    onChange={() => handleToggleChange('offlineMode')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Posizione in Background</p>
                  <p className="text-sm text-gray-500">Consenti accesso alla posizione</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.locationTracking}
                    onChange={() => handleToggleChange('locationTracking')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical"></div>
                </label>
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="w-full bg-medical text-white font-bold py-3 px-6 rounded-xl text-base flex items-center justify-center shadow-md mb-4 disabled:opacity-70"
          >
            {updateProfileMutation.isPending ? (
              <span className="animate-spin mr-2">◌</span>
            ) : (
              <span className="material-icons mr-2">save</span>
            )}
            Salva Modifiche
          </button>
          
          <button 
            type="button" 
            onClick={handleLogout}
            className="w-full bg-gray-200 text-dark font-bold py-3 px-6 rounded-xl text-base flex items-center justify-center"
          >
            <span className="material-icons mr-2">logout</span>
            Logout
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
