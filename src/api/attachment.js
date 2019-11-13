const attachmentModule = process.env.ATTACHMENT_MODULE
const uploadFileUrl = attachmentModule + 'file/uploadFile'
const getVideoUrl = attachmentModule + 'file/attachmentList'
const uploadFilesUrl = attachmentModule + 'file/uploadFiles'
const tipText = '支持上传txt、doc、docx、xls、xlsx、pdf、jpg、png、zip、rar格式文件，且单个文件大小不超过500M'
const tipTextImg = '只能上传png、jpg、jpeg、bmp格式文件，且大小不超过500M'
const tipTextOther = '只能上传doc、docx、zip、rar、pdf格式文件，且大小不超过500M'
const tipTextNoWs = '只能上传doc、docx、zip、rar、pdf、png、jpg、jpeg、bmp格式文件，且大小不超过500M'
const tipText_Notice_size = '点击或将文件拖拽到这里上传，最多10个，单个文件最大500M'
const tipText_Notice_style = '支持扩展名：.rar .zip .doc .docx .pdf .jpg .xls .xlsx...'
// const tipText_Notice = '只能上传rar、zip、doc、docx、pdf、jpg、xls、xlsx格式文件，最多10个，单个文件大小不超过500M'

function fileValid(file) {
  var num = 1024.00 // byte
  if (file.size) {
    // var fileM = (file.size / Math.pow(num, 2)).toFixed(2) + 'M'
    var fileM = (file.size / Math.pow(num, 2)).toFixed(0)
    console.log(file.size + ',' + fileM)
    if (parseInt(fileM) > 500) {
      return '上传txt、doc、docx、xls、xlsx、pdf、jpg、png、zip、rar格式文件，且大小不超过500M'
    }
  }
  const name = file.name.split('.')
  const arrayLength = name.length
  const fileType = name[arrayLength - 1]
  const reg = /^(txt)|(doc)|(docx)|(xls)|(xlsx)|(pdf)|(jpg)|(png)|(zip)|(rar)$/
  if (!reg.test(fileType)) {
    return '上传txt、doc、docx、xls、xlsx、pdf、jpg、png、zip、rar格式文件，且大小不超过500M'
  }
  return ''
}

function fileValid_Notice(file) {
  const num = 1024.00 // byte
  if (file.size) {
    const fileM = (file.size / Math.pow(num, 2)).toFixed(0)
    console.log(file.size + ',' + fileM)
    if (parseInt(fileM) > 500) {
      return '单个文件大小不超过500M'
    }
  }
  const name = file.name.split('.')
  const arrayLength = name.length
  const fileType = name[arrayLength - 1]
  const reg = /^(rar)|(zip)|(doc)|(docx)|(pdf)|(jpg)|(xls)|(xlsx)$/
  if (!reg.test(fileType)) {
    return '只支持上传rar、zip、doc、docx、pdf、jpg、xls、xlsx格式文件'
  }
  return ''
}

function imgValid(file) { // 仅图片
  var num = 1024.00 // byte
  if (file.size) {
    var fileM = (file.size / Math.pow(num, 2)).toFixed(0)
    console.log(file.size + ',' + fileM)
    if (parseInt(fileM) > 500) {
      return tipTextImg
    }
  }
  const name = file.name.split('.')
  const arrayLength = name.length
  const fileType = name[arrayLength - 1]
  const reg = /^(png)|(jpg)|(jpeg)|(bmp)$/
  if (!reg.test(fileType)) {
    return tipTextImg
  }
  return ''
}

function fileOtherValid(file) { // 除了图片 其他附件
  var num = 1024.00 // byte
  if (file.size) {
    var fileM = (file.size / Math.pow(num, 2)).toFixed(0)
    console.log(file.size + ',' + fileM)
    if (parseInt(fileM) > 500) {
      return tipTextOther
    }
  }
  const name = file.name.split('.')
  const arrayLength = name.length
  const fileType = name[arrayLength - 1]
  const reg = /^(doc)|(docx)|(pdf)|(zip)|(rar)$/
  if (!reg.test(fileType)) {
    return tipTextOther
  }
  return ''
}

function fileNoWsValid(file) { // 无文书
  var num = 1024.00 // byte
  if (file.size) {
    var fileM = (file.size / Math.pow(num, 2)).toFixed(0)
    console.log(file.size + ',' + fileM)
    if (parseInt(fileM) > 500) {
      return tipTextNoWs
    }
  }
  const name = file.name.split('.')
  const arrayLength = name.length
  const fileType = name[arrayLength - 1]
  const reg = /^(doc)|(docx)|(pdf)|(zip)|(rar)|(png)|(jpg)|(jpeg)|(bmp)$/
  if (!reg.test(fileType)) {
    return tipTextNoWs
  }
  return ''
}
export default {
  getVideoUrl,
  uploadFileUrl,
  uploadFilesUrl,
  tipText,
  fileValid,
  fileValid_Notice,
  imgValid,
  tipTextImg,
  fileOtherValid,
  tipTextOther,
  fileNoWsValid,
  tipTextNoWs,
  tipText_Notice_size,
  tipText_Notice_style
}
