import Taro, { Component } from '@tarojs/taro'
import { AtTabBar } from 'taro-ui'

import { set as setGlobalData, get as getGlobalData } from '../../../global'

export default class BottomNavbar extends Component {

  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = (value) => {
    setGlobalData('navbar_current', value)

    switch (value) {
      case 0:
        Taro.redirectTo({
          url: `/pages/index/index`
        })
        break;
      case 1:
        Taro.redirectTo({
          url: `/pages/collect/index`
        })
        break;
      case 2:
        Taro.redirectTo({
          url: `/pages/user/index`
        })
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <AtTabBar fixed tabList={[
        { title: '首页', iconType: 'home' },
        { title: '信息采集', iconType: 'message' },
        { title: '个人中心', iconType: 'user' },
      ]}
        onClick={this.handleClick}
        current={Taro.getStorageSync('navbar_current')}
      />
    )
  }
}