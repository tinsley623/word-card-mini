import Taro from '@tarojs/taro'

const API_BASE = 'https://word-card-eight.vercel.app'

const DEMO_DATA = {
  '道': {
    word: '道',
    type: 'zh',
    pinyin: 'dào',
    brief: '道路；宇宙运行的法则',
    category: '哲学',
    origin: {
      description: '一个头颅（首）在十字路口（辶）中移动，象征着人在路径上的抉择与前行',
      coreSymbols: ['头颅', '十字路口', '移动'],
      symbolFormula: '意识 + 选择 + 前行 = 道',
      summary: '意识引领下的路径',
    },
    insights: [
      '「道」的甲骨文描绘了「首」在「行」（道路）中的意象，其最初画面是**人在岔路中用头脑选择方向**。这不仅是物理道路，更是**意识介入行动的起点**，将盲目行走升华为有目的的前行。',
      '从具体路径抽象为**万物运行的轨迹与法则**，是中国哲学的核心跃迁。它既是脚下之路，也是治国之道、自然天道。这种从具象到抽象的思维，使「道」成为理解**秩序、方法与终极真理**的枢纽。',
    ],
    epiphany: {
      en: 'The path is both the journey and the law that guides it.',
      zh: '道，既是行之路，亦是导之行之法',
    },
  },
  '意': {
    word: '意',
    type: 'zh',
    pinyin: 'yì',
    brief: '心之所向；意念与意义',
    category: '情感',
    origin: {
      description: '「音」在「心」上，声音抵达内心深处引发的回响与感悟',
      coreSymbols: ['声音', '心灵', '共鸣'],
      symbolFormula: '声音 + 心灵 + 共鸣 = 意',
      summary: '声音触及心灵的那一刻',
    },
    insights: [
      '「意」由「音」与「心」组成，描绘的是**声音抵达心灵时产生的内在回响**。这不是简单的听觉，而是**感知穿透表象后的深层理解**——当一个音符拨动心弦，意义便在那一刻诞生。',
      '从内心感受延伸为**意图、意义、意境**三重维度。意图是心的方向，意义是心的判断，意境是心的境界。这三者构成了人类从**感知到认知再到审美**的完整精神链条。',
    ],
    epiphany: {
      en: 'Meaning is born when sound reaches the heart.',
      zh: '意，乃声音抵达心灵时绽放的花',
    },
  },
  'Serendipity': {
    word: 'Serendipity',
    type: 'en',
    pinyin: '/ˌser.ənˈdɪp.ɪ.ti/',
    brief: '意外发现美好事物的能力',
    category: '哲学',
    origin: {
      description: '源自波斯童话《锡兰三王子》——三位王子总能在旅途中意外发现珍宝',
      coreSymbols: ['意外', '旅途', '珍宝'],
      symbolFormula: '好奇心 + 行走 + 敏锐 = 幸运的发现',
      summary: '命运对好奇心的奖赏',
    },
    insights: [
      'Serendipity 不是单纯的幸运，而是**准备好的心灵遇见意外时迸发的洞察力**。机遇只偏爱有准备的头脑。',
      '这个词揭示了**计划与混沌之间的创造力空间**。你必须**在行走中保持警觉，在秩序中留出缝隙**。',
    ],
    epiphany: {
      en: 'The universe hides its gifts in the cracks of your plans.',
      zh: '宇宙将礼物藏在你计划的缝隙里',
    },
  },
}

export async function analyzeWord(word) {
  try {
    const res = await Taro.request({
      url: `${API_BASE}/api/analyze`,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: { word },
      timeout: 60000,
    })

    if (res.statusCode === 200) {
      return res.data
    }

    if (res.statusCode === 500 && res.data?.error?.includes('not configured')) {
      return getDemoData(word)
    }

    throw new Error(res.data?.error || `API error: ${res.statusCode}`)
  } catch (err) {
    if (err.errMsg?.includes('request:fail') || err.errMsg?.includes('timeout')) {
      return getDemoData(word)
    }
    throw err
  }
}

function getDemoData(word) {
  if (DEMO_DATA[word]) return DEMO_DATA[word]

  const isChinese = /[\u4e00-\u9fff]/.test(word)
  return {
    word,
    type: isChinese ? 'zh' : 'en',
    pinyin: isChinese ? 'pīnyīn' : '/prəˌnʌn.siˈeɪ.ʃən/',
    brief: '释义加载中（请检查网络连接）',
    category: '未分类',
    origin: {
      description: `「${word}」的深层字源解析需要网络支持`,
      coreSymbols: ['待解析'],
      summary: '等待解析',
    },
    insights: [
      `当前为演示模式。网络连接恢复后，将为「${word}」生成完整的字源溯析、核心意象和深层哲思。`,
    ],
    epiphany: {
      en: 'Every word carries a universe within.',
      zh: '每一个字，都承载着一个宇宙',
    },
  }
}
