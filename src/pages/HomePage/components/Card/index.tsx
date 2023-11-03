// import { useState } from 'react';
import { useHistory } from 'umi';
import type { ListItem } from '../../TypeList';
import style from './index.less';

interface itemType {
  item: ListItem;
}

function ListCard({ item }: itemType) {
  // const [loading, setLoading] = useState(false);
  const history = useHistory();

  const JumpPage = (type: string) => {
    history.push(`/batch/${type}`);
  };

  return (
    <div className={style.Cardlist} onClick={() => JumpPage(item.title)}>
      <div className={style.CardContent}>
        <div style={{ color: item.color }} className={style.CardTitle}>
          {item.title}
        </div>
        <div className={style.CardPicture}>
          <img src={item.picture}></img>
        </div>
      </div>
    </div>
  );
}

export default ListCard;
