import React, { useCallback, useState } from 'react';
import styles from './tagManagement.less';
import IconFont from '@/components/IconFont';
import {
  getSubscriptionsClients,
  getTags,
  getTagsSearch,
  getTopicsList,
  removeClient,
  removeTag,
  removeTopic,
} from '@/services/question';
import CreateModal from './components/CreateModal';
import Box from './components/Box';

export default function TagManagement() {
  const [topics, setTopics] = useState<TagManagementI.TagItemI[]>([]);
  const [tags, setTags] = useState<TagManagementI.TagItemI[]>([]);
  const [clients, setClients] = useState<TagManagementI.TagItemI[]>([]);
  const [modalData, setModalData] = useState<TagManagementI.ModalDataI>({ open: false, type: '' });

  const initTopics = useCallback(
    () =>
      getTopicsList().then((res) => {
        setTopics(res.map((item: any) => ({ id: item.questionTopicId, name: item.topic })));
      }),
    [],
  );

  const initTags = useCallback(
    () =>
      getTags().then((res) => {
        setTags(
          res.tags.map((item: any) => ({
            id: item.questionTagId,
            name: item.tag,
            frequency: item.frequency,
          })),
        );
      }),
    [],
  );

  const initClients = useCallback(
    () =>
      getSubscriptionsClients().then((res) => {
        setClients(res.map((item: any) => ({ id: item.clientId, name: item.name })));
      }),
    [],
  );

  const onRemoveTopic = useCallback(
    (id: string) =>
      removeTopic({ questionTopicId: id }).then(() => {
        setTopics((old) => old.filter((i) => i.id !== id));
      }),
    [],
  );

  const onRemoveTag = useCallback(
    (id: string) =>
      removeTag({ questionTagId: id }).then(() => setTags((old) => old.filter((i) => i.id !== id))),
    [],
  );

  const onRemoveClient = useCallback(
    (id: string) =>
      removeClient(id).then(() => setClients((old) => old.filter((i) => i.id !== id))),
    [],
  );

  const onSearchTags = useCallback(
    (term: string) =>
      getTagsSearch({ term }).then((res) =>
        setTags(
          res.tags.map((item: any) => ({
            id: item.questionTagId,
            name: item.tag,
            frequency: item.frequency,
          })),
        ),
      ),
    [],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Question Bank</div>

      <Box
        initFunc={initTopics}
        type="topic"
        list={topics}
        icon={<IconFont type="icon-topics" />}
        clickCreate={() =>
          setModalData({
            open: true,
            type: 'topic',
            afterCreate: ({ questionTopicId, name }) => {
              const temp = topics;
              temp.unshift({ id: questionTopicId, name });
              setTopics(temp);
            },
            list: topics,
          })
        }
        onRemove={onRemoveTopic}
      />

      <Box
        type="tag"
        initFunc={initTags}
        list={tags}
        icon={<IconFont type="icon-pound" />}
        clickCreate={() =>
          setModalData({
            open: true,
            type: 'tag',
            afterCreate: ({ questionTagId, name }) => {
              const temp = tags;
              temp.unshift({ id: questionTagId, name });
              setTags(temp);
            },
            list: tags,
          })
        }
        onRemove={onRemoveTag}
        onSearch={onSearchTags}
      />

      <Box
        type="client"
        initFunc={initClients}
        list={clients}
        icon={<IconFont type="icon-office" />}
        clickCreate={() =>
          setModalData({
            open: true,
            type: 'client',
            afterCreate: ({ clientId, name }) => {
              const temp = clients;
              temp.unshift({ id: clientId, name });
              setClients(temp);
            },
            list: clients,
          })
        }
        onRemove={onRemoveClient}
      />

      <CreateModal
        open={modalData.open}
        type={modalData.type}
        onCancel={() => setModalData({ open: false, type: '' })}
        afterCreate={modalData.afterCreate}
        list={modalData.list}
      />
    </div>
  );
}
