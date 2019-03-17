import Taro, { Component } from '@tarojs/taro'
import { Button, Text } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"

import './index.less'

export default class StateModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visibled: false
    }
  }

  render() {
    return (
      <AtModal isOpened={this.state.visibled}>
        <AtModalHeader><Text className='state-txt'>声明</Text></AtModalHeader>
        <AtModalContent>
          <Text className='state-txt'>本信息采集系统会对用户信息进行严格加密</Text>
          <Text className='state-txt'>仅限<Text className='important-txt'>四川工商学院</Text>范围内使用</Text>
          <Text className='state-txt'>在<Text className='important-txt'>个人中心</Text>设有<Text className='important-txt'>账户注销</Text>，一键即可删除所有个人信息</Text>
        </AtModalContent>
        <AtModalAction><Button><Text className='state-txt'>我知道了</Text></Button></AtModalAction>
      </AtModal>
    )
  }
}