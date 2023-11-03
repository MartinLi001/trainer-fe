import { defineConfig } from 'umi';

const API_BASE_URL = 'https://api-drill-qa.beaconfireinc.com';

const Host = 'https://auth-qa.beaconfireinc.com';

const ACCOUNT_URL = 'https://account-qa.beaconfireinc.com';

const config = {
  API_PREFIX: `/${process.env.npm_package_name}`,
  API_BASE_URL,
  LOGOUT_URL: `${Host}/login?logout=true&redirect=`,
  LOGIN_URL: `${Host}/login?logout=true&redirect=`,
  FORGET_PSD_URL: `${Host}/forgot-password`,
  REGISTRAT_URL: `${Host}/register`,
  NO_ACCESS: `${Host}/no-access`,
  PROFILE: `${ACCOUNT_URL}/profile`,
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
