import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.less'

export default class IndexCard extends Component {
  static defaultProps = {title: ''}

  constructor(props) {
    super(props)

  }

  render() {
    return (
      <View className='index-card-item-view' onClick={this.props.onClick}>
        <View className='index-card-item'>{this.props.title}</View>
      </View>
    )
  }
}