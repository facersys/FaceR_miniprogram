import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './index.less'
import { get as getGlobalData } from '../../global'

export default class ImgPicker extends Component {

  static defaultProps = {user: {}}

  constructor(props) {
    super(props)

    this.handleImgPicker = this.handleImgPicker.bind(this)
    this.changeState = this.changeState.bind(this)
  }

  changeState(item) {
    this.props.onChangeState(item)
  }

  handleImgPicker = () => {
    var self = this
    
    new Promise(() => {
      Taro.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
        success(res) {
          // 开始上传
          Taro.showLoading({
            title: '正在上传...'
          })

          const tempFilePaths = res.tempFilePaths
          new Promise(() => {
            Taro.uploadFile({
              url: 'https://facer.yingjoy.cn/api/upload_face',
              filePath: tempFilePaths[0],
              name: 'face_img',
              formData: {
                oid: self.props.user.openid
              },
              success(res) {
                Taro.hideLoading()
                var result = JSON.parse(res.data)
                if (result.code !== 200) {
                  Taro.showToast({
                    title: result.message,
                    icon: 'none'
                  })
                } else {
                  // 上传成功
                  Taro.showToast({
                    title: result.message,
                    icon: 'success'
                  })
                  console.log(result)
                  var new_user = self.props.user
                  new_user['face_url'] = result.data
                  self.changeState({ user: new_user })
                }
              }
            })
          })
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
                src={getGlobalData('OSS_URL') + this.props.user.face_url}
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
