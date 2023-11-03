import React, { useMemo } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import style from './ProjectGroups.less';
import type { ProjectGroupMemberItem, ProjectGroupsItem } from '../interface';
import { cloneDeep } from 'lodash';

const { Panel } = Collapse;

interface Props {
  projectGroups: ProjectGroupsItem[];
  allTrainees: ProjectGroupMemberItem[];
}

export default function Groups(props: Props) {
  const { projectGroups, allTrainees } = props;
  const header = (group: ProjectGroupsItem) => {
    const temp = group.projectGroupMembers?.find((item) => item.role === 'Leader');
    return (
      <>
        <div className={style.role}>Group Leader</div>
        <div className={style.name}>
          {temp?.firstName || temp?.firstname} {temp?.lastName || temp?.lastname}
        </div>
      </>
    );
  };
  const member = (group: ProjectGroupsItem) => {
    return (
      <>
        <div className={style.role}>Member</div>
        <div className={style.listBox}>
          {group?.projectGroupMembers?.map(
            (item) =>
              item.role === 'Member' && (
                <div className={style.name} key={item.userId + '_display_member'}>
                  {item.firstName || item.firstname} {item.lastName || item.lastname}
                </div>
              ),
          )}
        </div>
      </>
    );
  };
  const UnassignedTip = useMemo(() => {
    if (!projectGroups?.length) return;
    const temp = cloneDeep(allTrainees);
    // 找出所有未选的学员
    projectGroups.forEach((group) =>
      group.projectGroupMembers.forEach((item) => {
        const index = temp.findIndex((i: any) => i.userId === item.userId);
        if (index > -1) temp.splice(index, 1);
      }),
    );
    return (
      !!temp?.length && (
        <div className={style.unassigned}>
          {temp.length} Trainee(s) unassigned, please edit groups
        </div>
      )
    );
  }, [projectGroups, allTrainees]);
  return (
    <div className={style.groupMemberList}>
      {UnassignedTip}
      <Collapse
        bordered={false}
        className={style.collapse}
        expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? -180 : 0} />}
        expandIconPosition="end"
        // collapsible="header"
      >
        {projectGroups?.map((item) => (
          <Panel
            className={style.panel}
            header={header(item)}
            key={item.projectGroupId + '_display_group'}
          >
            {member(item)}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
}
