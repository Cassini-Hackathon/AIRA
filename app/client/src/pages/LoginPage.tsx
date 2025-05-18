import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { loginUser, saveUserToStorage } from '@/lib/auth';
import { User } from '@/lib/types';

const LoginPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  const loginMutation = useMutation({
    mutationFn: async (): Promise<User> => {
      // For demo purposes, we'll accept any credentials
      // In a real app, we would validate these credentials
      return loginUser('mario', 'password123');
    },
    onSuccess: (user) => {
      saveUserToStorage(user);
      toast({
        title: "Login effettuato",
        description: `Benvenuto, ${user.fullName || user.username}!`,
        variant: "success"
      });
      setLocation('/');
    },
    onError: (error) => {
      toast({
        title: "Errore di login",
        description: `${error instanceof Error ? error.message : 'Si è verificato un errore durante il login'}`,
        variant: "destructive"
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };
  
  const handleContinueAsGuest = () => {
    toast({
      title: "Accesso come ospite",
      description: "Hai accesso limitato alle funzionalità. Registrati per un'esperienza completa.",
      variant: "default"
    });
    setLocation('/');
  };
  
  return (
    <div className="px-4 py-6">
      <div className="flex justify-center mb-10 pt-10">
        <div className="flex items-center">
          <span className="text-emergency font-bold text-3xl">AIRA</span>
          <span className="text-medical font-bold text-3xl">+</span>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-6">Accesso</h1>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              className="w-full border border-gray-300 rounded-lg p-3" 
              placeholder="Inserisci la tua email" 
              value={credentials.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              className="w-full border border-gray-300 rounded-lg p-3" 
              placeholder="Inserisci la tua password" 
              value={credentials.password}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-medical text-white font-bold py-3 px-6 rounded-xl text-base flex items-center justify-center shadow-md mb-4 disabled:opacity-70"
          >
            {loginMutation.isPending ? (
              <span className="animate-spin mr-2">◌</span>
            ) : (
              <span className="material-icons mr-2">login</span>
            )}
            Accedi
          </button>
          
          <p className="text-center text-sm">
            <a href="#" className="text-medical">Password dimenticata?</a>
          </p>
        </form>
      </div>
      
      <div className="text-center">
        <p className="mb-4">Oppure</p>
        
        <button className="w-full bg-white text-dark font-medium py-3 px-6 rounded-xl text-base flex items-center justify-center shadow-md mb-4 border border-gray-300">
          <span className="material-icons mr-2">person_add</span>
          Registrati
        </button>
        
        <button 
          onClick={handleContinueAsGuest}
          className="w-full bg-gray-200 text-dark font-medium py-3 px-6 rounded-xl text-base flex items-center justify-center"
        >
          <span className="material-icons mr-2">public</span>
          Continua come Ospite
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
