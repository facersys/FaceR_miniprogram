import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './index.less'
import { get as getGlobalData } from '../../global'
import { API_URL } from '../../config';

export default class ImgPicker extends Component {

  static defaultProps = { user: {} }

  constructor(props) {
    super(props)

    this.handleImgPicker = this.handleImgPicker.bind(this)
    this.changeState = this.changeState.bind(this)
  }

  changeState(item) {
    this.props.onChangeState(item)
  }

  handleImgPicker = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera']
    }).then(res => {
      Taro.showLoading({
        title: '正在上传...'
      })
      const tempFilePaths = res.tempFilePaths
      const uid = Taro.getStorageSync('uid')
      Taro.uploadFile({
        url: API_URL + '/updateFace',
        filePath: tempFilePaths[0],
        name: 'face',
        formData: {
          uid: uid
        }
      }).then(res => {
        Taro.hideLoading()
        Taro.showLoading({
          title: '正在处理图像信息...'
        })
        console.log(res)
        const result = JSON.parse(res.data)
        if (result.code !== 0) {
          Taro.showToast({
            title: result.message,
            icon: 'none'
          })
        } else {
          Taro.showToast({
            title: result.message,
            icon: 'success'
          })
          var new_user = this.props.user
          new_user.face_url = result.data.face_url
          new_user.face = result.data.face
          this.changeState({ user: new_user })
          Taro.setStorageSync('user', new_user)
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
            this.props.user.face_url ? (
              <Image
                src={this.props.user.face_url}
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
