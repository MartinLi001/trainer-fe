import { ImmerReducer } from 'umi';
import { DetailValueType } from '@/pages/QuestionDetail/typeList';

export type ListItem = Record<string, DetailValueType>;
export interface QuestionDetailModelState {
  data: ListItem;
}

interface DetailModelType {
  namespace: 'Detail';
  state: QuestionDetailModelState;
  effects: ListItem;
  reducers: {
    updateData: ImmerReducer<QuestionDetailModelState>;
  };
}

const defaultState = {
  data: {} as ListItem,
};

const DetailModel: DetailModelType = {
  namespace: 'Detail',
  state: defaultState,
  effects: {},
  reducers: {
    updateData(state, { payload }) {
      state.data = payload;
    },
  },
};

export default DetailModel;

export type DetailState = Readonly<typeof defaultState>;
