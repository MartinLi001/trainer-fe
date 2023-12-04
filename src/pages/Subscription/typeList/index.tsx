export interface criteriaObj {
  clientId: string;
  name: string;
}

export interface userInfo {
  userId: string;
  userFirstName: string;
  userLastName: string;
  userPreferredName: string;
  userEmail: string;
}
export interface allSubscription {
  userInfo: userInfo[];
  clients: string[];
  subscribeAllClients: boolean;
  createdDate: string;
  startDate: string;
  endDate: string;
  lastModifiedDate: string;
  totalLength: string;
  status: string;
  batchName: string;
  name: string;
  cycle: number;
  subscribeBy: string;
  email: string;
  confirmation: string;
  id: string;
}

export interface Criteria {
  field: string;
  isAscending: boolean;
}
export interface searchDataType {
  pageNumber: number;
  pageSize: number;
  searchContent: string;
  sortingCriteria: Criteria[];
  status: string;
  batchName: string;
}

export type clientType = {
  clientId: string;
  name: string;
};
export type TagsType = {
  name: string;
  value: string;
};
/**
 * 获取学员接口中返回的学员字段（数组每项）
 */
export type usersSearchResultUserType = {
  userId: string;
  firstname: string;
  lastname: string;
  preferredName: string;
  email: string;
  tags?: TagsType[];
  batchId?: string;
  batchName?: string;
  batchStartDate: string;
};
/**
 * 添加订阅选择学员的表格中每行数据
 */
export type addSubscriptionUsersTableRowType = {
  key: string;
  userId: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  batchId: string;
  batchName: string;
  batchAddedDate: string;
};
/**
 * 添加订阅选择的学员（每个学员）
 */
export type SelectedUserType = {
  userId: string;
  userFirstName: string;
  userLastName: string;
  userPreferredName: string;
  userEmail: string;
  userBatchId: string;
  userBatchName: string;
};
