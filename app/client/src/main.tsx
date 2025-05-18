import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Render the application
createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for offline functionality if supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service worker registered:', registration);
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
  });
}
