import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'

import { getUserInfo } from '../../global'
import IndexSwiper from '../../components/swiper'
import BottomNavbar from '../../components/navbar'
import IndexCard from '../../components/index_card'

export default class Index extends Component {

  constructor(props) {
    super(props);

    this.collectInfo = this.collectInfo.bind(this)
    this.deleteAccount = this.deleteAccount.bind(this)
  }

  componentWillMount() {
    getUserInfo().then((res) => {
      this.setState({ user: res })
    })
  }

  // 注销账户
  deleteAccount = () => {
    var self = this
    // 获取用户信息
    Taro.showModal({
      title: '是否要注销账号',
      content: '注销账号后您的所有资料均会被删除！',
      success: function (res) {
        if (res.confirm) {
          new Promise((resolve, reject) => {
            Taro.request({
              url: "https://facer.yingjoy.cn/api/user?oid=" + self.state.user.openid,
              method: 'DELETE',
              success(res) {
                Taro.showModal({
                  title: '账户注销',
                  content: '账户注销成功！',
                  showCancel: false
                })
                Taro.clearStorage()
                Taro.navigateTo({
                  url: '/pages/index/index'
                })
              }
            })
          })
        }
      }
    })
  }

  onShareAppMessage(e) {
    return {
      title: this.state.user.name + '邀您使用FaceR',
      path: '/pages/index/index',
      success: function (res) {
        console.log(res);
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }

  config: Config = {
    navigationBarTitleText: 'FaceR'
  }

  collectInfo = () => {
    Taro.navigateTo({
      url: '/pages/collect/index'
    })
  }



  render() {
    return (
      <View className='index'>
        <IndexSwiper />
        <View className='welcome'>
          <Text class='.text'>{this.state.user.name}同学，下午好！</Text>
        </View>

        <View className='index-card-group'>
          <IndexCard title='信息录入' onClick={this.collectInfo} />
          <IndexCard title='人脸检测' />
          <IndexCard title='人脸识别' />
          <IndexCard title='考勤记录' />
          <IndexCard title='我的通知' />
          <IndexCard title='注销账户' onClick={this.deleteAccount} />
        </View>
        <BottomNavbar />
      </View>
    )
  }
}

