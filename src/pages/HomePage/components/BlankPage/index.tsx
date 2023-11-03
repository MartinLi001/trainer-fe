import React from 'react';
import Welcome from '@/assets/Welcome.svg';
import style from './index.less';
const BlankPage: React.FC = () => {
  const userInfo = JSON.parse(localStorage.getItem(['userInfo']) || '{}');
  const userName = userInfo.firstName + ' ' + userInfo.lastName;
  return (
    <div className={style.BlankPage}>
      <div className={style.BlankPageTitle}>Hello!</div>
      <span className={style.BlankPageCont}>
        Your training information is not ready yet, please come back again later
      </span>
      <div className={style.BlankPageBottom}>
        <div className={style.BlankPagePic}>
          <img src={Welcome} style={{ maxWidth: '100%' }} />
          <p className={style.BlankPagePicCont}>
            Welcome to BeaconFire training <span className={style.userNameShow}>{userName}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlankPage;
