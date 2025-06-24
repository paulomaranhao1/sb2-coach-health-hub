
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sb2coach.app',
  appName: 'SB2coach.ai',
  webDir: 'dist',
  // Comentado para builds de produção - descomente apenas para desenvolvimento
  // server: {
  //   url: 'https://64062929-4387-449a-a04c-a2ac683b1d70.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#E53E3E',
      sound: 'beep.wav',
    },
  },
};

export default config;
