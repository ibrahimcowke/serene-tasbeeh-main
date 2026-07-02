import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ibrahimcowke.tasbeehly',
  appName: 'Tasbeehly',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      providers: ["google.com"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_tasbeehly",
      iconColor: "#4CAF50"
    }
  }
};

export default config;
