const attachmentModule = process.env.ATTACHMENT_MODULE
const uploadFileUrl = attachmentModule + 'file/uploadFile'
const getVideoUrl = attachmentModule + 'file/attachmentList'
const uploadFilesUrl = attachmentModule + 'file/uploadFiles'
const tipText = '只能上传txt、doc、docx、xls、xlsx、pdf、png、zip、jpg格式文件，且大小不超过500M'
const tipTextImg = '只能上传png、jpg、jpeg、bmp格式文件，且大小不超过500M'
const tipTextOther = '只能上传doc、docx、zip、rar、pdf格式文件，且大小不超过500M'
const tipTextNoWs = '只能上传doc、docx、zip、rar、pdf、png、jpg、jpeg、bmp格式文件，且大小不超过500M'

function fileValid(file) {
  var num = 1024.00 // byte
  if (file.size) {
    // var fileM = (file.size / Math.pow(num, 2)).toFixed(2) + 'M'
    var fileM = (file.size / Math.pow(num, 2)).toFixed(0)
    console.log(file.size + ',' + fileM)
    if (parseInt(fileM) > 500) {
      return '上传txt、doc、docx、xls、xlsx、pdf、png、zip、jpg格式文件，且大小不超过500M'
    }
  }
  const name = file.name.split('.')
  const arrayLength = name.length
  const fileType = name[arrayLength - 1]
  const reg = /^(txt)|(doc)|(docx)|(xls)|(xlsx)|(pdf)|(png)|(zip)|(jpg)$/
  if (!reg.test(fileType)) {
    return '上传txt、doc、docx、xls、xlsx、pdf、png、zip、jpg格式文件，且大小不超过500M'
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
  imgValid,
  tipTextImg,
  fileOtherValid,
  tipTextOther,
  fileNoWsValid,
  tipTextNoWs
}
