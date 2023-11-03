import styles from './index.less';
import loadingImg from '@/assets/screenLoading.gif';

/**
 * 全屏加载loading
 */
export default () => <></>;

const PageLoading = () => {
  return (
    <div className={styles.loadingWrap}>
      <img width="128" src={loadingImg} alt="loading" />
    </div>
  );
};
export { PageLoading };
