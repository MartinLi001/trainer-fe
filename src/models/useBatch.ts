import { useModel } from 'umi';

/**
 * @description 获取到当前用户下的batchId并查询相关信息
 */
export default () => {
  const {initialState} = useModel('@@initialState');
  // const { data, loading } = useRequest(async () => {
  //   if (initialState?.userBatch?.batchIds?.length) {
  //     return await batchQuery(res?.batchId);
  //   }
  //   return {};
  // });

  // return {
  //   data,
  //   loading,
  // };
};
