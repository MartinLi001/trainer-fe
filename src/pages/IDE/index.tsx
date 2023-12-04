import { Tabs, TabsProps } from 'antd';
import { history, useLocation, useParams } from 'umi';
import { useEffect, useRef, useState } from 'react';
import { useRequest } from 'ahooks';

import {
  coderSubmit,
  coderRun,
  queryRunResult,
  querySolution,
  getQuestionDetail,
  queryIDEDetail,
  queryIDESubmissions,
  queryIDEQuestionList,
  querySubmissionDetail,
  getQuestionTestCaseParser,
} from '@/services';

import IconFont from '@/components/IconFont';
import {
  BaseLayout,
  Coder,
  Description,
  QuestionDraw,
  Submission,
  SubmissionDetail,
  TestBlock,
} from '@/components/IDE';

export default function Problems() {
  // 出发run 的动作 1: 运行 2： submit
  const runHandle = useRef<any>();
  const { activeKey, questionId } = useParams<{ activeKey: string; questionId: string }>();
  const testBlockRef = useRef<any>();
  const [checkLoading, setCheckLoading] = useState(false);
  const {
    query: { submissionId },
    pathname,
  } = useLocation() as any;

  const showSubmissionDetailPanel = pathname?.includes('/submission') && submissionId;

  // answer code 数据
  const [code, setCode] = useState('');
  const [open, setOpen] = useState(false);

  // testcase 数据
  const [testCaseData, setCaseData] = useState<any>([]);
  const [runResultdata, setRunResultdata] = useState<any>({});

  const tabItems: TabsProps['items'] = [
    {
      key: 'description',
      label: `Description`,
      // children: <Description />,
    },
    {
      key: 'submission',
      label: `Submission`,
      // children: <Submission onRowClick={onRowClick} />,
    },
  ];

  const tabKeys = tabItems.map((item) => item.key);

  const currentKey = tabKeys.includes(activeKey) ? activeKey : 'description';

  const { run: getTestCaseParserRun } = useRequest(() => getQuestionTestCaseParser(questionId), {
    manual: true,
    onSuccess(result: any) {
      setCaseData(result ?? []);
    },
  });

  const {
    loading: questionDetailLoading,
    data: questionDetailData,
    run: questionDetailRun,
  } = useRequest(getQuestionDetail, {
    refreshDeps: [questionId],
    manual: true,
  });

  const {
    loading: submissonLoading,
    data: submissionData,
    run: submissionRun,
  } = useRequest(
    (params) =>
      queryIDESubmissions({
        questionId,
        ...params,
      }),
    {
      manual: true,
    },
  );

  const {
    data: submissionDetailData,
    run: submissionDetailRun,
    loading: submissionDetailLoading,
  } = useRequest(querySubmissionDetail, {
    manual: true,
  });

  const { loading: detailLoading } = useRequest(
    () => {
      setRunResultdata({});
      return queryIDEDetail({
        questionId,
        language: 'java',
      });
    },
    {
      refreshDeps: [questionId],
      onSuccess(data) {
        if (data) {
          setCode(data.codeTemplate);
          if (data.testCases?.length) {
            setCaseData(data.testCases);
          } else {
            getTestCaseParserRun();
          }
        }
      },
    },
  );

  const { data: questionsList, run: questionListRun } = useRequest(
    () =>
      queryIDEQuestionList({
        page: 1,
        pageSize: 200,
      }),
    {
      manual: true,
      refreshDeps: [questionId, runResultdata],
    },
  );

  const { run: checkRun, refresh } = useRequest(queryRunResult, {
    manual: true,
    onSuccess(result: any) {
      if (result.state === 'pending') {
        const _timer = setTimeout(() => {
          clearTimeout(_timer);
          refresh();
        }, 1000);
      } else {
        setRunResultdata(result);
        setCheckLoading(false);
        // 如果是submit 出发的，则左侧跳转到提交记录tab

        if (runHandle.current === 2) {
          questionListRun();
          if (currentKey === tabItems[0].key) {
            history.push(`/problems/${questionId}/submission`);
          } else {
            submissionRun({
              page: 1,
              pageSize: 10,
            });
          }
        }
      }
    },
    onError() {
      setCheckLoading(false);
    },
  });

  const { run: codeSubmit } = useRequest(coderSubmit, {
    manual: true,
    onSuccess(result: any) {
      checkRun({ submissionId: result.submissionId });
    },
    onError() {
      setCheckLoading(false);
    },
  });

  const { run: codeRun } = useRequest(coderRun, {
    manual: true,
    onSuccess(result: any) {
      checkRun({ submissionId: result.submissionId });
    },
    onError() {
      setCheckLoading(false);
    },
  });

  const { loading: resetLoading, run: resetRun } = useRequest(querySolution, {
    manual: true,
    onSuccess({ previewCode }: any) {
      setCode(previewCode);
    },
  });

  const onRowClick = (id: string) => {
    history.replace(`/problems/${questionId}/submission?submissionId=${id}`);
  };

  const onChange = (key: string) => {
    history.push(`/problems/${questionId}/${key}`);
  };

  useEffect(() => {
    if (currentKey === tabItems[1].key) {
      submissionRun({
        page: 1,
        pageSize: 10,
      });
    } else {
      questionDetailRun(questionId);
    }
  }, [currentKey, questionId]);

  useEffect(() => {
    if (showSubmissionDetailPanel) {
      submissionDetailRun({
        questionId,
        submissionId,
      });
      testBlockRef.current?.setOpen(false);
    }
  }, [submissionId, showSubmissionDetailPanel]);

  useEffect(() => {
    questionListRun();
  }, []);

  return (
    <>
      <BaseLayout
        headerExtra={
          <span onClick={() => setOpen(true)}>
            <IconFont type="icon-a-Iconsmenu_open_left" style={{ fontSize: 26 }} />
          </span>
        }
        leftPanel={
          <>
            <Tabs activeKey={currentKey} items={tabItems} onChange={onChange} />
            {currentKey === 'description' && (
              <Description loading={questionDetailLoading} data={questionDetailData} />
            )}
            {currentKey === 'submission' && (
              <Submission
                loading={submissonLoading}
                data={submissionData}
                onRowClick={onRowClick}
                onPageChange={submissionRun}
              />
            )}
          </>
        }
        rightTopPanel={
          showSubmissionDetailPanel ? (
            <SubmissionDetail
              data={submissionDetailData}
              loading={submissionDetailLoading}
              onClose={() => history.push(`/problems/${questionId}/${activeKey}`)}
            />
          ) : (
            <Coder
              value={`${code}`}
              onChange={setCode}
              loading={resetLoading || detailLoading}
              onReset={() =>
                resetRun({
                  questionId,
                  language: 'java',
                })
              }
            />
          )
        }
        rightBottomPanel={
          <TestBlock
            ref={testBlockRef}
            testCaseData={testCaseData}
            resultData={runResultdata}
            onChange={setCaseData}
            onRun={() => {
              runHandle.current = 1;
              setCheckLoading(true);
              codeRun({
                questionId,
                language: 'java',
                submittedCode: code,
                source: 2,
                testCases: testCaseData,
              });
            }}
            onSubmit={() => {
              runHandle.current = 2;
              setCheckLoading(true);
              codeSubmit({
                questionId,
                language: 'java',
                submittedCode: code,
                source: 2,
              });
            }}
            resultLoading={checkLoading}
          />
        }
      />
      <QuestionDraw
        selectKey={questionId}
        open={open}
        onClose={() => setOpen(false)}
        data={questionsList?.list ?? []}
        onClick={(question: any) => {
          setOpen(false);
          history.push(`/problems/${question.questionId}/description`);
        }}
      />
    </>
  );
}
