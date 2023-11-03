import { useState } from 'react';

import { Tabs, Spin } from 'antd';
import type { TabsProps } from 'antd';
import { useRequest } from 'ahooks';
import { useLocation, useParams, history } from 'umi';
import DrawerCom from './components/Drawer';
import Summary from './components/Summary';
import Description from './components/Description';
import Submission from './components/Submisson';
import { PageBreadCrumb } from '@/components/PageBreadCrumb';
import { queryQuestionSummary, querySubmissionDetail, querySubmissions } from '@/services/coding';
import styles from './index.less';
import { AuButton } from '@aurora-ui-kit/core';
import IconFont from '@/components/IconFont';

const QuestionDetail = () => {
  const { query, pathname } = useLocation() as any;

  const { id: questionId } = useParams<{ id: string }>();
  const [open, setOpen] = useState<boolean>(false);
  const [currentSubmissionIdIndex, setCurrentSubmissionIdIndex] = useState(0);

  const { loading, data } = useRequest(() => queryQuestionSummary({ questionId }));

  const {
    loading: submissonLoading,
    data: submissionData,
    run: submissonRun,
  } = useRequest(
    (params) =>
      querySubmissions({
        questionId,
        ...params,
      }),
    {
      manual: true,
    },
  );

  const {
    data: detailData,
    run: detailRun,
    loading: detailLoading,
  } = useRequest(querySubmissionDetail, { manual: true });

  const tabItems: TabsProps['items'] = [
    {
      key: 'description',
      label: `Description`,
      children: <Description />,
    },
    {
      key: 'submission',
      label: `Submission`,
      children: (
        <Submission
          fetch={submissonRun}
          data={submissionData}
          loading={submissonLoading}
          onRowClick={(submissionId: string) => {
            const index = submissionData?.list?.findIndex(
              (item: any) => item.submissionId === submissionId,
            );
            setCurrentSubmissionIdIndex(index);
            detailRun({
              questionId,
              submissionId,
            });
            setOpen(true);
          }}
        />
      ),
    },
  ];

  const tabKeys = tabItems.map((item) => item.key);

  const activeKey = tabKeys.includes(query.activeKey) ? query.activeKey : 'description';

  const onChange = (key: string) => {
    history.push(`${pathname}?activeKey=${key}`);
  };

  const onSwitch = (direction: number) => {
    const index = currentSubmissionIdIndex + direction;
    const { submissionId } = [...submissionData.list].splice(index, 1)[0];
    setCurrentSubmissionIdIndex(index);
    detailRun({
      questionId,
      submissionId,
    });
  };

  return (
    <div className={styles.container} id="codingContainer">
      <div className={styles.bread}>
        <PageBreadCrumb
          routes={[
            {
              href: '/coding',
              label: 'Coding Puzzles',
            },
            {
              label: data?.name ?? '',
            },
          ]}
        />
      </div>

      <Spin spinning={loading}>
        <Summary data={data} />
      </Spin>

      <div className={styles.tab}>
        <Tabs activeKey={activeKey} items={tabItems} onChange={onChange} />
      </div>

      <DrawerCom
        open={open}
        data={detailData}
        onClose={() => setOpen(false)}
        loading={detailLoading}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {currentSubmissionIdIndex <= 0 ? (
            <AuButton
              type="link"
              href="#disabled"
              disabled
              prefix={<IconFont type="icon-a-Iconscheveron-left-copy" />}
            >
              Previous
            </AuButton>
          ) : (
            <AuButton
              type="plain"
              prefix={<IconFont type="icon-a-Iconscheveron-left-copy" />}
              onClick={() => onSwitch(-1)}
            >
              Previous
            </AuButton>
          )}

          {currentSubmissionIdIndex >= submissionData?.list?.length - 1 ? (
            <AuButton
              type="link"
              href="#disabled"
              disabled
              suffix={<IconFont type="icon-a-Iconschevron-right" />}
            >
              Next
            </AuButton>
          ) : (
            <AuButton
              type="plain"
              suffix={<IconFont type="icon-a-Iconschevron-right" />}
              onClick={() => onSwitch(1)}
            >
              Next
            </AuButton>
          )}
        </div>
      </DrawerCom>
    </div>
  );
};

export default QuestionDetail;
