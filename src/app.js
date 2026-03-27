import { Component } from 'react'
import Taro from '@tarojs/taro'
import './app.scss'

class App extends Component {
  componentDidMount() {
    if (Taro.cloud) {
      Taro.cloud.init({
        env: 'tinsley-01-8g4m84py9e5fb19d',
        traceUser: true,
      })
    }
  }

  render() {
    return this.props.children
  }
}

export default App
