
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sb2coach.app',
  appName: 'SB2coach.ai',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#E53E3E',
      sound: 'beep.wav',
    },
    // Desabilitar APIs não utilizadas para evitar warnings
    CapacitorHttp: {
      enabled: false,
    },
  },
  server: {
    cleartext: true,
    allowNavigation: [
      "*.lovableproject.com",
      "supabase.co",
      "*.supabase.co"
    ]
  },
  // Configurações específicas para evitar warnings de APIs não suportadas
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#ffffff'
  },
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: true,
    captureInput: true
  }
};

export default config;
