import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.sass'
import { API_URL } from '../../config';


export default class NoticeDetail extends Component {
  config: Config = {
    navigationBarTitleText: '通知详情'
  }

  state = {
    notice: {}
  }


  componentWillMount() {
    const nid = this.$router.params.nid
    Taro.request({
      url: API_URL + '/notice',
      data: {
        nid: nid
      }
    }).then(res => {
      if (res.data.code === 0) {
        this.setState({
          notice: res.data.data
        })
      }
    })

  }




  render() {
    return (
      <View className='at-article'>
        <View className='at-article__h1'>
          {this.state.notice.title}
        </View>
        <View className='at-article__info'>
          2019年05月26日 14:15
        </View>
        <View className='at-article__content'>
          <View className='at-article__section'>
            <View className='at-article__p'>
              {this.state.notice.content}
            </View>
          </View>
        </View>
      </View>
    )
  }
}