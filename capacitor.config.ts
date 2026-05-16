import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.francojbe.clarifi',
  appName: 'ClariFi',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#F5F7FB",
      androidSplashResourceName: "splash",
      showSpinner: false
    }
  }
};

export default config;
