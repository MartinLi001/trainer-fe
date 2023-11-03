// @ts-ignore
/* eslint-disable */
import { request } from '@/utils';
import type { SearchType } from '../../pages/Question/typeList';

/**
 * ?
 */
export function searchCodingQuestions(data: SearchType) {
  return request.post(`/questions/searches`, {
    data,
  });
}

/**
 * 获取问题概览
 */
export function queryQuestionSummary({ questionId }: { questionId: string }) {
  return request.get(`/questions/api/v1/questions/${questionId}/summary`);
}

/**
 * 获取提交历史列表
 */
export function querySubmissions(params: {
  pageSize: number;
  page: number;
  questionId: string;
  source?: number;
}) {
  const { questionId, ...data } = params;
  return request.get(`/coder/api/v1/questions/${questionId}/submissions`, {
    data,
  });
}

/**
 * 获取IDE提交历史列表
 */
export function queryIDESubmissions(params: {
  pageSize: number;
  page: number;
  questionId: string;
}) {
  const { questionId, ...data } = params;
  return request.get(`/coder/api/v1/questions/${questionId}/submissions/ide`, {
    data,
  });
}

/**
 * 保存IDE用户 answer
 */
export function saveIDECode(params: { code: string; language: string; questionId: string }) {
  const { questionId, ...data } = params;
  return request.post(`/coder/api/v1/questions/${questionId}/draft`, {
    data,
  });
}

/**
 * 获取IDE初始信息（code, testcase）
 */
export function queryIDEDetail(params: { language: string; questionId: string }) {
  const { questionId, ...data } = params;
  return request.get(`/coder/api/v1/questions/${questionId}/ide`, {
    data,
  });
}

/**
 * 获取历史记录详情
 */
export function querySubmissionDetail({
  questionId,
  submissionId,
}: {
  questionId: string;
  submissionId: string;
}) {
  return request.get(`/coder/api/v1/questions/${questionId}/submissions/${submissionId}`);
}

/**
 * 提交 code answer
 */
export function coderSubmit(data: {
  language: string;
  questionId: string;
  submittedCode: string;
  source: number;
}) {
  const { questionId } = data;
  return request.post(`/coder/api/v1/questions/${questionId}/submit`, {
    data,
  });
}

/**
 * run IDE Test Case
 */
export function coderRun(data: {
  language: string;
  questionId: string;
  submittedCode: string;
  source: number;
  testCases: any[];
}) {
  const { questionId } = data;
  return request.post(`/coder/api/v1/questions/${questionId}/run`, {
    data,
  });
}

/**
 * 查询某题的test-case-parser
 */
export function getQuestionTestCaseParser(questionId: string) {
  return request.get(
    `/coder/api/v1/questions/${questionId}/coder-spec/test-case-parser/input-params`,
    {
      getResponse: true,
    },
  );
}

//删除测试用例
export async function deleteTestCase(data: { questionId: string; id: string }) {
  const { questionId, id } = data;
  return request<{ result: boolean }>(`/coder/api/v1/questions/${questionId}/test-cases/${id}`, {
    method: 'DELETE',
  });
}

//添加测试用例
export function addQuestionTestCase(data: { questionId: string }) {
  const { questionId } = data;
  return request(`/coder/api/v1/questions/${questionId}/test-cases`, {
    method: 'POST',
    data,
  });
}

//编辑测试用例
export async function updateQuestionTestCase(data: { questionId: string; id: string }) {
  const { questionId, id } = data;
  return request<{ result: boolean }>(`/coder/api/v1/questions/${questionId}/test-cases/${id}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 获取 test case 列表
 */
export function getQuestionTestCaseList(params: {
  pageSize: number;
  page: number;
  questionId: string;
}) {
  const { questionId, ...data } = params;
  return request(`/coder/api/v1/questions/${questionId}/test-cases`, {
    method: 'GET',
    data
  });
}

//删除language file
export async function deleteCodingLanguageFile(id: string) {
  return request<{ result: boolean }>(`/coder/api/v1//preparations/${id}`, {
    method: 'DELETE',
  });
}
//添加language file
export function addCodingLanguageFile(data: { language: string; type: number; fileName: string }) {
  return request(`/coder/api/v1/preparations`, {
    method: 'POST',
    data,
  });
}
//编辑language file
export async function editCodingLanguageFile(params: {
  id: string;
  fileName: string;
  fileContent: string;
}) {
  const { id, ...data } = params;
  return request<{ result: boolean }>(`/coder/api/v1/preparations/${id}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 查询coding language
 */
export function getCodingLanguageFile(data: { language: string; type?: number }) {
  const { language, type } = data;
  return request.get(
    `/coder/api/v1/preparations?language=${language}${type + '' ? `&type=${type}` : ''}`,
    data,
  );
}

// 查询IDE 页面 代码模版
export function querySolution(params: { language: string; questionId: string }) {
  const { questionId, ...data } = params;
  return request.get(`/coder/api/v1/questions/${questionId}/coders/solution/preview`, {
    data,
  });
}

// 查询 IDE页面问题列表
export function queryIDEQuestionList(data?: any) {
  return request.get(`/coder/api/v1/questions`, {
    data,
  });
}

// 查询运行结果
export function queryRunResult({ submissionId }: { submissionId: string }) {
  return request.get(`/coder/api/v1/submissions/detail/${submissionId}/check`);
}
