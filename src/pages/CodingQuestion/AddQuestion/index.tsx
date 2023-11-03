import React, { useEffect, useMemo, useRef, useState } from 'react';
import style from './index.less';
import { Form, Input, InputRef, Select, Spin } from 'antd';
import Quill from '@/components/Quill';
import SeeButton from '@/components/SeeButton';
import TagNav from '@/components/TagNav';
import DropDownTag from './components/DropDownTag';
import TableList from './components/tableList';
import type {
  TagType,
  ClientsType,
  topicListType,
  // SearchData,
  SearchType,
  DetailValueType,
} from './typeList';
import type { RcFile } from 'antd/lib/upload';
import { useHistory, useParams } from 'umi';

import {
  QuestionList,
  getTopicsList,
  getClients,
  getTags,
  getClientsSearch,
  getTagsSearch,
  CreateQuestion,
  getQuestionDetail,
  UpdateQuestion,
  // getFile,
} from '@/services/question';
import { UploadPreview } from '@/components/PreviewBar';
import DetailsUpload from '@/components/DetailsUpload';
import type { UploadFile } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect, Dispatch, ConnectProps, QuestionCodingDetailModelState } from 'umi';
import { UploadPreviewQues } from './components/PreviewBar';
import { AuButton } from '@aurora-ui-kit/core';

