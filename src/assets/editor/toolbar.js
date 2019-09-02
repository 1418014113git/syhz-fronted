import * as Quill from 'quill'  //引入编辑器
var fonts = ['SimSun', 'SimHei','Microsoft-YaHei','KaiTi','FangSong','Arial'];
var sizes = ['14px','16pt','18px','20px','22px','24px','26px'];
var Font = Quill.import('formats/font');
var Size = Quill.import('attributors/style/size');
Size.whitelist = sizes;
Font.whitelist = fonts; //将字体加入到白名单
Quill.register(Font, true);
Quill.register(Size, true);
let defaultToolbar = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
  ['blockquote', 'code-block'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'header': [false, 1, 2, 3, 4, 5, 6, ] }],
  [{'size': sizes }], // 文字大小
  [{ 'font': fonts}], // 字体
  ['link', 'image'],
  [{'clean':'清除文字样式'}],  // remove formatting button
]
export default defaultToolbar
