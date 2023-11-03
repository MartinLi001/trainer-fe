export interface ResourcesItem {
  downloadLink: string;
  name: string;
  resourceId: string;
}

export interface CommentItem {
  commentBy: string;
  commentDateTime: string;
  commentId: string;
  content: string;
  firstName: string;
  lastName: string;
  preferredName: string;
}

export interface SubmissionItem {
  comments: CommentItem[];
  firstName: string;
  lastName: string;
  preferredName: string;
  userId: string;
  resources: ResourcesItem[];
  submittedDateTime: string;
}

export interface attendantsType {
  firstname?: string;
  lastname?: string;
  firstName?: string;
  lastName?: string;
  preferredName: string;
  status?: string;
  userId: string;
  isBonus?: boolean;
  score?: number;
  comment?: Record<string, string>;
  questionId?: string;
  userAnswer: {
    attachments?: attachments[];
    content: string;
    language: string;
  };
}
export interface attachments {
  resourceId: string;
  name: string;
  downloadLink: string;
  displayOption: string;
}

export interface mockGroupsType {
  host?: attendantsType | string;
  meetingLink?: string;
  mockGroupId?: string;
  startTime?: string;
  status?: string;
  makeUpMock?: boolean;
  isMakeUpMockGroup?: boolean;
  trainees?: attendantsType[];
  viewableQuestionIds?: string[];
}
export interface rescourcesType {
  hosdisplayOptiont: attendantsType[];
  name?: string;
  resourceId: string;
}
export interface questionType {
  acceptUserAnswer: boolean;
  description: {
    linkedResourceIds: string[];
    renderedContent: string;
  };
  name: string;
  questionId: string;
  results: Record<string, attendantsType>;
  weight: number;
  followUps?: any;
  sampleAnswer: any;
  resources?: Record<string, rescourcesType>;
}
export interface TaskResponse {
  startDateTime: string;
  name: string;
  type: string;
  endDateTime: string;
  isLocked: boolean;
  description: string;
  resources: ResourcesItem[];
  priority: number;
  taskId: string;
  meetingLink?: string;
  batchId: string;
  submissions?: SubmissionItem[];
  instruction: string;
  enableLateSubmission: boolean;
  attendants: attendantsType[];
  isOneOnOne: boolean;
  mockGroups: mockGroupsType[];
  mockSummary?: any;
  questionOrders: string[];
  questions: Record<string, questionType>;
  reopenList: string[];
  status?: string;
}
