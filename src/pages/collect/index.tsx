import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtForm, AtInput, AtButton, Picker, AtImagePicker } from 'taro-ui'

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

    this.state = {
      user: {
        sid: 2015102004,
        name: '应兆康',
        gender: '男',
        grade: '2015',
        major: '计算机科学与技术',
        cname: '软件',
        face: 'https://www.yingjoy.cn',
        email: 'yzk.1314@outlook.com'
      }
    }

    this.props = {}
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
          <AtButton
            type='primary'
          >绑定教务系统</AtButton>
          <AtForm
            onSubmit={this.onSubmit.bind(this)}
            onReset={this.onReset.bind(this)}
            className='info-form'
          >
            <AtInput
              name='sid'
              title='学号'
              type='text'
              value={this.state.user.sid}
              onChange={this.handleChange.bind(this)}
            />

            <AtInput
              name='name'
              title='姓名'
              type='text'
              value={this.state.user.name}
              onChange={this.handleChange.bind(this)}
            />

            <Picker
              mode='selector'
              range={['男', '女']}
              onChange={this.onChange}
              className='at-input'>
              <Text className='form-item-label at-input__title at-input__title'>性别</Text>
              <Text className='gender-selected'>{this.state.user.gender}</Text>
            </Picker>

            <Picker mode='selector' range={['2015', '2016', '2017', '2018']} onChange={this.onChange} className='at-input'>
              <Text className='form-item-label at-input__title at-input__title'>年级</Text>
              <Text className='gender-selected'>{this.state.user.grade}</Text>
            </Picker>

            <AtInput
              name='major'
              title='专业'
              type='text'
              value={this.state.user.major}
              onChange={this.handleChange.bind(this)}
            />
            <AtInput
              name='cname'
              title='班级'
              type='text'
              value={this.state.user.cname}
              onChange={this.handleChange.bind(this)}
            />
            <AtInput
              name='email'
              title='邮箱'
              type='text'
              value={this.state.user.email}
              onChange={this.handleChange.bind(this)}
            />

            <View className='at-input'>
              <Text className='form-item-label at-input__title at-input__title'>照片</Text>

              </View>
              <AtImagePicker
                length={1}
                className='photo-choice'
                files={this.state.files}
                onImageClick={this.onImageClick.bind(this)}
              />

          </AtForm>

          <View className='form-btn-group'>
            <AtButton className='form-btn' type='primary'>提交</AtButton>
            <AtButton className='form-btn' type='secondary'>重置</AtButton>
          </View>

        </View>
        <BottomNavbar />
      </View>
    )
  }
}