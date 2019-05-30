import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.sass'

interface IMyComponentState {
  btnDisabled: boolean,
  showToast: boolean,
  toastIcon: any,
  toastContent: string,
  toastDuration: number
}


export default class UserDetail extends Component<{}, IMyComponentState> {
  config: Config = {
    navigationBarTitleText: '个人信息'
  }



  componentWillMount() {
  }




  render() {
    return (
      <View>
        123
      </View>
    )
  }
}