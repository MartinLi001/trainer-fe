import { Modal } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import SeeButton from '@/components/SeeButton';

interface ModalPropsType {
  type: 'category' | 'batch';
  action: string | undefined;
  onCancel: () => void;
  onSave: () => void;
  open: boolean;
  loading?: boolean;
}
export default function ArchiveModal({
  type = 'category',
  action = 'archive',
  open,
  loading,
  onCancel,
  onSave,
}: ModalPropsType) {
  if (action !== 'archive' && action !== 'restore') return null;

  const Config = {
    category: {
      restore: {
        title: 'Restore Batch Category',
        subtitle: 'Are you sure of restoring the batch category?',
        content: 'After restoring, the batch category will appear in the active categories.',
        okText: 'Restore',
      },
      archive: {
        title: 'Archive Batch Category',
        subtitle: 'Are you sure of archiving the batch category?',
        content:
          'Before this action, please make sure that all bathes in this batch category are archived.',
        okText: 'Archive',
      },
    },
    batch: {
      restore: {
        title: 'Restore Batch',
        subtitle: 'Are you sure of restoring the batch?',
        content: 'After restoring, the batch will appear in the active batches.',
        okText: 'Restore',
      },
      archive: {
        title: 'Archive Batch',
        subtitle: 'Are you sure of archiving the batch category?',
        content: 'After archiving, the batch can be found in the archived section. ',
        okText: 'Archive',
      },
    },
  };

  return (
    <Modal open={open} centered width={600} footer={null} closable={false} title={false}>
      <div style={{ fontSize: 16, fontFamily: 'Mulish' }}>
        <p style={{ fontWeight: 600, fontSize: 20 }}>
          <WarningOutlined style={{ marginRight: 12, color: '#faad14' }} />
          {Config[type][action].title}
        </p>
        <p style={{ fontWeight: 600 }}>{Config[type][action].subtitle}</p>
        <p>{Config[type][action].content}</p>
        <div style={{ textAlign: 'right' }}>
          <SeeButton type="default" style={{ marginRight: 8 }} onClick={onCancel}>
            Cancel
          </SeeButton>
          <SeeButton type="warning" onClick={onSave} loading={loading}>
            {Config[type][action].okText}
          </SeeButton>
        </div>
      </div>
    </Modal>
  );
}
