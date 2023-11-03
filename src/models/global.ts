// import { Effect, ResolverModels, Model } from 'dva-type';
import { Effect, ImmerReducer } from 'umi';

export interface addressDataType {
  addressId?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface UserInfoType {
  active?: string;
  addresses: addressDataType[];
  company?: Record<string, any>;
  createdDateTime?: string;
  dateOfBirth?: string;
  email: string;
  firstName: string;
  gender: string;
  lastName: string;
  middleName?: string;
  phone: string;
  preferredName?: string;
  status?: string;
  tags?: any;
  userId: string;
}

export interface GlobalType {
  userInfo: UserInfoType;
}

interface GlobalModelType {
  namespace: 'global';
  state: GlobalType;
  effects: {
    // 定义effect 传入 payload 类型
    addAddress: Effect;
    deleteAddress: Effect;
    updateUserInfo: Effect;
  };
  reducers: {
    addAddress: ImmerReducer<GlobalType>;
    deleteAddress: ImmerReducer<GlobalType>;
    updateUserInfo: ImmerReducer<GlobalType>;
  };
}

const defaultState = {
  userInfo: JSON.parse(localStorage.userInfo || '{}'),
};

const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: defaultState,
  effects: {
    *addAddress({ payload }, { put, call }) {
      yield call();
      yield put({
        type: 'addAddress',
        payload,
      });
    },
    *deleteAddress({ payload }, { put }) {
      yield put({
        type: 'deleteAddress',
        payload,
      });
    },
    *updateUserInfo({ payload }, { put }) {
      yield put({
        type: 'updateUserInfo',
        payload,
      });
    },
  },
  reducers: {
    addAddress(state, { payload }) {
      state.userInfo.addresses.push(payload);
    },
    deleteAddress(state, { payload }) {
      state.userInfo.addresses.push(payload);
    },
    updateUserInfo(state, { payload }) {
      state.userInfo = payload;
    },
  },
};

export default GlobalModel;

export type GlobalState = Readonly<typeof defaultState>;
export interface ConnectState {
  userInfo: GlobalState;
}
