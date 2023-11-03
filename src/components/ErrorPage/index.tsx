import errorQuestionDetail from '@/assets/errorQuestionDetail.png';
import Page403forTagManagement from '@/assets/Page403.png';
import style from './index.less';

function ErrorPage404() {
  return (
    <div className={style.errorQuesDeta}>
      <div className={style.errorText}>
        <div className={style.errorHeader}>Sorry, this page cannot be found!</div>
        <div className={style.errorContent}>Please check your URL</div>
        <img src={errorQuestionDetail} />
      </div>
    </div>
  );
}

export default ErrorPage404;

export function ErrorPage503() {
  return (
    <div className={style.page503}>
      <div className={style.subscriptDialog}>
        <div className={style.subscriptHeader}>Oh Snap!</div>
        <div className={style.subscriptContent}>An error has occured, please come back later</div>
        <img src={errorQuestionDetail} style={{ width: 350 }} />
      </div>
    </div>
  );
}

export function ErrorPage403() {
  return (
    <div className={style.errorQuesDeta}>
      <div className={style.errorText}>
        <div className={style.errorHeader}>Sorry, you don’t have access to training platform</div>
        <div className={style.errorContent}>
          Please contact your administrator to request for the access to this page.
        </div>
        <img src={errorQuestionDetail} />
      </div>
    </div>
  );
}

export function TagManagementPage403() {
  return (
    <div className={style.errorQuesDeta}>
      <div className={style.errorText}>
        <div className={style.errorHeader}>Sorry, accessing this page is forbidden</div>
        <div className={style.errorContent}>Please contact your administrator</div>
        <img src={Page403forTagManagement} />
      </div>
    </div>
  );
}
