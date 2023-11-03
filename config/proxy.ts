const { UMI_ENV } = process.env;
import { config as dev } from './config.dev';
import { config as qa } from './config.qa';
import { config as sdet } from './config.sdet';
import { config as production } from './config.production';

export const EnvConfig = {
  dev,
  qa,
  sdet,
  production,
};

const { API_BASE_URL, API_PREFIX } = EnvConfig[(UMI_ENV as string) || 'dev'];

console.log(EnvConfig[(UMI_ENV as string) || 'dev'], '=====');
export default {
  dev: {
    [`${API_PREFIX}`]: {
      target: API_BASE_URL,
      pathRewrite: { [`^${API_PREFIX}`]: '' },
      changeOrigin: true,
    },
  },
  qa: {
    [`${API_PREFIX}`]: {
      target: API_BASE_URL,
      pathRewrite: { [`^${API_PREFIX}`]: '' },
      changeOrigin: true,
    },
  },
  sdet: {
    [`${API_PREFIX}`]: {
      target: API_BASE_URL,
      pathRewrite: { [`^${API_PREFIX}`]: '' },
      changeOrigin: true,
    },
  },
  production: {
    [`${API_PREFIX}`]: {
      target: API_BASE_URL,
      pathRewrite: { [`^${API_PREFIX}`]: '' },
      changeOrigin: true,
    },
  },
};
