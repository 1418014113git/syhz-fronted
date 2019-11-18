import { MessageBox } from 'element-ui'

// 根据原文和证书产生认证数据包
export function doDataProcess(initParam, original) {
  // 证书版本者主题
  var signSubject = '' // document.getElementById("rootCADN").value;

  // 验证认证原文是否为空
  if (original === '') {
    alertMessage('认证原文不能为空!')
    return
  } else {
    // VCTK初始化参数，数据可从网关系统：认证管理->Key类型管理中导出
    // var initParam = "<\?xml version=\"1.0\" encoding=\"gb2312\"\?><authinfo><liblist><lib type=\"CSP\" version=\"1.0\" dllname=\"\" ><algid val=\"SHA1\" sm2_hashalg=\"sm3\"/></lib><lib type=\"SKF\" version=\"1.1\" dllname=\"SERfR01DQUlTLmRsbA==\" ><algid val=\"SHA1\" sm2_hashalg=\"sm3\"/></lib><lib type=\"SKF\" version=\"1.1\" dllname=\"U2h1dHRsZUNzcDExXzMwMDBHTS5kbGw=\" ><algid val=\"SHA1\" sm2_hashalg=\"sm3\"/></lib><lib type=\"SKF\" version=\"1.1\" dllname=\"U0tGQVBJLmRsbA==\" ><algid val=\"SHA1\" sm2_hashalg=\"sm3\"/></lib></liblist></authinfo>";
    // 调用网关工具脚本中的detachSignStr方法进行签名，返回签名结果
    // 参数说明：initParam：vctk控件初始化参数，authContent：认证原文，signSubject：证书版本者主题
    const signResult = detachSignStr(initParam, original, signSubject)
    if (signResult) {
      return signResult
    } else {
      return
    }
  }
}
// 根据原文和证书产生认证数据包
// 参数说明：initParam：vctk控件初始化参数
// 参数说明：authContent：认证原文
// 参数说明：signSubject：证书版发者主题
export function detachSignStr(initParam, authContent, signSubject) {
  // 验证认证原文不能为空
  if (authContent === '') {
    alertMessage('认证原文不能为空')
    return false
  } else {
    try {
      JIT_GW_ExtInterface.GetVersion()
    } catch (e) {
      alertMessage('未安装控件，请进行安装控件')
      return false
    }
    JIT_GW_ExtInterface.ClearFilter()
    // 初始化vctk控件
    JIT_GW_ExtInterface.Initialize('', initParam)
    // 控制证书为一个时，不弹出证书选择框
    JIT_GW_ExtInterface.SetChooseSingleCert(1)

    // 生成签名信息
    const sign_Result = JIT_GW_ExtInterface.P7SignString(authContent, true, true)
    console.info('sign_Result: ', sign_Result)
    console.info('JIT_GW_ExtInterface.GetLastError(): ', JIT_GW_ExtInterface.GetLastError())
    if (JIT_GW_ExtInterface.GetLastError() !== '0' && JIT_GW_ExtInterface.GetLastError() !== 0) {
      if (JIT_GW_ExtInterface.GetLastError() === 3758096386 || JIT_GW_ExtInterface.GetLastError() === 2148532334) {
        alertMessage('用户取消操作')
        return
      } else if (JIT_GW_ExtInterface.GetLastError() === -536870815 || JIT_GW_ExtInterface.GetLastError() === 3758096481) {
        alertMessage('没有找到有效的证书，如果使用的是KEY，请确认已经插入key')
        return
      } else {
        alertMessage(JIT_GW_ExtInterface.GetLastErrorMessage())
        return
      }
    }
    // 返回签名结果
    return sign_Result
  }
}

function alertMessage(message) {
  MessageBox.alert(message, '提示', {
    confirmButtonText: '确定',
    type: 'error',
    callback: action => {
      MessageBox.close()
    }
  }).then(() => {
  })
}
