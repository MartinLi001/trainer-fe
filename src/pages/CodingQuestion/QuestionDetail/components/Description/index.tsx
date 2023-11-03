import Quill from '@/components/Quill';
import { UploadPreviewQues } from '@/pages/AddQuestion/components/PreviewBar';
import { AuTag } from '@aurora-ui-kit/core';
import { FrequencyConfig } from '@/constants';
import { useRequest } from 'ahooks';
import { getQuestionDetail } from '@/services/question';
import styles from './index.less';
import { useParams } from 'umi';
import { Spin } from 'antd';

const DiffcultyConfig = {
  Easy: 'green',
  Medium: 'yellow',
  Hard: 'red',
};

export default function Description() {
  const { id: questionId } = useParams<{ id: string }>();

  const { loading, data } = useRequest(() => getQuestionDetail(questionId));

  const renderTag = (list: string[]) => {
    return list?.map((client: string) => <AuTag key={client}>{client}</AuTag>);
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.card}>
        <Quill
          style={{
            height: 'auto',
            backgroundColor: '#fff',
          }}
          content={data?.description?.renderedContent}
          id={data?.questionId}
          readOnly
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {data?.difficulty && (
            <AuTag type="contained" theme={DiffcultyConfig[data?.difficulty]} style={{ margin: 0 }}>
              {data?.difficulty}
            </AuTag>
          )}
          {data?.frequency && (
            <AuTag type="contained" theme={DiffcultyConfig[data?.difficulty]} style={{ margin: 0 }}>
              <img src={FrequencyConfig[data?.frequency]} alt="" />
            </AuTag>
          )}

          {renderTag(data?.clients)}
        </div>

        {data?.resources?.length > 0 && (
          <div className={styles.downloadFile}>
            <p className={styles.downloadTitle}>Attachment:</p>
            <UploadPreviewQues
              questionId={data?.questionId}
              data={data?.resources || []}
              downIcon={true}
            />
          </div>
        )}

        <Quill
          style={{
            height: 'auto',
            backgroundColor: '#fff',
          }}
          content={data?.sampleAnswer?.renderedContent}
          id={data?.questionId}
          readOnly
        />
      </div>
    </Spin>
  );
}
