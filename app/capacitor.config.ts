import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.airaplus.app',
  appName: 'AIRA+',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    },
    // Impostazioni plugin geolocation
    Geolocation: {
      // Permessi per iOS
      permissions: {
        ios: ["location", "when-in-use"]
      }
    }
  }
};

export default config;