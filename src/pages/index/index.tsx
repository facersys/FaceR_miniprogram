import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'

import IndexSwiper from '../../components/swiper'
import BottomNavbar from '../../components/navbar'
import IndexCard from '../../components/index_card'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: 'FaceR'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <IndexSwiper />
          <View className='index-card-group'>
            <IndexCard title='人脸识别' />
            <IndexCard title='考勤记录' />
            <IndexCard title='分享应用' />
          </View>
        <BottomNavbar />
      </View>
    )
  }
}

