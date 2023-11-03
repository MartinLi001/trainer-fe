// @ts-ignore
/* eslint-disable */
import { attendantsType } from '@/pages/Task/mock/typeList';
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
    // batchCategoryId: string;
    name: string;
    startDate: string;
    isTemplate: boolean;
    isClosed: boolean;
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
    taskId: string;
    type: string;
    instruction: string;
    submissionSummaryDto?: {
      isSubmitted: boolean;
    };
  };

  type MockResult = {
    batchId: string;
    taskId: string;
    results: Record<string, attendantsType[]>;
  };
}
