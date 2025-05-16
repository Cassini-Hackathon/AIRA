import { useAppContext } from '@/context/AppContext';

const NetworkStatus = () => {
  const { state } = useAppContext();
  const { isOffline } = state;

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-warning text-dark py-1 px-4 text-center text-sm">
      <span className="material-icons align-text-bottom text-sm mr-1">wifi_off</span>
      Modalità offline - Funzionalità limitate
    </div>
  );
};

export default NetworkStatus;
