import { Effect, ImmerReducer } from 'umi';
import { batchQuery } from '@/services/course';
export interface BatchModelState {
  data: API.AllBatchType;
}

interface BatchModelType {
  namespace: 'Batch';
  state: BatchModelState;
  effects: {
    getBatchDetail: Effect;
  };
  reducers: {
    updateData: ImmerReducer<BatchModelState>;
  };
}

const defaultState = {
  data: {} as API.AllBatchType,
};

const BatchModel: BatchModelType = {
  namespace: 'Batch',
  state: defaultState,
  effects: {
    *getBatchDetail({ payload: batchId }, { put, call }): any {
      const res = yield call(batchQuery, batchId);
      yield put({
        type: 'updateData',
        payload: res,
      });
    },
  },
  reducers: {
    updateData(state, { payload }) {
      state.data = payload;
    },
  },
};

export default BatchModel;

export type BatchState = Readonly<typeof defaultState>;
