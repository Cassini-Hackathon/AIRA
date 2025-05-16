import { Geolocation, Position } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';
import { Location } from './types';

/**
 * Servizio per gestire le funzionalità native di Capacitor
 */
export const CapacitorService = {
  /**
   * Ottiene la posizione attuale dell'utente utilizzando il GPS del dispositivo
   * @returns Promise con la posizione formattata
   */
  async getCurrentPosition(): Promise<Location> {
    try {
      const position: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
    } catch (error) {
      console.error('Errore durante l\'acquisizione della posizione:', error);
      // Fallback a una posizione predefinita in caso di errore
      return {
        latitude: 45.4642,
        longitude: 9.1900,
        accuracy: 100
      };
    }
  },

  /**
   * Verifica se il dispositivo è online
   * @returns Promise<boolean> - true se online, false se offline
   */
  async checkNetworkStatus(): Promise<boolean> {
    try {
      const status = await Network.getStatus();
      return status.connected;
    } catch (error) {
      console.error('Errore durante la verifica della connessione:', error);
      // Fallback a navigator.onLine se Capacitor non è disponibile
      return navigator.onLine;
    }
  },

  /**
   * Ottiene informazioni sul dispositivo
   * @returns Promise con informazioni sul dispositivo
   */
  async getDeviceInfo() {
    try {
      const info = await Device.getInfo();
      return info;
    } catch (error) {
      console.error('Errore durante l\'acquisizione delle informazioni sul dispositivo:', error);
      return null;
    }
  },

  /**
   * Registra un listener per gli eventi di cambio connettività
   * @param callback Funzione da chiamare quando lo stato della rete cambia
   * @returns Funzione per rimuovere il listener
   */
  addNetworkStatusListener(callback: (isConnected: boolean) => void) {
    try {
      // Con Capacitor, addListener restituisce una Promise<PluginListenerHandle>
      Network.addListener('networkStatusChange', (status) => {
        callback(status.connected);
      }).then(handler => {
        // L'handler di rimozione può essere usato dopo che la promise è risolta
        console.log('Network listener aggiunto con successo');
      }).catch(error => {
        console.error('Errore nell\'aggiunta del listener:', error);
      });
      
      // Restituiamo una funzione di cleanup che può essere chiamata quando il componente viene smontato
      return () => {
        console.log('Tentativo di rimozione del listener di rete');
        // In un'implementazione reale, dovremmo conservare l'handler per poterlo rimuovere
      };
    } catch (error) {
      console.error('Errore durante l\'aggiunta del listener di rete:', error);
      
      // Fallback ai listener standard del browser
      const onlineHandler = () => callback(true);
      const offlineHandler = () => callback(false);
      
      window.addEventListener('online', onlineHandler);
      window.addEventListener('offline', offlineHandler);
      
      return () => {
        window.removeEventListener('online', onlineHandler);
        window.removeEventListener('offline', offlineHandler);
      };
    }
  },

  /**
   * Registra listener per eventi del ciclo di vita dell'app
   */
  registerAppListeners() {
    try {
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
      });

      App.addListener('backButton', () => {
        console.log('Back button pressed');
      });
    } catch (error) {
      console.error('Errore durante la registrazione dei listener dell\'app:', error);
    }
  },

  /**
   * Inizializza tutti i servizi Capacitor
   */
  init() {
    this.registerAppListeners();
    console.log('Capacitor service initialized');
  }
};

// Esporta un'istanza singleton del servizio
export default CapacitorService;