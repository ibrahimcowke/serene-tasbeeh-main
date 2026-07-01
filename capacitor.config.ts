import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ibrahimcowke.tasbeehly',
  appName: 'Tasbeehly',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      providers: ["google.com"]
    }
  }
};

export default config;
