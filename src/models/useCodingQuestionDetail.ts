import { ImmerReducer } from 'umi';
import { DetailValueType } from '@/pages/QuestionDetail/typeList';

export type ListItem = Record<string, DetailValueType>;
export interface QuestionCodingDetailModelState {
  data: ListItem;
}

interface DetailModelType {
  namespace: 'CodingDetail';
  state: QuestionCodingDetailModelState;
  effects: ListItem;
  reducers: {
    updateData: ImmerReducer<QuestionCodingDetailModelState>;
  };
}

const defaultState = {
  data: {} as ListItem,
};

const DetailModel: DetailModelType = {
  namespace: 'CodingDetail',
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
