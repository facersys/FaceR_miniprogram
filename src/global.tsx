import Taro from '@tarojs/taro'

const globalData = {
  navbar_current: 0,
  OSS_URL: 'https://img.yingjoy.cn/'
}

export function set(key, val) {
  globalData[key] = val
}

export function get(key) {
  return globalData[key]
}

// 获取用户信息
export function getUserInfo() {
  
  return new Promise((resolve, reject) => {
    Taro.getStorage({ key: 'userId' }).then(res => {
      const openid = res.data

      Taro.request({
        url: 'https://facer.yingjoy.cn/api/user',
        data: { oid: openid },
        success(res) {
          resolve(res.data.data)
        }
      })

    }).catch(() => {
      Taro.navigateTo({ 
        url: '/pages/login/index'
      })
    })
  })
}

// 处理性别
export function getGenderStr(gender) {
  var g = parseInt(gender)
  return g === 0 ? '保密' : g === 1 ? '男' : '女'
}