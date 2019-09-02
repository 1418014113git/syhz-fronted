const moduleName = process.env.SYHZ_MODULE
const ATTACHMENTMODULE = process.env.ATTACHMENT_MODULE
const FILEMODULE = process.env.FILE_MODULE

const exportTemplateUrl = ATTACHMENTMODULE + 'file/downloadTemplate/'
const exportDataUrl = moduleName + 'excel/exporFile/'
const importUrl = moduleName + 'excel/uploadFile'
const exportAuthenDocUrl = moduleName + 'authenticate/doc'
const downLoadFile = moduleName + 'file/attachment/file/'
const exportModuleName = moduleName
const downloadFileUrl = FILEMODULE // nginx配置的文件下载
export default {
  exportTemplateUrl,
  exportDataUrl,
  importUrl,
  exportAuthenDocUrl,
  downLoadFile,
  downloadFileUrl,
  exportModuleName // 用户操作检查表导出
}
