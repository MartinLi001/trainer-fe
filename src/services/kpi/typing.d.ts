declare namespace KPI {
  interface UpdateSummaryWeights {
    batchId: string;
    weights: number[];
  }
  interface TaskWeight {
    taskId: string;
    type: string;
    weight: number;
  }
  interface UpdateMocksWeights {
    batchId: string;
    priority: number;
    taskWeights: TaskWeight[];
  }
  interface Overall {
    traineeId: string;
    overall: number;
  }
  interface UpdateMockOverall {
    batchId: string;
    priority: number;
    taskId: string;
    overalls: Overall[];
  }
  interface UpdateTaskWeight {
    batchId: string;
    taskWeights: {
      taskId: string;
      type: string;
      priority: number;
      weight: number;
    }[];
  }
}
