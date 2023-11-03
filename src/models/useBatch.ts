import { useRequest } from 'ahooks';
import { batchQuery, getBatchId } from '@/services/course';

/**
 * @description 获取到当前用户下的batchId并查询相关信息
 */
export default () => {
  const { data, loading } = useRequest(async () => {
    const res = await getBatchId();
    if (res?.batchId) {
      return await batchQuery(res?.batchId);
    }
    return {};
  });

  return {
    data,
    loading,
  };
};
