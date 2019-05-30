import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker, Button, Text } from '@tarojs/components'
import { AtForm, AtInput, AtButton, AtToast, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'

import './index.less'
import { getGenderStr } from '../../global'
import BottomNavbar from '../../common/components/bottomNavbar'
import StateModal from '../../components/statemodal'
import ImgPicker from '../../components/img_picker'
import { API_URL } from '../../config';

export default class Collect extends Component {
  config: Config = {
    navigationBarTitleText: '信息采集'
  }

  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.onReset = this.onReset.bind(this)
    this.onChangeState = this.onChangeState.bind(this)

    this.state = {
      gender_arr: ['保密', '男', '女'],
      grade_arr: [2015, 2016, 2017, 2018],

      submitLoading: false,
      jw_modal_visible: false,
      jw_bind_loading: false,

      user: {},
      jw: {},

      showToast: false,
      toastIcon: 'success',
      toastContent: '删除成功',
      toastDuration: 3000,
    }
  }

  componentWillMount() {
    Taro.setStorageSync('navbar_current', 1)
  }

  componentDidShow() {
    const uid = Taro.getStorageSync('uid')

    //判断是否登陆
    if (!Boolean(uid)) {
      Taro.navigateTo({ url: '/pages/login/index' })
    } else {
      // 拿到用户信息
      Taro.request({
        url: API_URL + '/user',
        data: {
          uid: uid
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.setState({
            user: res.data.data,
          })
        } else {
          Taro.showToast({
            title: '网络错误',
            icon: 'none',
          })
        }
      })
    }
  }

  onChangeState(stateName) {
    this.setState(stateName)
  }

  // 绑定教务系统
  bindJW = () => {
    const uid = Taro.getStorageSync('uid')
    this.setState({ jw_bind_loading: true }, () => {
      Taro.request({
        url: API_URL + '/stbu',
        method: 'POST',
        data: Object.assign({}, this.state.jw, { uid: uid })
      }).then(res => {
        this.setState({ jw_bind_loading: false, jw_modal_visible: false })
        if (res.data.code === 0) {
          Taro.request({
            url: API_URL + '/user',
            data: {
              uid: this.state.user.uid
            }
          }).then(res => {
            const user = res.data.data
            this.setState({ user: user })
          }).then(() => {
            this.setState({
              showToast: true,
              toastIcon: 'success',
              toastContent: '同步教务系统成功',
              toastDuration: 1500
            }, () => {
              Taro.navigateTo({
                url: "/pages/collect/index"
              })
            })
          })
        } else if (res.data.code === 83) {
          this.setState({
            showToast: true,
            toastIcon: 'error',
            toastContent: '请输入账户或密码',
            toastDuration: 1500
          })
        } else if (res.data.code === 84) {
          this.setState({
            showToast: true,
            toastIcon: 'error',
            toastContent: '账户或密码错误',
            toastDuration: 1500,
            jw: {}
          })
        }
      })
    }
  }

  onSubmit = () => {
    const user = this.state.user
    user.uid = user.id
    Taro.request({
      url: API_URL + '/user',
      method: 'PUT',
      data: user
    }).then(res => {
      if (res.data.code === 0) {
        this.setState({
          showToast: true,
          toastIcon: 'success',
          toastContent: '信息更新成功',
          toastDuration: 1500
        })
      }
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
        <AtToast
          isOpened={this.state.showToast}
          text={this.state.toastContent}
          status={this.state.toastIcon}
          duration={this.state.toastDuration}
          onClose={() => { this.setState({ showToast: false }) }}
        ></AtToast>
        <StateModal />

        <View className='collect-body'>
          <AtButton
            onClick={() => { this.setState({ jw_modal_visible: true }) }}
            type='primary'
          // customStyle={user.is_bind_jw ? 'display: none' : ''}
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
              <Text className='gender-selected'>{this.state.user.grade === null ? '': this.state.user.grade}</Text>
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
              value={user.class_name}
              onChange={(e) => {
                user.class_name = e
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

            <ImgPicker user={this.state.user} onChangeState={this.onChangeState} />
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