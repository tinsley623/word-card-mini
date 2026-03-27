import { Component } from 'react'
import Taro from '@tarojs/taro'
import './app.scss'

class App extends Component {
  componentDidMount() {
    if (Taro.cloud) {
      Taro.cloud.init({
        traceUser: true,
      })
    }
  }

  render() {
    return this.props.children
  }
}

export default App
