import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { generateResource, getFile } from '@/services/question';
import ReactQuill, { Quill } from 'react-quill';
import HighlightJS from 'highlight.js';
import modules from './config';
import loadingImg from '@/assets/loading.gif';
import imageResize from 'quill-image-resize-module';
import 'react-quill/dist/quill.snow.css';
import 'highlight.js/styles/default.css';
import './index.less';

import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import csharp from 'highlight.js/lib/languages/csharp';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import http from 'highlight.js/lib/languages/http';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';

HighlightJS.registerLanguage('java', java);
HighlightJS.registerLanguage('javascript', javascript);
HighlightJS.registerLanguage('json', json);
HighlightJS.registerLanguage('shell', shell);
HighlightJS.registerLanguage('sql', sql);
HighlightJS.registerLanguage('typescript', typescript);
HighlightJS.registerLanguage('csharp', csharp);
HighlightJS.registerLanguage('python', python);
HighlightJS.registerLanguage('css', css);
HighlightJS.registerLanguage('scss', scss);
HighlightJS.registerLanguage('http', http);
HighlightJS.registerLanguage('swift', swift);
HighlightJS.registerLanguage('kotlin', kotlin);

Quill.register('modules/imageResize ', imageResize);
const Image = Quill.import('formats/image');
const Delta = Quill.import('delta');
Image.sanitize = function (url: string) {
  return url;
};
interface NewAddResourceListProps {
  filename: string;
  resourceId: string;
  file: any;
  url: string;
}

const localImageList = {};
/**
 *
 * @param props style={{height: 500}}
 * @param ref  QuillRef.current.setContent  设置内容
 * QuillRef.current.getContent();  返回值为编辑器内容
 */
