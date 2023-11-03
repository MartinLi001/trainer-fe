import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  siderWidth?: number;
  copyRight?: string;
  headerTheme?: string;
  primaryColor?: string;
} = {
  siderWidth: 180,
  navTheme: 'light',
  headerTheme: 'light',
  primaryColor: '#2875D0',
  layout: 'mix',
  fixedHeader: true,
  // fixSiderbar:true,
  colorWeak: false,
  copyRight: '©Beaconfire 2022',
  pwa: false,
  iconfontUrl: '//at.alicdn.com/t/c/font_3583708_oepvip6jj6.js',
};

export default Settings;
