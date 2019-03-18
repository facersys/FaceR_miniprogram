import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtList, AtListItem, AtModal } from "taro-ui"


import './index.less'

import BottomNavbar from '../../components/navbar'

export default class User extends Component {
  constructor(props) {
    super(props)

    this.deleteAccount = this.deleteAccount.bind(this)
  }

  config: Config = {
    navigationBarTitleText: '个人中心'
  }

  // 是否登陆
  componentWillMount() {
    var self = this
    Taro.getStorage({ key: 'userId' }).then(res => {
      // 获取用户信息
      Taro.request({
        url: "https://facer.yingjoy.cn/api/user",
        data: {
          'oid': res.data,
        },
        success(res) {
          const userinfo = res.data.data
          self.setState({ user: userinfo })
        }
      })
    }).catch(() => {
      Taro.navigateTo({ 
        url: '/pages/login/index'
      })
    })
  }

  // 注销账户
  deleteAccount = () => {
    var self = this
    Taro.getStorage({ key: 'userId' }).then(res => {
      // 获取用户信息
      Taro.request({
        url: "https://facer.yingjoy.cn/api/user",
        method: 'DELETE',
        data: {
          'oid': res.data,
        },
        success(res) {
          Taro.showModal({
            title: '账户注销',
            content: '账户注销成功！',
            showCancel: false
          })
          // Taro.clearStorage()
          // Taro.navigateTo({
          //   url: '/pages/login/index'
          // })
        }
      })
    })
  }

  render() {
    return (
      <View className='user'>
        <View className='user-info-simple'>
          <Image
            className='user-avatar'
            src={this.state.user.avatar}
          />
          <Text
            className='user-name'
          >{this.state.user.name}</Text>
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
              onClick={this.deleteAccount}
              thumb='http://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png'
            />
          </AtList>
        </View>
        <BottomNavbar />

      </View>
    )
  }
}