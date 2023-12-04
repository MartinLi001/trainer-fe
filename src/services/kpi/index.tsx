import { request } from '@/utils';

/**
 * 查询Kpi详情
 */
export function getKpiDetail(batchId: string, traineeId: string) {
  return request.get(`/kpi/api/v2/trainer/trainees/${batchId}/${traineeId}`);
}

/**
 * 获取kpiMock 详情
 */
export function getKpiMock(data?: object) {
  return request.post(`/kpi/api/v2/trainer/trainees/mocks`, {
    data,
  });
}

/**
 * 获取kpiMock 详情
 */
export function getKpiProjects(data?: object) {
  return request.post(`/kpi/api/v2/trainer/trainees/projects`, {
    data,
  });
}

/**
 * 根据batch id获取kpi summary信息
 */
export function getKpiSummary(batchId: string) {
  return request.get(`/kpi/api/v2/trainer/kpis/${batchId}`);
}

/**
 * 根据batch id和priority获取mock kpi信息
 */
export function getKpiMockSummary(batchId: string, priority: string | number) {
  return request.get(`/kpi/api/v2/trainer/mocks/${batchId}/${priority}`);
}

/**
 * 添加feedBack
 */
export function addSummary(data: any) {
  return request.post('/batch/api/v2/trainer/summary/add', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 删除feedBack
 */

export const deleteSummary = (data: any) => {
  return request.delete('/batch/api/v2/trainer/summary/delete', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};
/**
 * 更新feedBack
 */
export function updateSummary(data: any) {
  return request.post('/batch/api/v2/trainer/summary/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

export interface PutKpiScoreProp {
  batchId: string;
  traineeId: string;
  behavioralScore: number;
  communicationScore: number;
}

/**
 * 更新kpi详情score(behavioralScore,communicationScore)
 */
export function putKpiScore(data: PutKpiScoreProp) {
  return request.post(`/kpi/api/v2/trainer/score/general`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 更新kpi的权重.
 */
export function updateSummaryWeights(data: KPI.UpdateSummaryWeights) {
  return request.patch(`/kpi/api/v2/trainer/weights`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 更新mock task的权重
 */
export function updateMocksWeights(data: KPI.UpdateMocksWeights) {
  return request.patch(`/kpi/api/v2/trainer/mock/tasks/weights`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 更新mock task的总分
 */
export function updateMockOverall(data: KPI.UpdateMockOverall) {
  return request.patch(`/kpi/api/v2/trainer/mock/overalls`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 更新batch中某一个task的权重
 */
export function updateTaskWeight(data: KPI.UpdateTaskWeight) {
  return request.patch(`/kpi/api/v2/trainer/tasks/weights`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}
