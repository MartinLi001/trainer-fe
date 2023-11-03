// 判断是否是prod环境
const { NODE_ENV } = process.env;
export const isProd = NODE_ENV === 'production';
