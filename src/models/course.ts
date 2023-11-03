import type { Effect, ImmerReducer } from 'umi';
import { addComment, addGroupReviewComment, getTaskInfo } from '@/services/course';
import type { TaskResponse } from '@/pages/Task/interface';

export interface CourseType {
  taskInfo: TaskResponse;
}

interface CourseModelType {
  namespace: 'course';
  state: CourseType;
  effects: {
    getTaskInfo: Effect;
    addComment: Effect;
    addGroupReviewComment: Effect;
  };
  reducers: {
    saveTaskInfo: ImmerReducer<CourseType>;
  };
}

const defaultState = {
  taskInfo: {} as TaskResponse,
};

const CourseModel: CourseModelType = {
  namespace: 'course',
  state: defaultState,
  effects: {
    *getTaskInfo({ payload }, { call, put }): any {
      const data = yield call(getTaskInfo, payload);

      yield put({
        type: 'saveTaskInfo',
        payload: data,
      });
    },
    *addComment({ payload }, { call }) {
      yield call(addComment, payload);
    },
    *addGroupReviewComment({ payload }, { call }) {
      yield call(addGroupReviewComment, payload);
    },
  },

  reducers: {
    saveTaskInfo(state, { payload }) {
      return {
        ...state,
        taskInfo: payload,
      };
    },
  },
};

export default CourseModel;

export type CourseState = Readonly<typeof defaultState>;
export interface ConnectState {
  taskInfo: CourseState;
}
