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
  }

  // 用户直接退出页面
  componentWillUnmount() {
    Taro.getStorage({ key: 'userId' }).catch(() => {
      Taro.navigateTo({
        url: '/pages/login/index'
      })
    })
  }

  getUserInfo = (userinfo) => {

    if (userinfo.detail.userInfo) {
      Taro.login().then((res) => {
        Taro.request({
          url: 'https://facer.yingjoy.cn/api/wx/code2session/' + res.code,
          success(res) {
            // 拿到session_key
            console.log(res)
            const session_key = res.data.data.session_key

            Taro.request({
              url: 'https://facer.yingjoy.cn/api/wx/decrypt',
              method: 'POST',
              data: {
                'session_key': session_key,
                'encryptedData': userinfo.detail.encryptedData,
                'iv': userinfo.detail.iv
              },
              success(res) {
                const userinfo_detail = res.data.data
                console.log(userinfo_detail)

                // 用户是否存在
                Taro.request({
                  url: 'https://facer.yingjoy.cn/api/user',
                  data: {
                    'oid': userinfo_detail.openId
                  },
                  success(res) {
                    if (res.data.data !== null) {
                      // 用户存在
                      Taro.setStorage({ key: 'userId', data: userinfo_detail.openId }).then(res => {
                        Taro.navigateBack()
                      })
                    } else {
                      // 用户->数据库
                      Taro.request({
                        url: 'https://facer.yingjoy.cn/api/user',
                        method: 'POST',
                        data: {
                          city: userinfo_detail.city,
                          province: userinfo_detail.province,
                          avatar: userinfo_detail.avatarUrl,
                          gender: userinfo_detail.gender,
                          name: userinfo_detail.nickName,
                          openid: userinfo_detail.openId,
                          unionid: userinfo_detail.unionId
                        },
                        success(res) {
                          Taro.setStorage({ key: 'userId', data: userinfo_detail.openId }).then(res => {
                            Taro.navigateBack()
                          })
                        }
                      })
                    }
                  }
                })

              }
            })
          }
        })
      })
    } else { }
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