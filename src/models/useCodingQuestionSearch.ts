import { ImmerReducer } from 'umi';
import { SearchType } from '@/pages/Question/typeList';

export interface SearchCodingModelState {
  data: SearchType;
}

interface SearchModelType {
  namespace: 'CodingSearch';
  state: SearchCodingModelState;
  effects: SearchType;
  reducers: {
    updateData: ImmerReducer<SearchCodingModelState>;
  };
}

const defaultState = {
  data: {} as SearchType,
};

const SearchModel: SearchModelType = {
  namespace: 'CodingSearch',
  state: defaultState,
  effects: {
    pageNum: 0,
    pageSize: 10,
    criteria: [],
    sortCriteria: { field: 'sequenceNumber', order: '' },
  },
  reducers: {
    updateData(state, { payload }) {
      state.data = payload;
    },
  },
};

export default SearchModel;

export type SearchState = Readonly<typeof defaultState>;