const diffcultyList = [
  {
    name: 'Easy',
  },
  {
    name: 'Medium',
  },
  {
    name: 'Hard',
  },
];
const FrequencyList = [
  {
    name: 'Low',
  },
  {
    name: 'Medium',
  },
  {
    name: 'High',
  },
];
interface AddQuestionProps extends ConnectProps {
  idFromProp: string;
  onChange?: (value: boolean) => void;
  detailReducersList: Record<string, DetailValueType>;
  dispatch: Dispatch;
}
const { Option } = Select;
const AddQuestion: React.FC<AddQuestionProps> = ({
  idFromProp,
  detailReducersList,
  onChange,
  dispatch,
}) => {
  const { id: idFromUseParams } = useParams<{ id: string }>();
  const newQuestionId = useMemo(() => {
    if (idFromUseParams) return idFromUseParams;
    else if (idFromProp) return idFromProp;
    else return '';
  }, [idFromUseParams, idFromProp]);
  const [topicList, setTopicList] = useState<topicListType[]>([]);
  const [tagList, setTagList] = useState<TagType[]>([]);
  const [clientList, setClientList] = useState<ClientsType[]>([]);
  const [tagSearchType, setTagSearchType] = useState<string[]>([]);
  const [cliSearchType, setCliSearchType] = useState<string[]>([]);
  const ref = useRef<any>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // const [SearchDataList, setSearchDataList] = useState<DetailValueType[]>([]);
  // const [DataList, setDataList] = useState<DetailValueType[]>([]); // linked question data list
  const [questionData, setQuestionData] = useState<DetailValueType>();
  const [form] = Form.useForm();
  const history = useHistory();
  const QuillRef = useRef<any>();
  const QuillRefanswer = useRef<any>();
  const [type, setType] = useState('add');
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [removeIds, setRemoveIds] = useState<string[]>([]);
  const [orderNum, setOrderNum] = useState(''); // 储存题号，目前在dispatch时要用来拼name
  const titleInputRef = useRef<InputRef>(null);

  const getDetailValues = (questionid: string) => {
    if (questionid) {
      setLoading(true);
      getQuestionDetail(questionid)
        .then((res: DetailValueType) => {
          setOrderNum(res.name?.split('.')?.[0] || '');
          const leng = res.name.indexOf('.');
          res.name = res.name.substring(leng + 1).trim();
          setQuestionData(res);
          form.setFieldsValue(res);
          QuillRef.current.setContent(res.description.renderedContent);
          QuillRefanswer.current.setContent(res.sampleAnswer.renderedContent);
          setCliSearchType(res.clients || []);
          setTagSearchType(res.tags || []);
          // setDataList(res.linkedQuestions || []);
        })
        .finally(() => {
          setLoading(false);
          titleInputRef.current?.focus(); // 这样做是为了组织quill获取焦点导致页面滚动到底部
        });
    }
  };
  useEffect(() => {
    async function fetch() {
      const toplist = await getTopicsList();
      const talist = await getTags();
      const cllist = await getClients();
      // getQuestionList(SearchList);
      setTopicList(toplist);
      setTagList(talist.tags);
      setClientList(cllist);
    }
    fetch();
    if (newQuestionId == 'new') {
      setType('add');
    } else {
      setType('edit');
      getDetailValues(newQuestionId);
    }
    titleInputRef.current?.focus(); // 这样做是为了组织quill获取焦点导致页面滚动到底部
  }, []);

  const beforeUpload = (FileList: RcFile[]) => {
    setFileList(FileList);
  };

  const searchSlectCom = (key: string) => {
    if (!key || key == '') {
      getClients().then((res: any) => {
        setClientList(res);
      });
    } else {
      getClientsSearch({ term: key }).then((res: any) => {
        setClientList(res);
      });
    }
  };

  const searchSlectTag = (key: string) => {
    if (!key || key == '') {
      getTags().then((res: any) => {
        setTagList(res.tags);
      });
    } else {
      getTagsSearch({ term: key }).then((res: any) => {
        setTagList(res.tags);
      });
    }
  };
  const onChangeTag = (list: string[]) => {
    setTagSearchType([...list]);
  };
  const onChangeCom = (list: string[]) => {
    setCliSearchType([...list]);
  };
  const deleteTag = (typeTag: string, value: number) => {
    if (typeTag == 'tag') {
      const temptag = tagSearchType;
      temptag?.splice(value, 1);
      setTagSearchType([...temptag]);
    }
    if (typeTag == 'cli') {
      const tempcli = cliSearchType;
      tempcli?.splice(value, 1);
      setCliSearchType([...tempcli]);
    }
  };
  // const getQuestionList = (data: SearchType) => {
  //   QuestionList(data)
  //     .then((res: any) => {
  //       setSearchDataList(res.questions);
  //     })
  //     .catch(() => {
  //       setSearchDataList([]);
  //     });
  // };
  // const handleSearch = (newValue: string) => {
  //   const data = {
  //     pageNum: 0,
  //     pageSize: 10,
  //     criteria: [
  //       {
  //         field: 'name',
  //         value: newValue,
  //         values: [],
  //         operand: 'and',
  //       },
  //     ],
  //     sortCriteria: { field: 'sequenceNumber', order: 'desc' },
  //   };
  //   getQuestionList(data);
  // };
  // const handleChange = (newValue: string) => {
  //   const temp = [...DataList];
  //   const tempId = temp.filter((ite) => {
  //     return ite.questionId === newValue;
  //   });
  //   if (tempId.length > 0) return;
  //   SearchDataList.map((ite) => {
  //     if (ite.questionId == newValue) {
  //       temp.push(ite);
  //     }
  //   });

  //   setDataList([...temp]);
  //   setSearchDataList([]);
  // };
  // const DeleteQuestion = (id: string) => {
  //   const temp = DataList.filter((ite) => {
  //     return ite.questionId != id;
  //   });
  //   setDataList([...temp]);
  // };
  const onFinish = (values: any) => {
    const desQuill = QuillRef.current?.getContent();
    values.description = {
      renderedContent: desQuill?.renderedContent,
      linkedResourceIds: [],
    };

    const saQuill = QuillRefanswer.current?.getContent();
    values.sampleAnswer = {
      renderedContent: saQuill?.renderedContent,
      linkedResourceIds: [],
    };
    values.clients = [...cliSearchType];
    values.tags = [...tagSearchType];

    // const temp = DataList.map((ite) => {
    //   return ite.questionId;
    // });
    delete values.file;
    values.questionCategory = 1;
    // values.linkedQuestionIds = [...temp];
    values.addedResources = [...desQuill?.resourceList, ...saQuill.resourceList];

    const removeAllResource = [...desQuill.removedResourceIds, ...removeIds];
    if (type == 'edit') {
      values.questionId = newQuestionId;
      if (desQuill.removedResourceIds)
        values.removedResourceIds = [...desQuill.removedResourceIds, ...removeIds];
    }
    const formData = new FormData();
    if (fileList.length) {
      fileList.forEach((file) => {
        formData.append('attachments', file as RcFile);
      });
    }
    if (desQuill.file || saQuill.file) formData.append('images', desQuill.file ?? saQuill.file);

    formData.append('question', JSON.stringify({ ...values }));
    setLoadingButton(true);
    if (type == 'add') {
      CreateQuestion(formData).then((res) => {
        history.push(`/coding/${res.questionId}`);
        setLoading(false);
        if (onChange) onChange(false);
      });
    } else {
      UpdateQuestion(formData).then((res) => {
        const id = res.questionId;
        const tempP = { ...detailReducersList };
        console.log('%cindex.tsx line:265 removeAllResource', 'color: #007acc;', removeAllResource);
        values.resources = questionData?.resources?.filter((ite) => {
          return !removeAllResource.includes(ite.resourceId);
        });
        console.log('%cindex.tsx line:268 values', 'color: #007acc;', values);
        const detail = {
          ...values,
          name: `${orderNum}. ${values.name}`,
          resources: [...(values?.resources || []), ...(res?.resources || [])],
        };
        tempP[id] = detail;
        dispatch({
          type: 'Detail/updateData',
          payload: tempP,
        });
        history.push(`/coding/${res.questionId}`);
        setLoading(false);
        if (onChange) onChange(false);

        // getQuestionDetail(id).then((detail: DetailValueType) => {

        //
        // });
      });
    }
  };
  const removeAttachment = async (file: any) => {
    const temp = [...removeIds, file.resourceId];
    setRemoveIds([...temp]);
  };
  // const options = (SearchDataList || []).map((d) => <Option key={d.questionId}>{d.name}</Option>);
  return (
    <>
      {/* <PageHeader
        items={[
          { name: 'Question Bank', href: '/question' },
          { name: `${type === 'add' ? 'Create New ' : 'Edit '} Question` },
        ]}
      /> */}
      <Spin spinning={loading}>
        <div className={style.AddQuestion}>
          <Form
            name="basic"
            form={form}
            initialValues={{ remember: true }}
            layout="vertical"
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            onValuesChange={() => {
              if (onChange) onChange(true);
            }}
          >
            <Form.Item
              label="Puzzle Title"
              name="name"
              rules={[{ required: true, message: 'Please input your Puzzle Title!' }]}
            >
              <Input placeholder="enter the puzzle’s title" ref={titleInputRef} />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input your Description!' }]}
            >
              <Quill
                ref={QuillRef}
                style={{
                  backgroundColor: '#fff',
                  height: '360',
                }}
                id={newQuestionId}
                placeholder="Describe the puzzle’s requirement & context."
              />
            </Form.Item>
            <Form.Item
              // label="Topic"
              name="topic"
              rules={[{ required: true, message: 'Please input your topic!' }]}
            >
              <TagNav
                // showAll={true}
                list={topicList}
                prop={{ name: 'topic', id: 'topic' }}
                type="radio"
                label="Topic"
                formRequired={true}
              />
            </Form.Item>

            <Form.Item label="Attachment" name="file">
              <div className={style.ColdingMockuplad}>
                {type == 'edit' &&
                  questionData?.resources &&
                  questionData.resources?.length > 0 && (
                    <div className={style.downloadFile}>
                      <UploadPreviewQues
                        questionId={questionData.questionId}
                        data={questionData.resources || []}
                        downIcon={true}
                        onRemove={removeAttachment}
                        exceptList={removeIds}
                      />
                      {/* {questionData.resources?.map((ite) => {
                      return (
                        <SeeButton
                          icon={<DownloadOutlined />}
                          type="ghost"
                          onClick={() =>
                            downLoadFile(questionData.questionId, ite.resourceId, ite.name)
                          }
                        >
                          {' '}
                          {ite.name}{' '}
                        </SeeButton>
                      );
                    })} */}
                    </div>
                  )}
                <UploadPreview data={fileList} onRemove={ref.current?.onRemove} />
                <DetailsUpload ref={ref} beforeUpload={beforeUpload} accept={'.zip,.pdf'} />
              </div>
            </Form.Item>

            <Form.Item name="clients">
              <div className={style.FormShow}>
                <div className={style.FormShowLeft}>
                  <span className={style.FormShowTitle}>Company</span>
                  <DropDownTag
                    name={'Company'}
                    list={clientList}
                    value={cliSearchType}
                    prop={{ name: 'name', id: 'clientId' }}
                    onChange={onChangeCom}
                    search={searchSlectCom}
                  />
                </div>

                <div>
                  {cliSearchType.map((ite, index) => {
                    return (
                      <div className={style.tagShowList} key={index}>
                        {' '}
                        {ite}{' '}
                        <CloseOutlined
                          onClick={() => deleteTag('cli', index)}
                          style={{ marginLeft: 5, fontSize: 10, marginBottom: 1 }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </Form.Item>

            <Form.Item name="tags">
              <div className={style.FormShow}>
                <div className={style.FormShowLeft}>
                  <span className={style.FormShowTitle}>Tag</span>
                  <DropDownTag
                    name={'Tag'}
                    list={tagList}
                    value={tagSearchType}
                    prop={{ name: 'tag', id: 'questionTagId' }}
                    onChange={onChangeTag}
                    search={searchSlectTag}
                  />
                </div>
                <div>
                  {tagSearchType.map((ite, index) => {
                    return (
                      <div className={style.tagShowList} key={index}>
                        {' '}
                        {ite}{' '}
                        <CloseOutlined
                          onClick={() => deleteTag('tag', index)}
                          style={{ marginLeft: 5, fontSize: 10, marginBottom: 1 }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </Form.Item>

            <Form.Item
              name="difficulty"
              rules={[{ required: true, message: 'Please input your difficulty!' }]}
            >
              <TagNav
                list={diffcultyList}
                prop={{ name: 'name', id: 'name' }}
                type="radio"
                label="Difficulty"
                formRequired={true}
              />
            </Form.Item>
            <Form.Item
              name="frequency"
              rules={[{ required: true, message: 'Please input your frequency!' }]}
            >
              <TagNav
                list={FrequencyList}
                prop={{ name: 'name', id: 'name' }}
                type="radio"
                formRequired={true}
                label="Frequency"
              />
            </Form.Item>
            <Form.Item
              label="sampleAnswer"
              name="sampleAnswer"
              rules={[{ required: true, message: 'Please input your sampleAnswer!' }]}
            >
              <Quill
                ref={QuillRefanswer}
                style={{
                  backgroundColor: '#fff',
                  height: '360',
                }}
                id={newQuestionId}
                placeholder="Sample answer (rich editor)"
              />
            </Form.Item>
            {/* <Form.Item label="Linked Question" name="linkedQuestionIds">
              <Select
                showSearch
                placement={'topLeft'}
                value={'Search by question name'}
                placeholder={'Search by question name'}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearch}
                onSelect={handleChange}
                notFoundContent={''}
              >
                {options}
              </Select>
              {DataList && DataList.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <TableList list={DataList} onChange={DeleteQuestion} />
                </div>
              )}
            </Form.Item> */}

            <Form.Item>
              <div className={style.ButtonShow}>
                <AuButton
                  type="outlined"
                  className="codingPuzzleEditFooterCancelButton"
                  onClick={() => {
                    history.goBack();
                    // if (newQuestionId == 'newADD') {
                    //   history.goBack();
                    // } else {
                    //   history.push(`/question/${newQuestionId}`);
                    // }
                  }}
                >
                  Cancel
                </AuButton>
                <AuButton htmlType="submit" loading={loadingButton}>
                  {/* {type == 'add' ? 'Create Question' : 'save'} */}
                  Save
                </AuButton>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </>
  );
};

// export default AddQuestion;

export default connect(({ Detail }: { Detail: QuestionCodingDetailModelState }) => ({
  detailReducersList: Detail.data,
}))(AddQuestion);
