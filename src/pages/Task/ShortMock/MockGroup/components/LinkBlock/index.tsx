import IconFont from '@/components/IconFont';
import SeeButton from '@/components/SeeButton';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import { TaskResponse } from '@/pages/Task/mock/typeList';
import styles from './index.less';
import { attendantsType, mockGroupsType } from '../../../typeList';
import { linkURL } from '@/utils';

export default function LinkBlock({
  loading = false,
  data,
  activeKey,
  onSave = () => {},
}: {
  loading: boolean;
  activeKey: string;
  data: TaskResponse;
  onSave: (value: mockGroupsType) => void;
}) {
  const [editGroup, setEditGroup] = useState<mockGroupsType>({} as mockGroupsType);
  const [edit, setEdit] = useState(false);

  const getMeetingLink = () =>
    data?.mockGroups?.find((group) => {
      // 一对一时 activeKey 是教师的 userId, 普通组时是 mockGroupId
      if (data?.isOneOnOne) {
        return (group?.host as attendantsType)?.userId === activeKey;
      }
      return group?.mockGroupId === activeKey;
    }) as mockGroupsType;

  useEffect(() => {
    const nowGroup = getMeetingLink();
    setEditGroup(nowGroup);
    setEdit(false);
  }, [data, activeKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: meetingLink } = e.target;
    setEditGroup({
      ...editGroup,
      meetingLink,
    });
  };

  function LinkContent() {
    const link = editGroup?.meetingLink ?? '';
    if (!edit) {
      if (link?.trim()) {
        return (
          <a
            target="_blank"
            href={linkURL(link)}
            rel="noreferrer"
            style={{ wordBreak: 'break-all' }}
          >
            {link}
          </a>
        );
      }
      return <span className={styles.noLink}>N/A</span>;
    }
    return (
      <>
        <Input onChange={handleChange} autoFocus value={link} />
        <SeeButton
          type="primary"
          loading={loading}
          style={{ margin: '0 10px' }}
          onClick={() => onSave(editGroup)}
        >
          Save
        </SeeButton>
        <SeeButton
          onClick={() => {
            setEdit(false);
            setEditGroup(getMeetingLink());
          }}
        >
          Cancel
        </SeeButton>
      </>
    );
  }

  return (
    <>
      <div className={styles.title}>
        Meeting Link
        <span
          className={styles.icon}
          onClick={() => {
            setEdit(true);
          }}
        >
          <IconFont style={{ fontSize: 18 }} type="icon-edit-line" />
        </span>
      </div>
      <div className={styles.content}>
        <LinkContent />
      </div>
    </>
  );
}
