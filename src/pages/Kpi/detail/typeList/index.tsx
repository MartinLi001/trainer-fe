import { attachments } from '@/pages/Task/mock/typeList';

export interface KpiType {
  behavioralScore: number;
  communicationScore: number;
  batchName: string;
  fullName: string;
  mockScores: string[] | number[];
  mocks: string[];
  projects: string[];
  total: number;
  traineeId: string;
  feedbacks: any;
}

export interface DetailShowType {
  personMap: Record<string, personType>;
  projects?: projectsType[];
  mocks?: mocksType[];
  data: mocksType[] | projectsType[];
}

export interface personType {
  firstName: string;
  lastName: string;
  preferredName: string;
  userId: string;
}
export interface projectsType {
  comments: commentsType[];
  score: number | null;
  taskId: string;
  taskName: string;
  teammateComments: commentsType[];
  trainerComments: commentsType[];
  traineeComments?: commentsType[]; // 疑似于teammateComments是同样的数据，未确认
  isGroupProject?: boolean; // true: group project; false: individual project
}

export interface commentsType {
  commentBy: string;
  commentDateTime: string;
  commentId: string;
  content: string;
  projectGroupId?: string;
}

export interface mocksType {
  codingMocks: taskType[];
  shortAnswerMocks: taskType[];
  codingMock: taskType[];
  shortAnswerMock: taskType[];
}

export interface taskType {
  questionDetails: questionType[];
  taskId: string;
  taskName: string;
}
export interface questionType {
  answer: {
    content: string;
    language: string;
    attachments: attachments[];
  };
  comment: commentsType | null;
  description: {
    linkedResourceIds: string[];
    renderedContent: string;
  };
  isBonus?: boolean | null;
  name: string;
  questionId: string;
  score: number | null;
}

export interface Feeddetails {
  name: string;
  value: string;
  type?: boolean;
}

export interface FeedbackType {
  userId: string;
  overall: string;
  details: Feeddetails[];
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
