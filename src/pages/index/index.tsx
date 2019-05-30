import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'
import { API_URL, DEFAULT_USERINFO } from '../../config'
import IndexSwiper from './components/swiper'
import BottomNavbar from '../../common/components/bottomNavbar'
import Card from './components/card'
import { AtToast, AtModal } from "taro-ui"

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showToast: false,
      toastIcon: 'success',
      toastContent: '删除成功',
      toastDuration: 3000,
      showModal: false
    }

    this.deleteAccount = this.deleteAccount.bind(this)
  }

  config: Config = {
    navigationBarTitleText: 'FaceR人脸信息采集系统'
  }

  componentWillMount() {
    Taro.setStorageSync('navbar_current', 0)
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
    const uid = Taro.getStorageSync('uid')
    return (

      <View className='index'>
        <IndexSwiper />
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

        <View className='main'>
          <View className='at-row at-row--wrap card-group'>
            <View className='at-col at-col-8'
              onClick={() => { Taro.navigateTo({ url: '/pages/collect/index' }) }} >
              <Card title='信息录入' icon='https://www.yingjoy.cn/tmp/xxlr.png' />
            </View>
            <View className='at-col at-col-4'
              onClick={() => { 
                  Boolean(uid) ? Taro.navigateTo({ url: '/pages/notice/index' }):Taro.showToast({
                    title: '未登录',
                    icon: 'none'
                  })
                }}>
              <Card title='我的通知' icon='https://www.yingjoy.cn/tmp/notification.png' />
            </View>
            <View className='at-col at-col-4'
              onClick={() => { Taro.navigateTo({ url: '/pages/face_decetion/index' }) }}>
              <Card title='人脸检测' icon='https://www.yingjoy.cn/tmp/face.png' />
            </View>
            <View className='at-col at-col-4'
              onClick={() => { Taro.navigateTo({ url: '/pages/face_recognition/index' }) }}>
              <Card title='人脸识别' icon='https://www.yingjoy.cn/tmp/frec.png' />
            </View>
            <View className='at-col at-col-4'>
              <Card title='考勤记录' icon='https://www.yingjoy.cn/tmp/record.png' />
            </View>
            <View className='at-col at-col-4'
              onClick={() => {
                Boolean(uid) ? this.setState({ showModal: true }):Taro.showToast({
                  title: '未登录',
                  icon: 'none'
                })
              }}>
              <Card title='注销账户' icon='https://www.yingjoy.cn/tmp/logout.png' />
            </View>
          </View>
        </View>

        <BottomNavbar />
      </View>
    )
  }
}

