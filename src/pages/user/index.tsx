import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtList, AtListItem, AtToast, AtModal } from "taro-ui"
import { API_URL, DEFAULT_USERINFO } from '../../config'

import './index.sass'
import BottomNavbar from '../../common/components/bottomNavbar'

interface IMyComponentState {
  user: any,
  showToast: boolean,
  toastIcon: any,
  toastContent: string,
  toastDuration: number,
  showModal: boolean
}

export default class User extends Component<{}, IMyComponentState> {
  constructor(props) {
    super(props)

    const user = Taro.getStorageSync('user')
    this.state = {
      user: user,
      showToast: false,
      toastIcon: 'success',
      toastContent: '删除成功',
      toastDuration: 3000,
      showModal: false
    }

    this.deleteAccount = this.deleteAccount.bind(this)
  }

  config: Config = {
    navigationBarTitleText: '个人中心'
  }

  componentWillMount() {
    Taro.setStorageSync('navbar_current', 2)
  }

  componentDidShow() {
    const uid = Taro.getStorageSync('uid')
    
    //判断是否登陆
    if (!Boolean(uid)) {
      Taro.navigateTo({ url: '/pages/login/index' })
    } else {
      // 拿到用户信息
      Taro.request({
        url: API_URL + '/user',
        data: {
          uid: uid
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.setState({
            user: res.data.data,
          })
        } else {
          Taro.showToast({
            title: '网络错误',
            icon: 'none',
          })
        }
      })
    }
  }


  // 刪除賬號信息
  deleteAccount = () => {
    this.setState({
      showToast: true,
      toastIcon: 'loading',
      toastContent: '正在删除账号信息...',
      toastDuration: 0
    })

    const uid = Taro.getStorageSync('uid')
    Taro.request({
      url: API_URL + '/user',
      method: 'DELETE',
      data: {
        uid: uid
      }
    }).then(res => {
      if (res.data.code === 0) {
        this.setState({
          showToast: true,
          toastIcon: 'success',
          toastContent: '删除成功',
          toastDuration: 1500,
        }, () => {

          Taro.removeStorageSync('uid')
          Taro.removeStorageSync('user')
          Taro.removeStorageSync('openid')
          Taro.removeStorageSync('session_key')
          this.setState({
            user: DEFAULT_USERINFO,
          })
          Taro.reLaunch({
            url: '/pages/user/index'
          })
        })
      }
    })
  }


  render() {
    const user = this.state.user
    return (
      <View>
        <AtToast
          isOpened={this.state.showToast}
          text={this.state.toastContent}
          status={this.state.toastIcon}
          duration={this.state.toastDuration}
          onClose={() => { this.setState({ showToast: false }) }}
        ></AtToast>

        <AtModal
          isOpened={this.state.showModal}
          title='是否注销账户'
          cancelText='取消'
          confirmText='确认'
          onCancel={() => { this.setState({ showModal: false }) }}
          onConfirm={this.deleteAccount}
          content='本操作将清除所有账户信息！'
        />

        <View className='user-info'>
          <Image className='avatar' src={user.avatar} />
          <View className='right'>
            <Text className='name'>{user.name}</Text>
            <Text className='class'>{(user.grade ? user.grade + '级' : '') + (user.major ? user.major : '')}</Text>
          </View>
        </View>

        <View>
          <AtList>
            <AtListItem
              title='我的信息'
              arrow='right'
              thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
            />
            <AtListItem
              title='我的通知'
              arrow='right'
              onClick={() => { Taro.navigateTo({ url: '/pages/notice/index' }) }}
              thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
            />
            <AtListItem
              title='注销账户'
              arrow='right'
              onClick={() => { this.setState({ showModal: true }) }}
              thumb='http://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png'
            />
          </AtList>
        </View>
        <BottomNavbar />

      </View>
    )
  }
}