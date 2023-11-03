import { history, useParams } from 'umi';
import { FrequencyConfig } from '@/constants';
import styles from './index.less';
import { AuButton, AuTag } from '@aurora-ui-kit/core';
import IconFont from '@/components/IconFont';
import { useCallback, useState } from 'react';

function RenderTag({ data }: any) {
  const [isMore, setIsMore] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const blockEle = useCallback((node: any) => {
    if (node) {
      console.log(node.scrollHeight, '====node.scrollHeight');
      setShowMore(node.scrollHeight > 32);
    }
  }, []);

  if (!data?.length) return <>N/A</>;
  return (
    <div className={styles.tags}>
      <div
        ref={blockEle}
        style={{
          height: showMore && isMore ? 35 : 'auto',
          overflow: showMore && isMore ? 'hidden' : 'auto',
        }}
      >
        {data?.map((client: string) => (
          <AuTag key={client}>{client}</AuTag>
        ))}
      </div>
      {showMore && (
        <AuButton type="link" onClick={() => setIsMore(!isMore)}>
          {isMore ? 'More' : 'Less'}
        </AuButton>
      )}
    </div>
  );
}

export default function Summary({ data }: any) {
  const { id } = useParams<{ id: string }>();

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.title}>{data?.name ?? 'N/A'}</span>
        <AuButton
          variant="gray"
          prefix={<IconFont type="icon-a-iconsettings" />}
          onClick={() =>
            history.push({
              pathname: '/coding/coder',
              query: {
                questionId: id,
                questionName: data.name,
              },
            })
          }
        />
      </div>
      <div className={styles.bottom}>
        <div className={styles.block}>
          <span className={styles.name}>Pass Rate</span>
          <span className={styles.value}>{data?.passRate >= 0 ? `${data.passRate}%` : 'N/A'}</span>
        </div>
        <div className={styles.block}>
          <span className={styles.name}>Success / Submission</span>
          <span className={styles.value}>
            {data?.success ?? 0}
            <span className={styles.small}>/</span>
            <span className={styles.small}>{data?.total ?? 0}</span>
          </span>
        </div>
        <div className={styles.block}>
          <span className={styles.name}>Frequency</span>
          <span className={styles.value} style={{ height: 36 }}>
            {data?.frequency ? (
              <img width={24} src={FrequencyConfig[data?.frequency]} alt="" />
            ) : (
              'N/A'
            )}
          </span>
        </div>
        <div className={styles.block}>
          <span className={styles.name}>Tags</span>
          <span className={styles.value}>
            <RenderTag data={data?.tags} />
          </span>
        </div>
        <div className={styles.block}>
          <span className={styles.name}>Company</span>
          <span className={styles.value}>
            <RenderTag data={data?.clients} />
          </span>
        </div>
      </div>
    </div>
  );
}
