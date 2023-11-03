export type ListItem = {
  title: string;
  color: string;
  picture?: any;
  jumpUrl?: string;
};
export interface ItemCardType {
  list: ListItem[];
  onClick?: (key: string) => void;
}
export type submitted = {
  isSubmitted: boolean;
  isLate?: boolean;
};
export interface valuesType {
  description: string;
  isLocked: boolean;
  name: string;
  priority: number;
  startDateTime: string;
  taskId: string;
  type: string;
  submissionSummaryDto?: submitted;
}
