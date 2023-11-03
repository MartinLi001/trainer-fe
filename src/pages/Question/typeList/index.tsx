export interface criteriaObj {
  field: string;
  value: string | null;
  values: string[];
  operand: string | null;
}
export interface sortCriteria {
  field: string;
  order: string;
}
export interface SearchType {
  criteria: criteriaObj[];
  pageNum: number;
  pageSize: number;
  sortCriteria: sortCriteria;
}
export interface TagType {
  questionTagId: string;
  frequency: number;
  tag: string;
}
export interface ClientsType {
  clientId: string;
  name: string;
}

export interface threeStype {
  label: string;
  list: TagType[] | ClientsType[];
}

export interface SearchData {
  clients: string[];
  difficulty: string;
  frequency: string;
  name: string;
  questionId: string;
  sequenceNumber: number;
  tags: string[];
  topic: string;
}
export interface columnsType {
  Title: string;
  Tags: string[];
  Company: string;
  Difficulty: string;
  Frequency: string;
}
