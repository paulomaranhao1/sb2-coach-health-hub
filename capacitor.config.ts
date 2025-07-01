
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sb2coach.app',
  appName: 'SB2coach.ai',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#E53E3E',
      sound: 'beep.wav',
    },
  },
};

export default config;
