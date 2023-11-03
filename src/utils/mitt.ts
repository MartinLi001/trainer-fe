import mitt from 'mitt';

import type { RcFile } from 'antd/es/upload/interface';
type Events = {
  UPDATE_USER_AVATAR: RcFile;
};

export default mitt<Events>();
