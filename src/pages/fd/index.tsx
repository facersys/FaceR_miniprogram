import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { getUserInfo, get as getGlobalData } from '../../global'

import './index.less'

export default class Login extends Component {
  config: Config = {
    navigationBarTitleText: '人脸检测'
  }

  constructor(props) {
    super(props)

    this.state = {
      img: "",
      user: { face_url: "" },
      face_marks: [],
    }
    this.choiceFile = this.choiceFile.bind(this)
  }

  // 是否登陆
  componentWillMount() {
    getUserInfo().then((res) => {
      this.setState({ user: res })
    })

    // TODO 给默认图像加个造型
  }

  choiceFile = () => {
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
              url: 'https://facer.yingjoy.cn/api/fd',
              filePath: tempFilePaths[0],
              name: 'img',
              formData: {
                oid: self.state.user.openid
              },
              success(res) {
                Taro.hideLoading()
                var result = JSON.parse(res.data)
                console.log(result)

                if (result.code === 200) {
                  self.setState({
                    face_marks: result.data.face_marks,
                    img: result.data.img_url
                  })
                } else {
                  Taro.showToast({
                    title: result.message,
                    icon: 'none'
                  })
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
      <View className='collect'>
        <View className='face-decetion-view'>
          <View className='big-img-view'>
            {
              this.state.img ? (
                <Image
                  src={this.state.img}
                  className='big-img'
                />
              ) : (
                  <Text>请上传你想要检测的图片</Text>
                )
            }
          </View>
        </View>

        <View className='label'>
          <View className='label-item'>
            <View className='color-block' style="background: rgb(0, 255, 0)"></View>
            <Text className='text-result'>左眉</Text>
          </View>
          <View className='label-item'>
            <View className='color-block' style="background: rgb(0, 125, 0)"></View>
            <Text className='text-result'>右眉</Text>
          </View>
          <View className='label-item'>
            <View className='color-block' style="background: rgb(255, 0, 0)"></View>
            <Text className='text-result'>左眼</Text>
          </View>
          <View className='label-item'>
            <View className='color-block' style="background: rgb(125, 0, 0)"></View>
            <Text className='text-result'>右眼</Text>
          </View>
          <View className='label-item'>
            <View className='color-block' style="background: rgb(0, 255, 225)"></View>
            <Text className='text-result'>鼻梁</Text>
          </View>
          <View className='label-item'>
            <View className='color-block' style="background: rgb(0, 125, 125)"></View>
            <Text className='text-result'>鼻头</Text>
          </View>
          <View className='label-item'>
            <View className='color-block' style="background: rgb(255, 0, 255)"></View>
            <Text className='text-result'>上唇</Text>
          </View>
          <View className='label-item'>
            <View className='color-block' style="background: rgb(125, 0, 125)"></View>
            <Text className='text-result'>下唇</Text>
          </View>
          <View className='label-item'>
            <View className='color-block' style="background: rgb(255, 255, 255)"></View>
            <Text className='text-result'>下巴</Text>
          </View>
        </View>

        <View className='text-result'>
          结果: 该图片中共有<Text>{this.state.face_marks.length}</Text>张人脸。
        </View>
        <AtButton plain type='primary' className='upload-btn' onClick={this.choiceFile}>选择文件上传</AtButton>
      </View>
    )
  }
}