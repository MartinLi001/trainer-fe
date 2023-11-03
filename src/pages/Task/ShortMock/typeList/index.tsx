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
  firstname: string;
  lastname: string;
  preferredName: string;
}
export interface SubmissionItem {
  comments: CommentItem[];
  firstname: string;
  lastname: string;
  preferredName: string;
  userId: string;
  resources: ResourcesItem[];
  submittedDateTime: string;
}
export interface PeerReviewItem {
  comments: CommentItem[];
  firstname: string;
  lastname: string;
  preferredName: string;
  userId: string;
}

export interface ProjectGroupMemberItem {
  firstname: string;
  lastname: string;
  preferredName: string;
  role: string;
  userId: string;
}
export interface ProjectGroupsItem {
  peerReviews: PeerReviewItem[];
  projectGroupId: string;
  projectGroupMembers: ProjectGroupMemberItem[];
  comments?: CommentItem[];
}
export interface attachments {
  resourceId: string;
  name: string;
  downloadLink: string;
  displayOption: string;
}
export interface attendantsType {
  score?: number;
  firstname?: string;
  lastname?: string;
  firstName?: string;
  lastName?: string;
  preferredName: string;
  status?: string;
  userId: string;
  questionId?: string;
  startTime?: string;
  userAnswer: {
    attachments?: attachments[];
    content: string;
    language: string;
  };
}
export interface mockGroupsType {
  host: attendantsType | string;
  meetingLink?: string;
  mockGroupId?: string;
  startTime?: string;
  status?: string;
  makeUpMock?: boolean;
  isMakeUpMockGroup?: boolean;
  trainees: attendantsType[];
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
  resources?: Record<string, rescourcesType>;
}
export interface ShortMockåType {
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
  projectGroups: ProjectGroupsItem[];
  attendants: attendantsType[];
  isOneOnOne: boolean;
  mockGroups: mockGroupsType[];
  mockSummary?: any;
  questionOrders: string[];
  questions: Record<string, questionType>;
  reopenList: string[];
  status?: string;
}
