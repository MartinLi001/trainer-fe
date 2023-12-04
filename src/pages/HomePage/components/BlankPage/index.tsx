import React from 'react';
import Welcome from '@/assets/Welcome.svg';
import style from './index.less';
import { useModel } from 'umi';
const BlankPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const userName = initialState?.firstName + ' ' + initialState?.lastName;
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
