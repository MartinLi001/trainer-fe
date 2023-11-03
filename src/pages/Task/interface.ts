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
  firstName: string;
  lastName: string;
  preferredName: string;
  role: string;
  userId: string;
}

export interface ProjectGroupsItem {
  peerReviews?: PeerReviewItem[];
  projectGroupId?: string;
  projectGroupMembers: ProjectGroupMemberItem[];
  comments?: CommentItem[];
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
  projectGroups: ProjectGroupsItem[];
}
