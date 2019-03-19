import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker, Button, Text } from '@tarojs/components'
import { AtForm, AtInput, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtImagePicker } from 'taro-ui'

import './index.less'
import { getUserInfo, getGenderStr } from '../../global'
import BottomNavbar from '../../components/navbar'
import StateModal from '../../components/statemodal'
import ImgPicker from '../../components/img_picker'

export default class Collect extends Component {
  config: Config = {
    navigationBarTitleText: '信息采集'
  }

  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.onReset = this.onReset.bind(this)

    this.state = {
      gender_arr: ['保密', '男', '女'],
      grade_arr: [2015, 2016, 2017, 2018],

      submitLoading: false,
      jw_modal_visible: false,
      jw_bind_loading: false,

      user: {},
      jw: {}
    }
  }

  // 是否登陆
  componentWillMount() {
    getUserInfo().then((res) => {
      this.setState({ user: res })
    })
  }

  // 绑定教务系统
  bindJW = () => {
    var self = this

    self.setState({ jw_bind_loading: true })
    new Promise((resolve, reject) => {
      Taro.request({
        url: 'https://facer.yingjoy.cn/api/sync_stbu',
        method: 'POST',
        data: Object.assign({}, this.state.jw, { 'oid': this.state.user.openid }),
        success(res) {
          self.setState({ jw_bind_loading: false, jw_modal_visible: false })
          console.log(res)
          if (res.data.code === 200) {
            Taro.showToast({
              title: '同步教务系统成功',
              icon: 'success',
              duration: 1500
            })
          } else {
            Taro.showToast({
              title: res.data.message,
              icon: 'loading',
              duration: 1500
            })
          }
        },
      })
    }).then(() => {
      Taro.navigateTo({
        url: "/pages/collect/index"
      })
    })
  }

  onSubmit = () => {
    var self = this
    this.setState({ submitLoading: true })

    return new Promise((resolve, reject) => {
      Taro.request({
        url: 'https://facer.yingjoy.cn/api/user?oid=' + self.state.user.openid,
        method: 'PUT',
        data: self.state.user,
        success(res) {
          console.log(res)
          self.setState({ submitLoading: false })
          Taro.showToast({
            title: '信息更新成功',
            icon: 'success',
            duration: 1500
          })
        }
      })
    })

  }

  onReset = () => {
    Taro.navigateTo({
      url: '/pages/collect/index'
    })
  }

  render() {
    const user = this.state.user
    const jw = this.state.jw
    return (
      <View className='collect'>
        <StateModal />

        <View className='collect-body'>
          <AtButton
            onClick={() => { this.setState({ jw_modal_visible: true }) }}
            type='primary'
            customStyle={user.is_bind_jw ? 'display: none' : ''}
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
              clear
              value={user.sid}
              onChange={(e) => {
                user.sid = e
                this.setState({ user: user })
              }}
            />

            <AtInput
              name='name'
              title='姓名'
              clear
              type='text'
              value={user.name}
              onChange={(e) => {
                user.name = e
                this.setState({ user: user })
              }}
            />

            <Picker
              mode='selector'
              range={this.state.gender_arr}
              className='at-input'
              value={user.gender}
              onChange={(e) => {
                user.gender = e.target.value
                this.setState({ user: user })
              }}>
              <Text className='form-item-label at-input__title at-input__title'>性别</Text>
              <Text className='gender-selected'>{getGenderStr(this.state.user.gender)}</Text>
            </Picker>

            <Picker
              mode='selector'
              range={this.state.grade_arr}
              value={this.state.grade_arr.indexOf(user.grade)}
              onChange={(e) => {
                user.grade = this.state.grade_arr[parseInt(e.target.value)]
                this.setState({ user: user })
              }}
              className='at-input'>
              <Text className='form-item-label at-input__title at-input__title'>年级</Text>
              <Text className='gender-selected'>{this.state.user.grade}</Text>
            </Picker>

            <AtInput
              name='major'
              title='专业'
              clear
              type='text'
              value={user.major}
              onChange={(e) => {
                user.major = e
                this.setState({ user: user })
              }}
            />

            <AtInput
              name='cname'
              title='班级'
              type='text'
              clear
              value={user.cname}
              onChange={(e) => {
                user.cname = e
                this.setState({ user: user })
              }}
            />
            <AtInput
              name='email'
              title='邮箱'
              clear
              type='text'
              value={user.email}
              onChange={(e) => {
                user.email = e
                this.setState({ user: user })
              }}
            />

            <View className='at-input'>
              <Text className='form-item-label at-input__title at-input__title'>照片</Text>
            </View>
            <ImgPicker img={user.face_url} />
            <AtImagePicker
              multiple
              files={this.state.files}
              onChange={this.onChange.bind(this)}
              onFail={this.onFail.bind(this)}
              onImageClick={this.onImageClick.bind(this)}
            />
          </AtForm>

          <View className='form-btn-group'>
            <AtButton
              className='form-btn'
              onClick={this.onSubmit}
              loading={this.state.submitLoading}
              type='primary'>提交</AtButton>
            <AtButton
              className='form-btn'
              type='secondary'
              onClick={() => {
                Taro.navigateTo({
                  url: '/pages/collect/index'
                })
              }}>重置</AtButton>
          </View>

        </View>
        <BottomNavbar />

        {/* 教务登陆模态框 */}
        <AtModal isOpened={this.state.jw_modal_visible}>
          <AtModalHeader>教务系统</AtModalHeader>
          <AtModalContent>
            <AtInput
              name='value'
              title='学号'
              type='text'
              value={jw.u}
              onChange={(e) => {
                jw.u = e
                this.setState({ jw: jw })
              }}
            />
            <AtInput
              name='value'
              title='密码'
              type='password'
              value={jw.p}
              onChange={(e) => {
                jw.p = e
                this.setState({ jw: jw })
              }}
            />
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => {
              this.setState({ jw_bind_loading: false, jw_modal_visible: false })
            }}>取消</Button>
            <Button loading={this.state.jw_bind_loading} onClick={this.bindJW}>绑定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}