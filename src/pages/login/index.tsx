import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtToast } from 'taro-ui'
import { API_URL } from '../../config'
import './index.sass'
import BottomNavbar from '../../common/components/bottomNavbar'

interface IMyComponentState {
  btnDisabled: boolean,
  showToast: boolean,
  toastIcon: any,
  toastContent: string,
  toastDuration: number
}


export default class Login extends Component<{}, IMyComponentState> {
  config: Config = {
    navigationBarTitleText: '登陆'
  }

  constructor(props) {
    super(props)

    this.state = {
      showToast: false,
      toastIcon: 'success',
      toastContent: '删除成功',
      toastDuration: 3000,
      btnDisabled: true
    }


    this.getUserInfo = this.getUserInfo.bind(this)
    this.isUserExists = this.isUserExists.bind(this)
  }

  // 判断用户是否存在
  isUserExists(openId) {
    return new Promise((resolve, reject) => {
      Taro.request({
        url: API_URL + '/findUserByOpenID',
        method: 'POST',
        data: {
          'openid': openId
        }
      }).then(res => {
        resolve(res.data.data)
      })
    })
  }

  componentWillMount() {
    // 如果存在用户直接返回上一层
    const uid = Taro.getStorageSync('uid')
    if (Boolean(uid)) {
      Taro.navigateBack()
    } else {
      Taro.login().then(res => {
        Taro.request({
          url: API_URL + '/wx/code2session/' + res.code,
        }).then((res) => {
          const openid = res.data.data.openid
          const session_key = res.data.data.session_key

          Taro.setStorageSync('openid', openid)
          Taro.setStorageSync('session_key', session_key)
        }).then(() => {
          this.setState({
            btnDisabled: false
          })
        })
      })
    }
  }

  componentDidShow() {
    const uid = Taro.getStorageSync('uid')
    if (Boolean(uid)) {
      Taro.navigateBack()
    }
  }

  // 获取用户信息
  getUserInfo = (userInfo) => {
    this.setState({
      showToast: true,
      toastContent: '登陆中，请稍后...',
      toastIcon: 'loading',
      toastDuration: 0
    })

    const openid = Taro.getStorageSync('openid')
    const session_key = Taro.getStorageSync('session_key')

    // 判断用户是否存在
    this.isUserExists(openid).then(res => {
      if (res != 0) {
        // 用户存在，拿到用户的uid，并存储用户信息
        Taro.setStorageSync('uid', res)
      } else {
        // 用户不存在，创建新用户
        Taro.request({
          url: API_URL + '/wx/decrypt',
          method: 'POST',
          data: {
            'session_key': session_key,
            'encryptedData': userInfo.detail.encryptedData,
            'iv': userInfo.detail.iv
          }
        }).then(res => {
          // 拿到了用户数据
          const userinfo_detail = res.data.data
          const data = {
            city: userinfo_detail.city,
            province: userinfo_detail.province,
            avatar: userinfo_detail.avatarUrl,
            gender: userinfo_detail.gender,
            name: userinfo_detail.nickName,
            openid: userinfo_detail.openId,
            unionid: userinfo_detail.unionId
          }

          Taro.request({
            url: API_URL + '/user',
            method: 'POST',
            data: data
          }).then(res => {
            if (res.data.code === 0) {
              // 拿到用户的uid
              Taro.setStorageSync('uid', res.data.data)
            }
          })
        })
      }
    }).then(() => {
      this.setState({
        showToast: true,
        toastContent: '登陆成功',
        toastIcon: 'success',
        toastDuration: 1000
      })
      Taro.navigateBack()
    })
  }


  render() {
    return (
      <View className='collect'>
        <AtToast
          isOpened={this.state.showToast}
          text={this.state.toastContent}
          status={this.state.toastIcon}
          duration={this.state.toastDuration}
          onClose={() => { this.setState({ showToast: false }) }}
        ></AtToast>

        <View className='login-view'>
          <View className='button-group'>
            <AtButton
              type='primary'
              className='login-btn'
              openType='getUserInfo'
              disabled={this.state.btnDisabled}
              onGetUserInfo={this.getUserInfo}
            >微信登陆</AtButton>
          </View>
          <Text className='login-notice'>注: 登陆后可以绑定教务系统</Text>
        </View>
        <BottomNavbar />
      </View>
    )
  }
}