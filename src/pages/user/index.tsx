import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtList, AtListItem } from "taro-ui"

import { set as setGlobalData, get as getGlobalData } from '../../global'

import './index.less'

import BottomNavbar from '../../components/navbar'

export default class User extends Component {
  config: Config = {
    navigationBarTitleText: '个人中心'
  }

  // 是否登陆
  componentWillMount() {
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

  render() {
    return (
      <View className='user'>
        <View className='user-info-simple'>
          <Image
            className='user-avatar'
            src='https://facer.yingjoy.cn/static/logo2.png'
          />
          <Text
            className='user-name'
          >Ying Joy</Text>
        </View>
        <View className='list'>
          <AtList>
            <AtListItem
              title='我的信息'
              arrow='right'
              thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
            />
            <AtListItem
              title='我的通知'
              arrow='right'
              thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
            />
            <AtListItem
              title='注销账户'
              arrow='right'
              thumb='http://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png'
            />
          </AtList>
        </View>
        <BottomNavbar />
      </View>
    )
  }
}