import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import './index.less'

import StateModal from '../../components/statemodal'
import BottomNavbar from '../../components/navbar'

export default class Collect extends Component {
  config: Config = {
    navigationBarTitleText: '信息采集'
  }

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onReset = this.onReset.bind(this)
  }

  // 是否登陆
  componentWillMount() {
    var user = {}
    Taro.getStorage({ key: 'user' }).then(res => {
      user = res.data
      console.log(user)
    }).catch(() => {
      Taro.navigateTo({
        url: '/pages/login/index'
      })
    })
  }

  handleChange(value) {
    this.setState({
      value
    })
  }
  onSubmit(event) {
    console.log(event)
  }
  onReset(event) {
    console.log(event)
  }

  render() {
    return (
      <View className='collect'>
        <StateModal />

        <View className='collect-body'>
          <AtButton type='primary'>绑定教务系统</AtButton>
          <AtForm
            onSubmit={this.onSubmit.bind(this)}
            onReset={this.onReset.bind(this)}
          >
            <AtInput
              name='sid'
              title='学号'
              type='text'
              onChange={this.handleChange.bind(this)}
            />

            <AtInput
              name='name'
              title='姓名'
              type='text'
              onChange={this.handleChange.bind(this)}
            />
            <AtInput
              name='gender'
              title='性别'
              type='text'
              onChange={this.handleChange.bind(this)}
            />
            <AtInput
              name='grade'
              title='年级'
              type='text'
              onChange={this.handleChange.bind(this)}
            />
            <AtInput
              name='major'
              title='专业'
              type='text'
              onChange={this.handleChange.bind(this)}
            />
            <AtInput
              name='cid'
              title='班级'
              type='text'
              onChange={this.handleChange.bind(this)}
            />
            <AtInput
              name='face'
              title='个人照片'
              type='text'
              onChange={this.handleChange.bind(this)}
            />
            <AtInput
              name='email'
              title='邮箱'
              type='text'
              onChange={this.handleChange.bind(this)}
            />

            <AtButton formType='submit'>提交</AtButton>
            <AtButton formType='reset'>重置</AtButton>
          </AtForm>
        </View>
        <BottomNavbar />
      </View>
    )
  }
}