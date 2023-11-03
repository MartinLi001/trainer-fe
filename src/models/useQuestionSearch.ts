import { ImmerReducer } from 'umi';
import { SearchType } from '@/pages/Question/typeList';

export interface SearchModelState {
  data: SearchType;
}

interface SearchModelType {
  namespace: 'Search';
  state: SearchModelState;
  effects: SearchType;
  reducers: {
    updateData: ImmerReducer<SearchModelState>;
  };
}

const defaultState = {
  data: {} as SearchType,
};

const SearchModel: SearchModelType = {
  namespace: 'Search',
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
