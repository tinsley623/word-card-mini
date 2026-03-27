import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import './index.scss'

const RECOMMENDED = [
  { text: '道', type: 'zh' },
  { text: '意', type: 'zh' },
  { text: '缘', type: 'zh' },
  { text: '惜', type: 'zh' },
  { text: '空', type: 'zh' },
  { text: 'Serendipity', type: 'en' },
  { text: 'Resilience', type: 'en' },
  { text: 'Entropy', type: 'en' },
]

const BG_CHARS = ['意', '字', '词', '道', '缘']

export default function Home() {
  const [input, setInput] = useState('')

  const handleSearch = () => {
    const word = input.trim()
    if (!word) return
    Taro.navigateTo({
      url: `/pages/wordcard/index?word=${encodeURIComponent(word)}`,
    })
  }

  const handleTagClick = (word) => {
    Taro.navigateTo({
      url: `/pages/wordcard/index?word=${encodeURIComponent(word)}`,
    })
  }

  return (
    <View className='home'>
      <View className='home-bg-chars'>
        {BG_CHARS.map((ch, i) => (
          <Text key={i} className={`home-bg-char bg-char-${i}`}>{ch}</Text>
        ))}
      </View>

      <View className='home-content'>
        <Text className='home-logo'>词</Text>
        <Text className='home-subtitle'>一 字 一 世 界</Text>
        <Text className='home-desc'>
          输入单个汉字或英文单词{'\n'}深度挖掘其灵魂深处的含义
        </Text>

        <View className='search-box'>
          <Input
            className='search-input'
            placeholder='输入汉字或英文单词'
            value={input}
            onInput={(e) => setInput(e.detail.value)}
            onConfirm={handleSearch}
            confirmType='search'
          />
          <View className='search-btn' onClick={handleSearch}>
            <Text className='search-icon'>🔍</Text>
          </View>
        </View>

        <Text className='home-desc-sub'>
          中文仅支持单个汉字，英文仅支持单个单词
        </Text>

        <View className='home-tags'>
          <Text className='home-tags-label'>试试这些：</Text>
          <View className='home-tags-list'>
            {RECOMMENDED.map(({ text }) => (
              <View
                key={text}
                className='home-tag'
                onClick={() => handleTagClick(text)}
              >
                <Text className='home-tag-text'>{text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}
