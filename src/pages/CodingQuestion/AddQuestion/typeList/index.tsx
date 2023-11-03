export interface topicListType {
  questionTopicId: string;
  topic: string;
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

export interface columnsType {
  Title: string;
  Tags: string[];
  Company: string;
  Difficulty: string;
  Frequency: string;
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

export interface downLoadType {
  displayOption: string | null;
  downloadLink: string | null;
  mineType: string | null;
  name: string;
  resourceId: string;
  size: string | null;
}

export interface DetailValueType {
  clients?: string[];
  createdAt?: string | null;
  description: {
    linkedResourceIds: string[];
    renderedContent: string;
  };
  difficulty?: string;
  frequency?: string;
  lastModifiedDateTime?: string;
  linkedQuestionIds?: string[];
  linkedQuestions?: DetailValueType[];
  followUps?: DetailValueType[];
  name: string;
  questionId: string;
  resources?: downLoadType[] | null;
  sampleAnswer: {
    linkedResourceIds: string[];
    renderedContent: string;
  };
  tags?: string[];
  topic?: string;
  weight?: string | number;
}
