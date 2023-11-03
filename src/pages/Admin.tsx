import React, { useRef, useCallback } from 'react';
import { Button, Space, Select } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import SeeButton from '@/components/SeeButton';
import Quill from '@/components/Quill';
import CodeMirror from '@/components/CodeMirror';
const { Option } = Select;
export default (): React.ReactNode => {
  const QuillRef = useRef<any>();

  const onSave = () => {
    // QuillRef.current.getContent();
    QuillRef.current.setContent(
      `<p>(The following section, we provide DFS solution, please search online for BFS solution)</p><p><br></p><pre class="ql-syntax" spellcheck="false">/**
public class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;

    TreeNode(int val) {
        this.val = val;
    }

    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
*/�

public void inorderTraversal(TreeNode root, List&lt;Integer&gt; res) {
if(root == null) {
    return;
}

inorderTraversal(root.left, res);
res.add(res.val);
}

public void insert(TreeNode root, int val) {
if(root == null) return new TreeNode(val);
if(val &gt; root.val) = insert(root.right, val); // continue searching in the right subtree
else root.left = insert(root.left, val);      // continue searching in the left subtree
return root;
}

public boolean contains(TreeNode root, int val) {
if(root == null) return false;
return root.val == val &amp;&amp; contains(root.left, val) &amp;&amp; contains(root.right, val);
}
</pre>`,
    );
  };

  const list = ['default', 'primary', 'warning', 'danger', 'ghost', 'link'].map((type: any) => (
    <div>
      <h3>{type}</h3>
      <Space>
        <SeeButton
          type={type}
          disabled
          onClick={() => {
            console.log('sfsfsafsfsdfsdf');
          }}
        >
          Label
        </SeeButton>
        <SeeButton
          onClick={() => {
            console.log('sfsfsafsfsdfsdf');
          }}
          type={type}
          icon={<SearchOutlined />}
        >
          Label
        </SeeButton>
        <SeeButton type={type} loading>
          Label
        </SeeButton>
        <SeeButton type={type} loading></SeeButton>
        <SeeButton type={type} shape="circle">
          A
        </SeeButton>
        <SeeButton type={type} shape="circle" icon={<SearchOutlined />} />
        <SeeButton type={type} shape="circle">
          A
        </SeeButton>
        <SeeButton type={type} shape="round" icon={<DownloadOutlined />}>
          Download
        </SeeButton>
      </Space>
    </div>
  ));

  const codeRef = useRef<any>();

  const handleChange = useCallback((mode: string) => {
    codeRef.current?.setOption(mode);
    codeRef.current?.clear();
  }, []);

  return (
    <PageContainer>
      <div>
        <Select defaultValue="Java" style={{ width: 120 }} onChange={handleChange}>
          <Option value="text/x-java">Java</Option>
          <Option value="javascript">JavaScript</Option>
          <Option value="text/x-sql">SQL</Option>
          <Option value="text/x-python">Python</Option>
          <Option value="text/x-csharp">C#</Option>
          <Option value="Swift">Swift</Option>
          <Option value="Kotlin">Kotlin</Option>
        </Select>
        <CodeMirror ref={codeRef} />
        {list}
        <Quill
          ref={QuillRef}
          style={{
            height: 400,
            backgroundColor: '#fff',
          }}
          readOnly
        />
      </div>
      <Button onClick={onSave}> save </Button>
      {/* </Card> */}
    </PageContainer>
  );
};
