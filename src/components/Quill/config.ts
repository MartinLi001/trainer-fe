export default {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code', 'code-block'],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [
      {
        size: ['small', false, 'large', 'huge'],
      },
    ],
    [
      {
        color: [],
      },
      {
        background: [],
      },
    ],
    [{ font: [] }],
    ['link', 'image'],
    ['clean'],
  ],
  imageResize: {
    //添加
    displayStyles: {
      backgroundColor: 'black',
      border: 'none',
      color: 'white',
    },
    modules: ['Resize', 'DisplaySize', 'Toolbar'],
  },
};
