'use strict'

const watermark = {}

const setWatermark = (str1, str2, str3, str4, str5, str6, str7) => {
  // str4, str5, str6, str7 四段ip
  const id = '1.23452384164.123412415'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  const can = document.createElement('canvas')
  can.width = 400
  can.height = 300
  can.background = 'red'

  const cans = can.getContext('2d')
  cans.rotate(-20 * Math.PI / 180)
  cans.font = '14px Vedana'
  cans.fillStyle = 'rgba(200, 200, 200, 0.40)'
  cans.textAlign = 'left'
  cans.textBaseline = 'Middle'
  cans.fillText(str1, can.width / 16, can.height / 3)
  if (str2.length > 6) { // 有一些的警号是8位
    cans.fillText(str2, can.width / 4.5, can.height / 3)
  } else { // 大多数数据 警号是6位
    cans.fillText(str2, can.width / 3.7, can.height / 3)
  }
  cans.fillText(str3, can.width / 16, can.height / 2.5)
  cans.fillText(str4, can.width / 16, can.height / 2.2)
  cans.fillText('.', can.width / 7.8, can.height / 2.2)
  cans.fillText(str5, can.width / 6.6, can.height / 2.2)
  cans.fillText('.', can.width / 4.4, can.height / 2.2)
  cans.fillText(str6, can.width / 4, can.height / 2.2)
  cans.fillText('.', can.width / 3.2, can.height / 2.2)
  if (str7.length === 3) {
    cans.fillText(str7, can.width / 3, can.height / 2.2)
  } else if (str7.length === 2) {
    cans.fillText(str7, can.width / 2.8, can.height / 2.2)
  } else if (str7.length === 1) {
    cans.fillText(str7, can.width / 2.7, can.height / 2.2)
  }

  const div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '70px'
  div.style.left = document.documentElement.clientWidth * 0.02 + 'px'
  div.style.position = 'fixed'
  div.style.zIndex = '100'
  div.style.width = document.documentElement.clientWidth * 0.94 + 'px'
  div.style.height = document.documentElement.clientHeight - 100 + 'px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  document.body.appendChild(div)
  return id
}

// 该方法只允许调用一次
watermark.set = (str1, str2, str3, str4, str5, str6, str7) => {
  let id = setWatermark(str1, str2, str3, str4, str5, str6, str7)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str1, str2, str3, str4, str5, str6, str7)
    }
  }, 500)
  window.onresize = () => {
    setWatermark(str1, str2, str3, str4, str5, str6, str7)
  }
}

export default watermark
