import { useEffect, useState } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { queryClient } from "@/lib/queryClient";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@/lib/types";

// Import components
import NetworkStatus from "@/components/NetworkStatus";
import BottomNavigation from "@/components/BottomNavigation";

// Import pages
import HomePage from "@/pages/HomePage";
import DroneKitPage from "@/pages/DroneKitPage";
import FirstAidGuidePage from "@/pages/FirstAidGuidePage";
import GuideDetailPage from "@/pages/GuideDetailPage";
import WeatherPage from "@/pages/WeatherPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminPanelPage from "@/pages/AdminPanelPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/not-found";
import EmergencyRequestPage from "./pages/EmergencyRequestPage";
import GeoMapScreen from "./pages/EmergencyCoordinationScreen";
import EmergencyCoordinationScreen from "./pages/EmergencyCoordinationScreen";
import MapsPage from "./pages/MapsPage";
import AdminPanelPage2 from "./pages/AdminPanelPage2";
import EmeCoord2 from "./pages/EmeCoord2";

function Router() {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error initializing user:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeUser();
  }, []);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        Caricamento...
      </div>
    );
  }

  // Route definitions
  return (
    <div className="flex flex-col h-screen">
      <NetworkStatus />

      <main className="flex-1 overflow-y-auto pb-16">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/emergency" component={EmergencyRequestPage} />
          <Route
            path="/emergency-coordination"
            component={EmergencyCoordinationScreen}
          />
          <Route path="/eme-cord-2" component={EmeCoord2} />
          <Route path="/geo-map" component={GeoMapScreen} />
          <Route path="/drone-kit" component={DroneKitPage} />
          <Route path="/guides" component={FirstAidGuidePage} />
          <Route path="/guides/:id" component={GuideDetailPage} />
          <Route path="/weather" component={WeatherPage} />
          <Route path="/maps" component={MapsPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/login" component={LoginPage} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Router />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
