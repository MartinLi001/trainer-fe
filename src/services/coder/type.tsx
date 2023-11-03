export interface addFileType {
  questionId: string;
  language: string;
  type: number;
  fileName: string;
}

export interface TestCaseType {
  questionId: string;
  language: string;
  testCase?: TestCase;
  testCaseParser: TestCaseParser;
  expect?: string;
}

export interface TestCaseParser {
  questionId: string;
  language: string;
  inputParams: InputParam[];
  outputParams: OutputParam[];
  assertFun: OutputParam;
  expect?: string;
}

export interface OutputParam {
  functionName: string;
  functionValue: string;
}

export interface TestCase {
  inputs: Input[];
  expect: string;
}

export interface Input {
  type: number;
  name: string;
  content: string;
}

// preview
export interface previewType {
  questionId: string;
  language: string;
  inputParams: InputParam[];
  output: boolean;
  outputType: string;
  dependencyPreparationIds: any[];
}

export interface InputParam {
  id: number;
  inputName: string;
  inputSpecId: number;
  inputType: string;
}

export interface SolutionType {
  fileContent: string;
  fileName: string;
  id: number;
  language: string;
  questionId: string;
  type: number;
}

//validate
export interface validateSubmitType {
  language: string;
  questionId: string;
  testCase: TestCase;
  sampleSolutionId: number;
}

export interface validateResultType {
  submissionId: string;
  questionId: string;
  language: string;
  state: string;
  statusCode: number;
  runSuccess: boolean;
  memory: string;
  runTime: number;
  totalCorrect: number;
  totalTestCases: number;
  test: boolean;
  statusMessage?: string;
  codeOutput?: string;
  expectedOutput?: string;
  inputFormatted?: string;
  compileError?: string;
  runtimeError?: string;
}