function QuillCom(props: any, ref: any) {
  const reactQuillRef = useRef<any>();
  const reactQuillInstance = useRef<any>();
  const allOriginResourceId = useRef<any>([]);

  // 新增资源列表
  const newAddResourceList = useRef<NewAddResourceListProps[]>([]);

  const addEventListener = (fileInput: any) => {
    // 若上传文件不为空
    const quillEditor = reactQuillInstance.current;
    if (fileInput.files != null && fileInput.files[0] != null) {
      const file = fileInput.files[0];

      const reader = new FileReader();

      // reader.onload = async (e: ProgressEvent<FileReader>) => {
      reader.onload = async () => {
        // 为图片创建本地url
        const imageUrl = URL.createObjectURL(file);
        // 得到编辑器中光标所在的位置
        const range = quillEditor.getSelection(true);
        // 若本地缓存中不存在相同文件名图片
        // if (!localImageList[file.name]) {
        // 从API获取新的资源ID
        const { resourceId } = (await generateResource(file.name)) ?? {};
        newAddResourceList.current.push({
          file,
          resourceId,
          url: imageUrl,
          filename: file.name,
        });

        // 将图片插入到编辑器中, 并将图片的资源ID写入到图片的alt属性中
        quillEditor.updateContents(
          new Delta()
            .retain(range.index)
            .delete(range.length)
            .insert({ image: imageUrl }, { alt: `data-id:${resourceId}` }),
          'user',
        );
        fileInput.value = '';
        // 移动光标到插入图片后的位置
        quillEditor.setSelection(quillEditor.getSelection().index + 1, 0);
        // 将图片信息 ({文件名: 资源ID}) 添加到本地缓存
        localImageList[file.name] = resourceId;
        // }
        // 若本地缓存中存在相同文件名图片
        // else {
        //   // 从本地缓存中获取该图片的资源ID，并将图片的资源ID写入到图片的alt属性中
        //   quillEditor.insertEmbed(range.index, 'image', (e.target as FileReader).result);
        //   fileInput.value = '';
        //   // 移动光标到插入图片后的位置
        //   quillEditor.setSelection(quillEditor.getSelection().index + 1, 0);
        // }
      };
      // 将图片文件读取为base64格式
      reader.readAsDataURL(file);
      //   window.URL.revokeObjectURL(fileInput.value);
    }
  };

  const imageHandler = () => {
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute(
      'accept',
      'image/png, image/gif, image/jpeg, image/svg+xml, image/bmp, image/x-icon',
    );
    // fileInput.classList.add('ql-image');
    fileInput.addEventListener('change', () => addEventListener(fileInput));
    fileInput.click();
  };

  const addImageHandler = () => {
    reactQuillInstance.current.getModule('toolbar').addHandler('image', imageHandler);
  };

  const onSave = () => {
    // 清空本地缓存中的图片信息
    // newAddResourceList.current = [];

    // 选择所有img标签中的alt属性为data-id:开头的图片
    const images = document.querySelectorAll(`div.ql-container.ql-snow img[alt^="data-id:"]`);

    // 创建finalImageIds数组，用来储存最终所有图片的资源ID
    const finalImageIds: string[] = [];

    // 遍历上一步中得到的图片
    for (let i = 0; i < images.length; i++) {
      // 从图片的alt属性中获取图片的资源ID
      const dataId = images[i].getAttribute('alt')?.replace('data-id:', '') as string;

      // 将图片的src属性替换为静态加载gif图片
      images[i].setAttribute('src', 'assets/images/loading.gif');

      // 将图片的资源ID添加到finalImageIds数组中
      finalImageIds.push(dataId);
    }

    // 从insertedResources数组中移除还未保存就已经删除的图片
    newAddResourceList.current = newAddResourceList.current.filter((resource) =>
      finalImageIds.includes(resource.resourceId),
    );

    // 将编辑器中的初始图片资源和最终图片资源比对，找到所有被删除的图片资源ID
    // removedImageIds.current = this.prevImages.filter((img) => !finalImageIds.includes(img));

    // 得到编辑器最终生成的HTML代码
    // return reactQuillInstance.current.root.innerHTML;

    // 得到编辑器最终生成的HTML代码和上传图片的资源
    return {
      file: newAddResourceList.current?.map(({ file }: NewAddResourceListProps) => file) || [],
      renderedContent: reactQuillInstance.current.root.innerHTML,
      removedResourceIds: allOriginResourceId.current.filter(
        (resourceId: string) => !finalImageIds.includes(resourceId),
      ),
      resourceList:
        newAddResourceList.current?.map(({ resourceId, filename }: NewAddResourceListProps) => ({
          resourceId,
          name: filename,
        })) ?? [],
    };
  };

  const registeClipboard = () => {
    if (!props.id) {
      console.log('questionId Error');
      return;
    }

    const matchers = reactQuillInstance.current.clipboard.matchers;
    // 重复注册addMatcher时会执行多次回调，所以每次注册前先清除所有已经注册的 img
    reactQuillInstance.current.clipboard.matchers = matchers.filter(
      ([type]: any) => type !== 'img',
    );

    reactQuillInstance.current.clipboard.addMatcher('img', (node: HTMLElement, delta: any) => {
      // 获取图片的src属性
      const src = node.getAttribute('src');

      // 获取图片的alt属性
      const alt = node.getAttribute('alt');

      // 若图片的alt属性包含'data-id'字段且图片的src属性为loading.gif
      // 则表示该图片为已经上传到服务器的图片，需要将其替换为真实的图片资源
      if (alt?.includes('data-id:') && src === 'assets/images/loading.gif') {
        // node.setAttribute('src', loadingImg);
        delta.ops[0].insert.image = loadingImg;
        const imageId = alt.replace('data-id:', '');
        // 从服务器获取该资源ID对应的图片
        getFile(props.id, imageId)
          .then((fileBlob: any) => {
            // 生成图片本地url
            const url = URL.createObjectURL(fileBlob);
            // 获取所有HTML中data-id为此资源ID的img标签
            // 将所有获取到的img标签的src属性替换为生成的url
            const fetchedImages = document.querySelectorAll(
              `div.ql-container.ql-snow img[alt='data-id:${imageId}']`,
            );

            if (fetchedImages) {
              fetchedImages.forEach((img) => img.setAttribute('src', url));
            }
          })
          .catch(() => {
            // 获取所有HTML中data-id为此资源ID的img标签
            // 将所有获取到的img标签的src属性替换为生成的url
            const fetchedImages = document.querySelectorAll(
              `div.ql-container.ql-snow img[alt='data-id:${imageId}']`,
            );
            if (fetchedImages) {
              fetchedImages.forEach((img) => img.parentNode?.removeChild(img));
            }
          });
      }
      return delta;
    });
  };

  useEffect(() => {
    if (reactQuillRef.current && reactQuillRef.current.getEditor) {
      let toolbarHeight = 0;
      if (!props.readOnly) {
        toolbarHeight = (document.querySelectorAll('.ql-toolbar')[0] as HTMLElement).offsetHeight;
      }
      document.querySelectorAll('.ql-container').forEach((item: any) => {
        const originH = props?.style?.height;
        if (originH !== 'auto') {
          const h = parseInt(`${+originH.replace('px', '') - toolbarHeight}`);
          item.style.height = h + 'px';
        }
      });

      reactQuillInstance.current = reactQuillRef.current.getEditor();

      if (!props.readOnly) addImageHandler();
      registeClipboard();
    }
  }, [props.id]);

  const setContent = (content: string = '') => {
    reactQuillInstance.current.pasteHTML(content);
    const dataIdAttr = content?.match(/\alt\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i);
    if (dataIdAttr?.[1]) {
      allOriginResourceId.current.push(dataIdAttr?.[1].replace('data-id:', ''));
    }

    const codes = document.querySelectorAll('pre');
    codes.forEach((el) => {
      HighlightJS.highlightElement(el as HTMLElement);
    });
  };

  useImperativeHandle(ref, () => ({
    getContent: onSave,
    setContent,
  }));

  useEffect(() => {
    if (props.content) {
      setContent('');
      setContent(props.content);
      return;
    }
    setContent('');
  }, [props.content]);

  return (
    <ReactQuill
      ref={(el) => {
        reactQuillRef.current = el;
      }}
      style={{
        height: 'auto',
        backgroundColor: '#fff',
      }}
      {...props}
      theme="snow"
      // onChange={console.log}
      modules={!props.readOnly ? modules : { toolbar: false }}
    />
  );
}

export default forwardRef(QuillCom) as any;
