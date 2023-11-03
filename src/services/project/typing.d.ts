// @ts-ignore
/* eslint-disable */
declare namespace API {
  type CommentItem = {
    commentBy: string;
    commentDateTime: string;
    commentId: string;
    content: string;
    firstname: string;
    lastname: string;
    preferredName: string;
  };
  type PeerReviewItem = {
    comments: CommentItem[];
    firstname: string;
    lastname: string;
    preferredName: string;
    userId: string;
  };
  type ProjectGroupMemberItem = {
    firstname: string;
    lastname: string;
    preferredName: string;
    role: string;
    userId: string;
  };
  type ProjectGroupsItem = {
    peerReviews?: PeerReviewItem[];
    projectGroupId?: string;
    projectMembers: ProjectGroupMemberItem[];
    comments?: CommentItem[];
  };
  type UpdateProjectGroupsType = {
    batchId: string;
    projectGroups: ProjectGroupsItem[];
    taskId: string;
  };

  type ProjectGroup = {
    batchId: string;
    taskId: string;
    projectGroupId: string;
  };

  type AddGroupComment = ProjectGroup & {
    content: string;
  };

  type RemoveGroupComment = ProjectGroup & {
    commentId: string;
  };

  type UpdateGroupComment = ProjectGroup & {
    content: string;
    commentId: string;
  };
}
