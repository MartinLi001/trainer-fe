import React, { useEffect, useRef, useState } from 'react';
import { Badge, Input, InputRef, Modal, Spin, Tabs, message } from 'antd';

import CodeMirrorCom from '@/components/CodeMirror6';
// import { AuInput } from '@aurora-ui-kit/core';
// import {  updateCodeFile, deleteCodeFile, addCodeFile } from '@/services/coder';
import styles from './CodeList.less';
import {
  getCodingLanguageFile,
  deleteCodingLanguageFile,
  addCodingLanguageFile,
  editCodingLanguageFile,
} from '@/services';
import EmptyCode from '@/components/emptyCodeShow';
import IconFont from '@/components/IconFont';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface tabCodeListTyep {
  nameChange: boolean;
  id: string;
  //   questionId?: string;
  language?: string;
  fileName: string;
  fileContent: string;
  isEditing?: boolean;
}
interface CodeListProps {
  changeNameFlag?: boolean;
  language?: 'js' | 'java' | 'cpp' | 'python' | 'csharp';
  addProps: {
    language: string;
    type: number;
  };
}
// * - 0 sample-solution
// * - 1 Dependency-file
// * - 2 input parse function
// * - 3 output parse function
// * - 4 assert parse function
function CodeList({ addProps, language = 'java', changeNameFlag = true }: CodeListProps) {
  const [activeKey, setActiveKey] = useState<string>();
  const [codeList, setCodeList] = useState<tabCodeListTyep[]>([]);
  const newTabIndex = useRef(0);
  const [codeShow, setCodeShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const myInput = useRef<InputRef>(null);

  const onChangeTabs = (newActiveKey: string) => {
    setActiveKey(parseInt(newActiveKey));
  };

  useEffect(() => {
    if (!addProps.language) return;
    setLoading(true);
    getCodingLanguageFile({ language: addProps.language, type: addProps.type })
      .then((res: any) => {
        setCodeList(res);
        setActiveKey(res[0].id);
      })
      .finally(() => setLoading(false));
  }, [addProps.language, addProps.type]);

  const add = () => {
    setLoading(true);
    let numberFile = newTabIndex.current++;
    codeList.map((ite) => {
      if (ite.fileName === `newFile${numberFile}`) {
        numberFile++;
      }
    });
    addCodingLanguageFile({
      ...addProps,
      fileName: `newFile${numberFile}`,
    })
      .then((res) => {
        const newPanes = [...codeList];
        newPanes.push({
          fileName: `newFile${numberFile}`,
          fileContent: '',
          id: res,
          nameChange: false,
        });
        setCodeList(newPanes);
        setActiveKey(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setCodeShow(false);
    if (activeKey) {
      setTimeout(() => {
        setCodeShow(true);
      }, 0);
    }
  }, [activeKey]);

  const remove = (targetKey: TargetKey) => {
    Modal.confirm({
      title: 'Confirm deleting the current file？',
      icon: <IconFont type="icon-a-iconerror" style={{ color: '#F14D4F' }} />,
      content: 'The file cannot be recovered after being deleted',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setLoading(true);
        return deleteCodingLanguageFile(targetKey as string)
          .then((res) => {
            let newActiveKey = activeKey;
            let lastIndex = -1;
            codeList.forEach((item, i) => {
              if (item.id === targetKey) {
                lastIndex = i - 1;
              }
            });
            const newPanes = codeList.filter((item) => item.id !== targetKey);
            if (newPanes.length && newActiveKey === targetKey) {
              if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].id;
              } else {
                newActiveKey = newPanes[0].id;
              }
            }
            /// delete targetKey
            setCodeList(newPanes);
            setActiveKey(newActiveKey);
          })
          .finally(() => {
            setLoading(false);
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  const changeName = (ite: tabCodeListTyep) => {
    if (!changeNameFlag) {
      return;
    }
    if (activeKey == ite.id) {
      let newPanes = codeList.map((item) => {
        if (item.id === activeKey) {
          item.nameChange = true;
        } else {
          item.nameChange = false;
        }
        return item;
      });
      setCodeList(newPanes);
      setTimeout(() => {
        myInput.current.focus();
      });
    }
  };
  const saveName = (e: any, code: tabCodeListTyep) => {
    if (e.target.value == '' || e.target.value == code.fileName) {
      let newPanes = codeList.map((item) => {
        if (item.id === code.id) {
          item.nameChange = false;
        }
        return item;
      });
      setCodeList(newPanes);
      return;
    }
    let newPanes = codeList.map((item) => {
      if (item.id === code.id) {
        item.nameChange = false;
        item.fileName = e.target.value;
        const submitData = {
          id: item.id,
          fileName: e.target.value,
          fileContent: item.fileContent,
        };
        editCodingLanguageFile(submitData).then((res) => {
          message.success('Success');
        });
      }
      return item;
    });
    setCodeList(newPanes);
  };
  const onChangeCode = (value: string, code: tabCodeListTyep) => {
    let newPanes = codeList.map((item) => {
      if (item.id === code.id) {
        item.nameChange = false;
        item.fileContent = value;
        item.isEditing = true;
      }
      return item;
    });
    setCodeList(newPanes);
  };
  const autoSave = (value: string) => {
    let newPanes = codeList.map((item) => {
      if (item.id === activeKey) {
        item.isEditing = false;
        // submitData.id = item.id;
        // submitData.fileName = item.fileName;
        const submitData = {
          id: item.id,
          fileName: item.fileName,
          fileContent: value,
        };
        editCodingLanguageFile(submitData).then((res) => {
          // message.success('修改成功');
        });
      }
      return item;
    });
    setCodeList(newPanes);
  };
  return (
    <div className={styles.codeList}>
      <Spin spinning={loading}>
        {codeList.length > 0 ? (
          <Tabs
            type="editable-card"
            onChange={onChangeTabs}
            activeKey={activeKey}
            onEdit={onEdit}
            items={(codeList || []).map((ite) => {
              return {
                label: (
                  <>
                    {ite.nameChange ? (
                      <Input
                        defaultValue={ite.fileName}
                        onBlur={(e) => saveName(e, ite)}
                        style={{ width: '100px' }}
                        ref={myInput}
                      />
                    ) : (
                      <div onClick={() => changeName(ite)} className={styles.codeTabs}>
                        <Badge
                          dot={true}
                          offset={[12, 12]}
                          color={ite.isEditing ? '#FF4D4F' : '#52C41A'}
                        >
                          <span
                            className={`${
                              activeKey == ite.id ? styles.tabsNameChoose : styles.tabsName
                            }`}
                          >
                            {ite.fileName}
                          </span>
                        </Badge>
                      </div>
                    )}
                  </>
                ),
                key: ite.id,
                children: (
                  <div className={styles.codeFileShow}>
                    {codeShow && (
                      <CodeMirrorCom
                        language={language}
                        codeValue={ite.fileContent || ''}
                        onChange={(value: string) => onChangeCode(value, ite)}
                        autoSaveCode={autoSave}
                      />
                    )}
                  </div>
                ),
              };
            })}
          />
        ) : (
          <EmptyCode
            type={addProps.type == 0 ? 3 : 4}
            addFile={() => {
              add();
            }}
          />
        )}
      </Spin>
    </div>
  );
}

export default CodeList;
