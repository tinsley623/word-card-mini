import { View, Text } from '@tarojs/components'
import './index.scss'

function parseBold(text) {
  if (!text) return [text]
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <Text key={i} className='bold-text'>{part.slice(2, -2)}</Text>
    }
    return part
  })
}

export default function CardContent({ data }) {
  const today = new Date().toISOString().split('T')[0]
  const typeLabel = data.type === 'zh' ? '汉字' : '英文'

  return (
    <View className='card-wrap'>
      <View className='card-inner'>
        <Text className='card-ref'>REF · {data.category} / {data.word}</Text>

        <View className='card-meta'>
          <Text className='card-badge'>{typeLabel}</Text>
          <Text className='card-badge card-badge-date'>{today}</Text>
        </View>

        <Text className='card-char'>{data.word}</Text>
        <Text className='card-pinyin'>{data.pinyin}</Text>
        <Text className='card-brief'>{data.brief}</Text>

        <View className='card-origin'>
          <Text className='card-section-label'>原始画面 · ORIGIN</Text>
          <Text className='card-origin-text'>{parseBold(data.origin.description)}</Text>
        </View>

        <View className='card-symbols'>
          <Text className='card-symbols-title'>核心意象 · Core Symbol</Text>
          <View className='card-symbols-list'>
            {data.origin.coreSymbols.map((s) => (
              <View key={s} className='card-symbol-tag'>
                <Text className='card-symbol-text'>{s}</Text>
              </View>
            ))}
          </View>
          {data.origin.symbolFormula && (
            <Text className='card-formula'>{data.origin.symbolFormula}</Text>
          )}
        </View>

        <View className='card-summary'>
          <Text className='card-summary-label'>意象归结</Text>
          <Text className='card-summary-text'>{parseBold(data.origin.summary)}</Text>
        </View>

        <View className='card-insights'>
          <Text className='card-section-label'>深层解析 · INSIGHT</Text>
          {data.insights.map((text, i) => (
            <View key={i} className='card-insight-block'>
              <Text className='card-insight-text'>{parseBold(text)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='card-epiphany'>
        <Text className='card-epiphany-label'>一语道破 · Epiphany</Text>
        <View className='card-epiphany-divider' />
        <Text className='card-epiphany-en'>{data.epiphany.en}</Text>
        <Text className='card-epiphany-zh'>{data.epiphany.zh}</Text>
      </View>

      <View className='card-footer'>
        <Text className='card-footer-text'>词卡 · 先解词，后铸卡</Text>
        <Text className='card-footer-text'>{typeLabel}</Text>
      </View>
    </View>
  )
}
