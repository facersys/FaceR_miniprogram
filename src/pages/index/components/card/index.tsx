import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'

import './index.less'

interface IRecipeProps {
  title?: string,
  icon?: string
}

export default class IndexCard extends Component<IRecipeProps> {
  render() {
    return (
      <View className='card-item'>
        <View className='item-icon'>
          <AtAvatar
            customStyle='margin: 0 auto; background: none'
            image={this.props.icon}>
          </AtAvatar>
        </View>
        <View className='item-name'>{this.props.title}</View>
      </View>
    )
  }
}