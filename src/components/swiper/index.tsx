import Taro, { Component } from '@tarojs/taro'
import { Swiper, SwiperItem, Image } from '@tarojs/components'

import './index.less'

export default class IndexSwiper extends Component {
  constructor(props) {
    super(props)

    this.state = {
      swiperUrls: [
        "http://iph.href.lu/320x200"
      ]
    }
  }

  render() {
    return (
      <Swiper
        className='index-swiper'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        circular
        indicatorDots
        autoplay>
        {
          this.state.swiperUrls.map((item, index) => (
            <SwiperItem key={index}>
              <Image src={item} className='swiper-image' />
            </SwiperItem>
          ))
        }
      </Swiper>
    )
  }
}