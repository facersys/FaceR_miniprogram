import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem } from "taro-ui"
import './index.sass'
import { API_URL } from '../../config';

export default class Notice extends Component<{}, {}> {
  config: Config = {
    navigationBarTitleText: '通知列表'
  }

  constructor(props) {
    super(props)

    this.state = {
      notices: []
    }
  }

  componentDidShow() {
    const uid = Taro.getStorageSync('uid')
    Taro.request({
      url: API_URL + '/getNoticesByUID',
      data: {
        uid: uid
      }
    }).then(res => {
      if (res.data.code === 0) {
        this.setState({
          notices: res.data.data
        })
      } else {
        Taro.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  }


  render() {
    const notices = this.state.notices
    const noticesListItems = notices.map((item) => {
      return <AtListItem
        title={(item.is_read ? '[已读] ' : '[未读] ') + item.title}
        extraText='查看内容详情'
        note={item.note}
        arrow='right'
        onClick={() => {
          Taro.navigateTo({
            url: '/pages/notice_detail/index?nid=' + item.nid.toString()
          })
        }}
      />
    })
    return (
      <View>
        <AtList>
          {/* <AtListItem
            title='感谢使用FaceR在线信息采集系统！'
            extraText='详细信息'
            note='2019年05月26日 14:15'
            arrow='right'
            onClick={() => {
              Taro.navigateTo({
                url: '/pages/notice_detail/index?nid=1'
              })
            }}
          /> */}
          {noticesListItems}
        </AtList>
      </View>
    )
  }
}