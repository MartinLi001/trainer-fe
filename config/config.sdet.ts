import { defineConfig } from 'umi';

const Host = 'https://signinsdet.beaconfireinc.com';

const config = {
  API_PREFIX: `/${process.env.npm_package_name}`,
  API_BASE_URL: 'https://sdetapi.beaconfireinc.com',
  LOGOUT_URL: `${Host}/login?logout=true&redirect=`,
  LOGIN_URL: `${Host}/login?logout=true&redirect=`,
  FORGET_PSD_URL: `${Host}forgot-password`,
  REGISTRAT_URL: `${Host}/register`,
  NO_ACCESS: `${Host}/no-access`,
  PROFILE: 'https://accountqa.beaconfireinc.com/profile',
};

export { config };

export default defineConfig({
  define: {
    'process.env': {
      ...process.env,
      ...config,
    },
  },
});
