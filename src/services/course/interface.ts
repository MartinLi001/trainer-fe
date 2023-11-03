export interface AddCommentRequest {
  batchId: string;
  taskId: string;
  userId: string;
  content: string;
  projectGroupId?: string;
}

export interface removeCommentRequest {
  batchId: string;
  taskId: string;
  userId: string;
  commentId: string;
}

export interface AssignmentSubmitRequest {
  files?: Blob;
  assignment?: {
    batchId: string;
    taskId: string;
    userId: string;
    comment: string;
  };
}
