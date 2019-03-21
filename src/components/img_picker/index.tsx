import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './index.less'
import { get as getGlobalData } from '../../global'
import { resolve } from 'path';

export default class ImgPicker extends Component {

  constructor(props) {
    super(props)

    this.handleImgPicker = this.handleImgPicker.bind(this)

  }

  handleImgPicker = () => {
    new Promise((resolve, reject) => {
      Taro.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
        success(res) {
          console.log(res)
          const tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths)
        }
      })
    })
  }

  render() {
    return (
      <View className='img-picker'>
        <View
          className='face-img-view'
          onClick={this.handleImgPicker}
        >
          {
            this.props.img ? (
              <Image
                src={getGlobalData('OSS_URL') + this.props.img}
                className='face-img'
              />
            ) : (
                <AtIcon customStyle="font-size: 48px;color: #b3b3b3;display: flex;justify-content: center;align-items: center;height: 100%;" size='48' value='add' color='#b3b3b3'></AtIcon>
              )
          }
        </View>
      </View>
    )
  }
}
