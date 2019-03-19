import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.less'
import { get as getGlobalData } from '../../global'

export default class ImgPicker extends Component {

  constructor(props) {
    super(props)

  }

  render() {
    return (
      <View>
        <Image 
          src={getGlobalData('OSS_URL') + this.props.img} 
          className='img-picker-item at-image-picker__item at-image-picker__item at-image-picker__choose-btn at-image-picker__choose-btn'
        />
      </View>
    )
  }
}