// @ts-ignore
/* eslint-disable */
// import { PeopleType } from '../../pages/People/typeList'
declare namespace API {
  type CategoryType = {
    batchCategoryId: string;
    name: string;
    description: string;
    coolDownPeriod: number;
    active: boolean;
  };

  type AllBatchType = {
    batchId: string;
    batchCategoryId: string;
    name: string;
    startDate: string;
    isTemplate: boolean;
    isClosed: boolean;
    tasks: any;
    trainees: any;
    trainers: any;
  };

  type TaskType = {
    batchId: string;
    description: string;
    isLocked: boolean;
    name: string;
    priority: number;
    startDateTime: string;
    endDateTime: string;
    taskId: string;
    type: string;
    submissionSummaryDto?: {
      isSubmitted: boolean;
    };
  };
}
