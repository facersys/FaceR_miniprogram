import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { set as setGlobalData } from '../../global'

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
    var user = {}
    Taro.getStorage({ key: 'user' }).then(res => {
      user = res.data
      console.log(user)
      console.log(Boolean(user))
    }).catch(() => {
      Taro.navigateTo({
        url: '/pages/login/index'
      })
    })
  }

  getUserInfo = (userinfo) => {
    console.log('userinfo', userinfo)
    if (userinfo.detail.userInfo) {
      setGlobalData('user', userinfo.detail.userInfo)
      Taro.setStorage({key: 'user', data: userinfo.detail.userInfo}).then(rst => {
        Taro.navigateBack()
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
            <AtButton type='secondary' className='login-btn'>学号登陆</AtButton>
          </View>
          <Text className='login-notice'>注: 使用学号登陆时，初始密码: 8888</Text>
        </View>
        <BottomNavbar />
      </View>
    )
  }
}