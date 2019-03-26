import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { getUserInfo } from '../../global'

import './index.less'

import BigImg from '../../components/big_img'
import BottomNavbar from '../../components/navbar'

export default class Login extends Component {
  config: Config = {
    navigationBarTitleText: '人脸检测'
  }

  constructor(props) {
    super(props)

    this.choiceFile = this.choiceFile.bind(this)
  }

  // 是否登陆
  componentWillMount() {
    getUserInfo().then((res) => {
      this.setState({ user: res })
    })
  }

  choiceFile = () => {
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
                Taro.showLoading({
                  title: '正在处理图像信息...'
                })
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
      <View className='collect'>
        <BigImg user={this.state.user} img={""} />
        <AtButton plain type='primary' onClick={this.choiceFile}>选择文件上传</AtButton>
      </View>
    )
  }
}