import { Effect, ImmerReducer } from 'umi';
import { TaskResponse } from '@/pages/Task/mock/typeList';
import { getTaskInfo } from '@/services/course';

export interface MockModelState {
  data: TaskResponse;
}

interface MockModelType {
  namespace: 'Mock';
  state: MockModelState;
  effects: {
    getTaskDetail: Effect;
  };
  reducers: {
    updateData: ImmerReducer<MockModelState>;
    updateMockGroups: ImmerReducer<MockModelState>;
  };
}

const defaultState = {
  data: {} as TaskResponse,
};

const MockModel: MockModelType = {
  namespace: 'Mock',
  state: defaultState,
  effects: {
    *getTaskDetail({ payload: taskId }, { put, call }): any {
      const res = yield call(getTaskInfo, taskId);
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
    updateMockGroups(state, { payload }) {
      // shortAnswerMock 时使用
      state.data.mockGroups = payload;
    },
  },
};

export default MockModel;

export type MockState = Readonly<typeof defaultState>;
