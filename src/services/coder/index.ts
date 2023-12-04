// @ts-ignore
/* eslint-disable */
import { request } from '@/utils';
import { addFileType, previewType, validateSubmitType } from './type';

export const getCoderSpec = (questionId: string) => {
  return request.get(`/coder/api/v1/questions/${questionId}/coder-spec`);
};

export function saveCodeerSpec(data: any) {
  return request.post(`/coder/api/v1/questions/${data.questionId}/coder-spec`, {
    data,
  });
}

export const getSolutionTemplate = (questionId: string, language: string) => {
  return request.get(
    `/coder/api/v1/questions/${questionId}/coders/solution-template?language=${language}`,
  );
};
export function saveSolutionTemplate(data: previewType) {
  return request.post(`/coder/api/v1/questions/${data.questionId}/coders/solution-template`, {
    data,
  });
}

//preview
export function previewTemp(data: previewType) {
  return request.post(
    `/coder/api/v1/questions/${data.questionId}/coders/solution-template/preview`,
    {
      data,
    },
  );
}

//codeFile
// * - 0 sample-solution
// * - 1 Dependency-file
// * - 2 input parse function
// * - 3 output parse function
// * - 4 assert parse function
export const getCodeFile = (questionId: string, language: string, type: number) => {
  return request.get(
    `/coder/api/v1/questions/${questionId}/coders/mirror?language=${language}&type=${type}`,
  );
};

export function addCodeFile(data: addFileType) {
  return request.post(`/coder/api/v1/questions/${data.questionId}/coders/mirror`, {
    data,
  });
}
export function updateCodeFile(data: {
  id: number;
  questionId: string;
  fileName: string;
  fileContent: string;
}) {
  return request.put(`/coder/api/v1/questions/${data.questionId}/coders/mirror/${data.id}`, {
    data,
  });
}

export function deleteCodeFile(data: { id: string; questionId: string }) {
  return request.delete(`/coder/api/v1/questions/${data.questionId}/coders/mirror/${data.id}`, {
    data,
  });
}

// testCase
export const getTestCaseParser = (questionId: string, language: string) => {
  return request.get(
    `/coder/api/v1/questions/${questionId}/coders/test-case-parser?language=${language}`,
  );
};

//coder-language
export const getPreparations = (language: string) => {
  return request.get(`/coder/api/v1/preparations?language=${language}&type=0`);
};

export const getLanguageList = (questionId: string) => {
  return request.get(`/coder/api/v1/questions/${questionId}/coders/language`);
};

export function deleteLanguageList(data: { questionId: string; language: string }) {
  return request.delete(
    `/coder/api/v1/questions/${data.questionId}/coders?language=${data.language}`,
    {
      data,
    },
  );
}

//validate
export function validataTestCase(data: validateSubmitType) {
  return request.post(`/coder/api/v1/questions/${data.questionId}/test-case-parser/validate`, {
    data,
  });
}

export const getTestCaseData = (submissionId: string) => {
  return request.get(`/coder/api/v1/submissions/detail/${submissionId}/check`);
};
