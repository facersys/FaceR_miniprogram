import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'

import './index.less'

import BottomNavbar from '../../components/navbar'

export default class Login extends Component {
  config: Config = {
    navigationBarTitleText: '登陆'
  }

  constructor(props) {
    super(props)

    this.getUserInfo = this.getUserInfo.bind(this)
    this.userExists = this.userExists.bind(this)
    this.saveUserToMongo = this.saveUserToMongo.bind(this)
  }

  // 用户直接退出页面
  componentWillUnmount() {
    Taro.getStorage({ key: 'userId' }).catch(() => {
      Taro.navigateTo({
        url: '/pages/login/index'
      })
    })
  }

  userExists = (openid) => {
    return new Promise((resolve, reject) => {
      Taro.request({
        url: 'https://facer.yingjoy.cn/api/user',
        data: { oid: openid },
        success(res) {
          resolve(res.data.code === 200 ? true : false)
        }
      })
    })
  }

  saveUserToMongo = (userinfo) => {
    return new Promise((resolve, reject) => {
      Taro.request({
        url: 'https://facer.yingjoy.cn/api/user',
        method: 'POST',
        data: userinfo,
        success(res) {
          Taro.setStorage({ key: 'userId', data: userinfo.openid }).then(res => {
            Taro.navigateTo({
              url: "/" + Taro.getCurrentPages()[0].route
            })
          })
        }
      })
    })
  }

  getUserInfo = (userinfo) => {
    var self = this

    return new Promise((resolve, reject) => {
      if (userinfo.detail.userInfo) {
        Taro.login().then((res) => {
          Taro.request({
            url: 'https://facer.yingjoy.cn/api/wx/code2session/' + res.code,
            success(res) {
              const openid = res.data.data.openid
              const session_key = res.data.data.session_key
              Taro.showLoading({
                title: '登陆中...'
              })
              // 直接判断用户是否存在数据库
              self.userExists(openid).then((res) => {
                if (res) {
                  console.log('用户已存在')
                  Taro.setStorage({ key: 'userId', data: openid }).then(res => {
                    Taro.navigateTo({
                      url: "/" + Taro.getCurrentPages()[0].route
                    })
                  })
                } else {
                  // 保存用户到数据库
                  console.log('保存用户')
                  new Promise((resolve, reject) => {
                    Taro.request({
                      url: 'https://facer.yingjoy.cn/api/wx/decrypt',
                      method: 'POST',
                      data: {
                        'session_key': session_key,
                        'encryptedData': userinfo.detail.encryptedData,
                        'iv': userinfo.detail.iv
                      },
                      success(res) {
                        console.log(res)

                        if (res.statusCode === 500) {
                          // 解密失败，重新解密
                          Taro.showToast({
                            title: '请重试'
                          })
                        } else {
                          const userinfo_detail = res.data.data
                          self.saveUserToMongo({
                            city: userinfo_detail.city,
                            province: userinfo_detail.province,
                            avatar: userinfo_detail.avatarUrl,
                            gender: userinfo_detail.gender,
                            name: userinfo_detail.nickName,
                            openid: userinfo_detail.openId,
                            unionid: userinfo_detail.unionId
                          })
                        }
                      }
                    })
                  })
                }
              })
            }
          })
        })
      } else { }
    })
  }

  render() {
    return (
      <View className='collect'>
        <View className='login-view'>
          <View className='button-group'>
            <AtButton
              type='primary'
              className='login-btn'
              openType='getUserInfo'
              onGetUserInfo={this.getUserInfo}
            >微信登陆</AtButton>
            {/* <AtButton type='secondary' className='login-btn'>学号登陆</AtButton> */}
          </View>
          <Text className='login-notice'>注: 登陆后可以在信息采集中绑定教务系统</Text>
        </View>
        <BottomNavbar />
      </View>
    )
  }
}