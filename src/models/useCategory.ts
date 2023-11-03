import { Effect, ImmerReducer } from 'umi';

import { getAllCategory } from '@/services/batch';

export interface CategoryModelState {
  categoryData: API.CategoryType[];
  currentCategory: API.CategoryType;
}

interface CategoryModelType {
  namespace: 'category';
  state: CategoryModelState;
  effects: {
    getCategoryList: Effect;
    setCurrentCategory: Effect;
  };
  reducers: {
    updateCurrentCategory: ImmerReducer<CategoryModelState>;
    updateCategoryList: ImmerReducer<CategoryModelState>;
  };
}

const defaultState = {
  categoryData: [],
  currentCategory: {} as API.CategoryType,
};

const CategoryModel: CategoryModelType = {
  namespace: 'category',
  state: defaultState,
  effects: {
    *setCurrentCategory({ payload }, { put }) {
      yield put({
        type: 'updateCurrentCategory',
        payload,
      });
    },
    *getCategoryList(_, { put, call }): any {
      const res = yield call(getAllCategory);
      yield put({
        type: 'updateCategoryList',
        payload: res,
      });
    },
  },
  reducers: {
    updateCurrentCategory(state, { payload }) {
      state.currentCategory = payload;
    },
    updateCategoryList(state, { payload }) {
      state.categoryData = payload;
    },
  },
};

export default CategoryModel;

export type CategoryState = Readonly<typeof defaultState>;
