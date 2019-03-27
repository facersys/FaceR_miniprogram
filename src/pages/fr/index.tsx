import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { getUserInfo, get as getGlobalData } from '../../global'

import './index.less'

export default class Login extends Component {
  config: Config = {
    navigationBarTitleText: '人脸识别'
  }

  constructor(props) {
    super(props)

    this.state = {
      img: "",
      users: [],
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
              url: 'https://facer.yingjoy.cn/api/fr',
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
                    img: result.data.img_url,
                    users: result.data.results
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
    var names = []
    this.state.users.forEach(element => {
      names.push(element.name)
    });
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

        {
          this.state.users.length > 0 ? (
            <View style="margin-top: -2rem;">
              <View className='text-result'>结果: 该图片中共有<Text>{this.state.users.length}</Text>张人脸。</View>
              <View className='text-result'>已知的人脸有： {names}</View>
            </View>
          ) : (<View></View>)
        }
        <AtButton plain type='primary' className='upload-btn' onClick={this.choiceFile}>选择文件上传</AtButton>
        <Text className='notice'>注意: 只会识别出已经录入信息的人脸</Text>
      </View>
    )
  }
}