declare namespace KPI {
  /** 学员对象 */
  interface Trainee {
    userId: string;
    firstName?: string;
    lastName?: string;
    preferredName?: string;
  }
  /** task类型 */
  type TaskType = 'assignment' | 'mock' | 'project';
  /** 分数map */
  type Scores = Record<string, number>;
  type ScoreDetail = { score: number; isBonus: boolean };

  /** task标准对象 */
  interface Task {
    taskId: string;
    type: TaskType;
    priority: number;
    weight: number;
    scores: Scores;
  }
  /** 当前batch中每一个学员的communication和behavioral分数 */
  interface SummaryGeneralScores {
    communicationScore: number;
    behavioralScore: number;
  }
  /** List of userIds of trainees in the batch. Ordered by their overall kpi score. */
  interface Ranking {
    userId: string;
    overallKpi: number;
    ranking: number;
  }
  /** kpi总览数据对象 */
  interface Summary {
    batchId: string;
    weights: number[];
    trainees: Trainee[];
    assignments: Task[];
    projects: Task[];
    mocks: Task[];
    generalScores: Record<string, SummaryGeneralScores>;
    userRankings: Ranking[];
  }
  /** kpi table 每行数据对象 */
  interface TableRow {
    key?: number | string;
    rank?: number;
    name?: string;
    total?: number;
    userId?: string;
    [key: string]: any; // number | ScoreDetail; // 用于P{i}/M{i}/C{i}/S{i}/A{i}等分数。。。
  }

  /** kpi mock 细分类型 */
  interface MockType {
    taskId: string;
    weight: number;
    questions: string[];
    scores: Record<string, Scores>; // Score by traineeId by question ID. A map(question id, map(traineeId, score)). for old project, please use traineeScores.
    traineeScores: Record<string, Record<string, ScoreDetail>>; //  map(question id, map(traineeId, ScoreDetail))
    overall: Scores; // The overall score of each trainee. A map(traineeId, overall)
  }
  /** kpi mock数据对象 */
  interface MockSummary {
    batchId: string;
    priority: number;
    shortAnswerMocks: MockType[];
    codingMocks: MockType[];
    trainees: Trainee[];
    total: Scores; // Score of each user in map format. Key is the user id, value is the user score in double.
  }
}
