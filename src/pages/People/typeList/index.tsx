export interface PeopleType {
  preferredName?: string;
  type?: string;
  active: string;
  createdDateTime: string;
  company: any;
  email?: string;
  firstname?: string;
  lastname?: string;
  status: string;
  tag: any[];
  tags?: { name: string; value: string }[];
  userId: string;
  avatar: string;
  phone?: string;
  summaries?: summare[];
  batchId?: string;
  batchName?: string;
}

export interface SubscriptionsType {
  daysLeft: number;
  endDate: string;
  name: string;
  options: string[];
  startDate: string;
  status: string;
  subscriptionId: string;
  targets: string[];
  type: string;
}
interface detailtype {
  name: string;
  value: string;
}
export interface summare {
  userId: string;
  overall: string;
  details: detailtype[];
  createdDateTime?: string;
  lastModifiedDateTime?: string;
  feedbackId?: string;
  summaryId?: string;
  reviewer?: {
    firstName: string;
    lastName: string;
    middleName: string;
    preferredName: string;
    userId: string;
  };
}
export interface searchdataType {
  accountIds: string[];
  clients: string[];
  companies: string[];
  listInactive: boolean;
  searchContent: string | null;
  pageNum: number;
  pageSize: number;
  sortCriteria: string | null;
  status: string;
  // tags: any;
}
