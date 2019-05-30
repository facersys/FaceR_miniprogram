import Taro, { Component } from '@tarojs/taro'
import { Swiper, SwiperItem, Image } from '@tarojs/components'

import './index.less'

export default class IndexSwiper extends Component {
  constructor(props) {
    super(props)

    this.state = {
      swiperUrls: [
        "https://facer.yingjoy.cn/static/banner.png",
      ]
    }
  }

  render() {
    return (
      <Swiper
        className='index-swiper'
        circular
        autoplay>
        {
          this.state.swiperUrls.map((item, index) => (
            <SwiperItem key={index} >
              <Image src={item} className='swiper-image' />
            </SwiperItem>
          ))
        }
      </Swiper>
    )
  }
}