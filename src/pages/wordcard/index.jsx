import { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Canvas } from '@tarojs/components'
import { analyzeWord } from '../../api/analyze'
import CardContent from '../../components/CardContent'
import './index.scss'

export default function WordCard() {
  const router = useRouter()
  const word = decodeURIComponent(router.params.word || '')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!word) return
    setLoading(true)
    setError(null)
    setData(null)

    analyzeWord(word)
      .then((result) => {
        setData(result)
        Taro.setNavigationBarTitle({ title: `词卡 · ${result.word}` })
      })
      .catch((err) => setError(err.message || '解析失败'))
      .finally(() => setLoading(false))
  }, [word])

  const handleSaveImage = async () => {
    if (!data) return
    try {
      Taro.showLoading({ title: '生成图片中...' })

      const sysInfo = Taro.getSystemInfoSync()
      const dpr = sysInfo.pixelRatio
      const canvasWidth = 650
      const canvasHeight = 1100
      const ctx = Taro.createCanvasContext('cardCanvas')

      const scale = dpr
      ctx.scale(1, 1)

      // Background
      ctx.setFillStyle('#f5f0e8')
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Header
      ctx.setFontSize(20)
      ctx.setFillStyle('#b5a898')
      ctx.fillText(`REF · ${data.category} / ${data.word}`, 40, 50)

      const typeLabel = data.type === 'zh' ? '汉字' : '英文'
      const today = new Date().toISOString().split('T')[0]
      ctx.setFontSize(16)
      ctx.setFillStyle('#8a7d6b')
      ctx.fillText(`${typeLabel}  ${today}`, 40, 80)

      // Main character
      ctx.setFontSize(80)
      ctx.setFillStyle('#3d3529')
      ctx.fillText(data.word, 40, 180)

      // Pinyin + brief
      ctx.setFontSize(22)
      ctx.setFillStyle('#8a7d6b')
      ctx.fillText(data.pinyin, 40, 215)
      ctx.setFontSize(22)
      ctx.setFillStyle('#6b5e4f')
      ctx.fillText(data.brief, 40, 250)

      // Origin section
      ctx.setFillStyle('#6b5e4f')
      ctx.setFontSize(14)
      ctx.fillText('原始画面 · ORIGIN', 40, 290)
      ctx.setFillStyle('#5a4f40')
      ctx.setFontSize(18)
      wrapText(ctx, data.origin.description.replace(/\*\*/g, ''), 40, 320, 570, 28)

      // Core symbols
      const symbolY = 420
      ctx.setFontSize(14)
      ctx.setFillStyle('#8a7d6b')
      ctx.fillText('核心意象 · Core Symbol', 40, symbolY)
      let symX = 40
      ctx.setFontSize(18)
      data.origin.coreSymbols.forEach((s) => {
        ctx.setStrokeStyle('#c8bfb0')
        ctx.setLineWidth(1)
        const tw = ctx.measureText(s).width + 24
        ctx.strokeRect(symX, symbolY + 10, tw, 36)
        ctx.setFillStyle('#6b5e4f')
        ctx.fillText(s, symX + 12, symbolY + 36)
        symX += tw + 16
      })

      if (data.origin.symbolFormula) {
        ctx.setFontSize(18)
        ctx.setFillStyle('#a0876b')
        ctx.fillText(data.origin.symbolFormula, 40, symbolY + 70)
      }

      // Summary
      ctx.setFontSize(14)
      ctx.setFillStyle('#8a7d6b')
      ctx.fillText('意象归结', 40, symbolY + 110)
      ctx.setFontSize(18)
      ctx.setFillStyle('#6b5e4f')
      wrapText(ctx, (data.origin.summary || '').replace(/\*\*/g, ''), 40, symbolY + 140, 570, 28)

      // Insights
      let insightY = symbolY + 200
      ctx.setFontSize(14)
      ctx.setFillStyle('#6b5e4f')
      ctx.fillText('深层解析 · INSIGHT', 40, insightY)
      insightY += 30
      ctx.setFontSize(16)
      ctx.setFillStyle('#5a4f40')
      data.insights.forEach((text) => {
        const clean = text.replace(/\*\*/g, '')
        insightY = wrapText(ctx, clean, 50, insightY, 550, 26)
        insightY += 16
      })

      // Epiphany
      const epiY = Math.min(insightY + 20, canvasHeight - 160)
      ctx.setFillStyle('#3d3529')
      ctx.fillRect(0, epiY, canvasWidth, 140)
      ctx.setFontSize(14)
      ctx.setFillStyle('#b5a898')
      ctx.fillText('一语道破 · Epiphany', canvasWidth / 2 - 70, epiY + 30)
      ctx.setFontSize(20)
      ctx.setFillStyle('#f5f0e8')
      wrapText(ctx, data.epiphany.en, 40, epiY + 60, 570, 28)
      ctx.setFontSize(18)
      ctx.setFillStyle('#c8bfb0')
      ctx.fillText(data.epiphany.zh, 40, epiY + 110)

      ctx.draw(false, () => {
        setTimeout(() => {
          Taro.canvasToTempFilePath({
            canvasId: 'cardCanvas',
            width: canvasWidth,
            height: canvasHeight,
            destWidth: canvasWidth * dpr,
            destHeight: canvasHeight * dpr,
            success: (res) => {
              Taro.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  Taro.hideLoading()
                  Taro.showToast({ title: '已保存到相册', icon: 'success' })
                },
                fail: () => {
                  Taro.hideLoading()
                  Taro.showToast({ title: '保存失败', icon: 'none' })
                },
              })
            },
            fail: () => {
              Taro.hideLoading()
              Taro.showToast({ title: '图片生成失败', icon: 'none' })
            },
          })
        }, 300)
      })
    } catch (err) {
      Taro.hideLoading()
      Taro.showToast({ title: '保存失败', icon: 'none' })
    }
  }

  return (
    <View className='wordcard-page'>
      {loading && (
        <View className='card-loading'>
          <Text className='loading-char'>{word}</Text>
          <Text className='loading-text'>正在解析「{word}」的灵魂...</Text>
        </View>
      )}

      {error && (
        <View className='card-error'>
          <Text className='error-title'>解析失败</Text>
          <Text className='error-msg'>{error}</Text>
          <View className='retry-btn' onClick={() => Taro.navigateBack()}>
            <Text>返回首页</Text>
          </View>
        </View>
      )}

      {data && (
        <View>
          <CardContent data={data} />
          <View className='save-btn' onClick={handleSaveImage}>
            <Text className='save-btn-text'>保存词卡图片</Text>
          </View>
        </View>
      )}

      <Canvas
        canvasId='cardCanvas'
        style='width: 650px; height: 1100px; position: fixed; left: -9999px; top: 0;'
      />
    </View>
  )
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = text.split('')
  let line = ''
  let currentY = y

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i]
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line, x, currentY)
      line = chars[i]
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY)
    currentY += lineHeight
  }
  return currentY
}
