import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ibrahimcowke.tasbeehly',
  appName: 'Tasbeehly',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      providers: ["google.com"],
      // Web Client ID (client_type 3) from google-services.json — required on Android
      // so Google Play Services returns a valid idToken for Firebase verification.
      googleClientId: "207821527708-slddpn0mmr3r5phjn4q75inp21k7h9br.apps.googleusercontent.com"
    },
    LocalNotifications: {
      smallIcon: "ic_stat_tasbeehly",
      iconColor: "#4CAF50"
    }
  }
};

export default config;
