import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.less'
import { get as getGlobalData } from '../../global'


export default class BigImg extends Component {

  static defaultProps = { user: {} }

  constructor(props) {
    super(props)

    this.changeState = this.changeState.bind(this)
  }

  changeState(item) {
    this.props.onChangeState(item)
  }


  render() {
    return (
      <View className='face-decetion-view'>
        <View className='big-img-view'>
          {
            this.props.img_url ? (
              <Image
                src={getGlobalData('OSS_URL') + this.props.img_url}
                className='big-img'
              />
            ) : (
                <Image
                  src={getGlobalData('OSS_URL') + this.props.user.face_url}
                  className='big-img'
                />
              )
          }
        </View>
      </View>
    )
  }
}
