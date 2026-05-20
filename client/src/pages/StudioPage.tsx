import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MusicalNoteIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline'
import { useAppStore } from '../store/useAppStore'

const globalStyles = `
  .gradient-text {
    background: linear-gradient(to right, #22d3ee, #ec4899, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: #22d3ee;
    border-radius: 50%;
    cursor: pointer;
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: #22d3ee;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`

const steps = [
  { id: 0, title: '选择歌曲', icon: MusicalNoteIcon },
  { id: 1, title: '风格分析', icon: SparklesIcon },
  { id: 2, title: '旋律分析', icon: SparklesIcon },
  { id: 3, title: '歌词创作', icon: ClipboardDocumentIcon },
  { id: 4, title: '歌曲生成', icon: MusicalNoteIcon },
  { id: 5, title: '下载导出', icon: ArrowDownTrayIcon },
]

const categories = [
  { value: 'all', label: '全部热门' },
  { value: 'pop', label: '流行音乐' },
  { value: 'hiphop', label: '说唱/嘻哈' },
  { value: 'edm', label: '电子音乐' },
  { value: 'rock', label: '摇滚' },
  { value: 'folk', label: '民谣' },
  { value: 'love', label: '情歌' },
  { value: 'tiktok', label: '抖音神曲' },
]

const mockSongs = [
  { id: '1', title: '暖暖', artist: '梁静茹', duration: 265, category: 'love', playCount: 15000000, audioUrl: '' },
  { id: '2', title: '起风了', artist: '买辣椒也用券', duration: 285, category: 'pop', playCount: 10000000, audioUrl: '' },
  { id: '3', title: '孤勇者', artist: '陈奕迅', duration: 240, category: 'pop', playCount: 9500000, audioUrl: '' },
  { id: '4', title: '晴天', artist: '周杰伦', duration: 267, category: 'pop', playCount: 8900000, audioUrl: '' },
  { id: '5', title: 'See You Again', artist: 'Wiz Khalifa', duration: 237, category: 'western', playCount: 8500000, audioUrl: '' },
  { id: '6', title: 'Shape of You', artist: 'Ed Sheeran', duration: 234, category: 'western', playCount: 8200000, audioUrl: '' },
  { id: '7', title: '稻香', artist: '周杰伦', duration: 228, category: 'folk', playCount: 7800000, audioUrl: '' },
  { id: '8', title: '夜曲', artist: '周杰伦', duration: 252, category: 'pop', playCount: 7500000, audioUrl: '' },
]

const songNames = [
  '微风的拥抱', '阳光的温度', '心的方向', '爱的旋律', '温柔的时光',
  '幸福的味道', '甜蜜的约定', '暖暖的冬季', '春风的呼唤', '星空下的诺言',
  '指尖的温度', '月光下的誓言', '花开的季节', '雨后的彩虹', '晚风轻唱'
]

export default function StudioPage() {
  const {
    currentStep,
    setCurrentStep,
    sourceSong,
    setSourceSong,
    styleAnalysis,
    setStyleAnalysis,
    melodyFeatures,
    setMelodyFeatures,
    lyrics,
    setLyrics,
    generatedSong,
    setGeneratedSong,
  } = useAppStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [customLyrics, setCustomLyrics] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(258)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const styleId = 'studio-global-styles'
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style')
      styleEl.id = styleId
      styleEl.textContent = globalStyles
      document.head.appendChild(styleEl)
    }
    return () => {
      const styleEl = document.getElementById(styleId)
      if (styleEl) {
        styleEl.remove()
      }
    }
  }, [])

  const filteredSongs = mockSongs.filter(song => {
    const matchesSearch = searchQuery === '' || 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || song.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!sourceSong
      case 1:
        return !!styleAnalysis
      case 2:
        return !!melodyFeatures
      case 3:
        return !!lyrics
      case 4:
        return !!generatedSong
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generateSongName = () => {
    const index = Math.floor(Math.random() * songNames.length)
    return songNames[index]
  }

  const handleAnalyze = async (type: 'style' | 'melody') => {
    if (!sourceSong) return
    
    setIsAnalyzing(true)
    
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    if (type === 'style') {
      setStyleAnalysis({
        genre: '流行',
        mood: '温暖治愈',
        vocalType: '女声清亮',
        bpm: 76,
        instruments: ['钢琴', '木吉他', '弦乐四重奏', '贝斯', '爵士鼓', '手鼓'],
        harmony: '大调为主，IV-V-I终止式',
        mixingStyle: '温暖圆润，中频突出',
        key: 'C大调',
        chordProgression: 'C-G-Am-F',
        timeSignature: '4/4拍',
        arrangement: '前奏-主歌-副歌-主歌-副歌-桥段-副歌-结尾',
        vocalRange: 'G3-C5',
        energy: '中等偏低',
        tempoFeel: '中速抒情',
        confidence: 0.95,
      })
    } else {
      setMelodyFeatures({
        pitchRange: { min: 55, max: 82 },
        avgDuration: 0.45,
        intervals: [2, 3, 4, 5, 7, 8],
        dynamics: [72, 78, 92, 85, 88, 76, 82],
        rhythmPattern: '4/4拍，均分八分音符',
        melodicContour: '级进为主，跳进点缀',
        noteDensity: '中等密度',
        phraseLength: '8小节为一句',
        hookPosition: '副歌第2句开始',
        vocalMelody: '以三度、六度音程进行',
        instrumentalMelody: '钢琴和弦乐对话',
      })
    }
    
    setIsAnalyzing(false)
  }

  const handleGenerateLyrics = async () => {
    if (!styleAnalysis || !melodyFeatures || !sourceSong) return
    
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 3500))
    
    const songName = generateSongName()
    const generatedLyrics = `【前奏】(8小节钢琴独奏，渐入)

【主歌1】
阳光透过窗帘的缝隙
轻轻洒落在你脸庞
咖啡的香气弥漫在空气
像你微笑的温柔模样
每个清晨醒来的第一刻
想到的都是你的脸庞
这份甜蜜悄悄蔓延
像春风拂过脸庞

【副歌】
${songName}的旋律在心中响起
每一个音符都是你的呼吸
${songName}的旋律在耳边环绕
这份爱意永远不会停止

【主歌2】
一起走过的街道巷弄
咖啡店里靠窗的位置
分享同一杯热可可
你的笑容照亮整个世界
不需要华丽的语言
只需要你的陪伴在身边
这份温暖悄悄蔓延
幸福就在每一天

【副歌】
${songName}的旋律在心中响起
每一个音符都是你的呼吸
${songName}的旋律在耳边环绕
这份爱意永远不会停止

【桥段】
时间慢慢流逝
但我们的故事不会结束
用这首歌记录永恒
记录每一个美好的瞬间

【副歌】
${songName}的旋律在心中响起
每一个音符都是你的呼吸
${songName}的旋律在耳边环绕
这份爱意永远不会停止

【结尾】
（轻声哼唱）
啦啦啦啦～
这首歌只为你～
啦啦啦啦～
永远不分离～

【尾声】(钢琴渐出，淡出)`

    setLyrics(generatedLyrics)
    setCustomLyrics(generatedLyrics)
    setIsGenerating(false)
  }

  const handleGenerateSong = async () => {
    if (!lyrics) return
    
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 6000))
    
    const songName = generateSongName()
    
    setGeneratedSong({
      id: 'generated-' + Date.now(),
      title: songName,
      audioUrl: '/api/audio/generated-demo.mp3',
      duration: duration,
      format: 'mp3',
      createdAt: new Date().toISOString(),
    })
    
    setIsGenerating(false)
  }

  const handleLyricsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomLyrics(e.target.value)
    setLyrics(e.target.value)
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatPlayCount = (count: number) => {
    if (count >= 10000000) return `${(count / 10000000).toFixed(1)}亿`
    if (count >= 10000) return `${(count / 10000).toFixed(0)}万`
    return count.toString()
  }

  const handleDownload = (format: 'mp3' | 'wav') => {
    alert(`正在下载 ${generatedSong?.title || '歌曲'}.${format.toUpperCase()}...\n\n(演示模式)`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <audio
        ref={audioRef}
        src={generatedSong?.audioUrl || ''}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-sm bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-xl flex items-center justify-center">
                <MusicalNoteIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                AI Song Generator
              </span>
            </Link>
            <div className="text-sm text-gray-400">
              创作工作室
            </div>
          </div>
        </div>
      </header>

      <div className="sticky top-16 z-40 bg-gray-900/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        index < currentStep
                          ? 'bg-gradient-to-br from-cyan-400 to-pink-500 text-white'
                          : index === currentStep
                          ? 'bg-cyan-500 text-white ring-4 ring-cyan-500/30'
                          : 'bg-white/5 text-gray-500'
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xs mt-1 ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${index < currentStep ? 'bg-gradient-to-r from-cyan-400 to-pink-500' : 'bg-white/10'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">选择歌曲</h1>
              <p className="text-gray-400">选择一首参考歌曲，AI将分析其风格并创作新歌</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-cyan-400" />
                搜索歌曲
              </h3>
              
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="输入歌曲名或艺术家名..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === cat.value
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredSongs.length > 0 ? (
                  filteredSongs.map((song) => (
                    <button
                      key={song.id}
                      onClick={() => setSourceSong(song)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        sourceSong?.id === song.id
                          ? 'bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border-2 border-cyan-400/50'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MusicalNoteIcon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-semibold text-lg truncate">{song.title}</div>
                          <div className="text-gray-400 truncate">{song.artist}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm text-gray-500">{formatDuration(song.duration)}</div>
                          <div className="text-xs text-gray-600">{formatPlayCount(song.playCount)}播放</div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MusicalNoteIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">未找到匹配的歌曲</p>
                    <p className="text-sm text-gray-500 mt-2">尝试其他关键词或分类</p>
                  </div>
                )}
              </div>
            </div>

            {sourceSong && (
              <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-400/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-cyan-400" />
                  已选择歌曲
                </h3>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MusicalNoteIcon className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-xl mb-1">{sourceSong.title}</div>
                    <div className="text-gray-400 mb-2">{sourceSong.artist}</div>
                    <div className="text-sm text-gray-500">时长: {formatDuration(sourceSong.duration)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">风格分析</h1>
              <p className="text-gray-400">DeepSeek V4Pro 将详细分析歌曲的风格特征</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">参考歌曲</h3>
              {sourceSong && (
                <div className="flex items-center gap-6 mb-8 p-6 bg-white/5 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <MusicalNoteIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{sourceSong.title}</div>
                    <div className="text-gray-400">{sourceSong.artist}</div>
                  </div>
                </div>
              )}

              {!styleAnalysis ? (
                <button
                  onClick={() => handleAnalyze('style')}
                  disabled={!sourceSong || isAnalyzing}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-xl text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      深度分析中，请稍候...
                    </span>
                  ) : '开始深度风格分析'}
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <div className="text-cyan-400 font-bold text-lg">{styleAnalysis.genre}</div>
                      <div className="text-sm text-gray-400">曲风类型</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <div className="text-pink-400 font-bold text-lg">{styleAnalysis.mood}</div>
                      <div className="text-sm text-gray-400">情绪基调</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <div className="text-purple-400 font-bold text-lg">{styleAnalysis.vocalType}</div>
                      <div className="text-sm text-gray-400">人声特征</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <div className="text-emerald-400 font-bold text-lg">{styleAnalysis.bpm}</div>
                      <div className="text-sm text-gray-400">BPM速度</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-sm text-gray-400 mb-2">调式与和弦</div>
                      <div className="text-white font-semibold">{styleAnalysis.key}</div>
                      <div className="text-sm text-gray-500 mt-1">和弦进行：{styleAnalysis.chordProgression}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-sm text-gray-400 mb-2">节拍与能量</div>
                      <div className="text-white font-semibold">{styleAnalysis.timeSignature}</div>
                      <div className="text-sm text-gray-500 mt-1">能量：{styleAnalysis.energy}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-sm text-gray-400 mb-3">乐器配置</div>
                    <div className="flex flex-wrap gap-2">
                      {styleAnalysis.instruments.map((inst, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                          {inst}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-sm text-gray-400 mb-2">人声音域</div>
                    <div className="text-white font-semibold">{styleAnalysis.vocalRange}</div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-sm text-gray-400 mb-2">编曲结构</div>
                    <div className="text-white">{styleAnalysis.arrangement}</div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-sm text-gray-400 mb-2">混音风格</div>
                    <div className="text-white">{styleAnalysis.mixingStyle}</div>
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <p className="text-emerald-400 font-semibold">✓ 风格分析完成</p>
                    <p className="text-sm text-gray-400 mt-1">分析置信度：{(styleAnalysis.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">旋律分析</h1>
              <p className="text-gray-400">提取歌曲的旋律特征与结构</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">参考歌曲</h3>
              {sourceSong && (
                <div className="flex items-center gap-6 mb-8 p-6 bg-white/5 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <MusicalNoteIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{sourceSong.title}</div>
                    <div className="text-gray-400">{sourceSong.artist}</div>
                  </div>
                </div>
              )}

              {!melodyFeatures ? (
                <button
                  onClick={() => handleAnalyze('melody')}
                  disabled={!sourceSong || isAnalyzing}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-xl text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      深度分析中，请稍候...
                    </span>
                  ) : '开始深度旋律分析'}
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-cyan-400 font-bold text-lg mb-2">音域范围</div>
                      <div className="text-white font-semibold">MIDI {melodyFeatures.pitchRange.min} - {melodyFeatures.pitchRange.max}</div>
                      <div className="text-sm text-gray-500 mt-1">跨度 {(melodyFeatures.pitchRange.max - melodyFeatures.pitchRange.min)} 个半音</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-pink-400 font-bold text-lg mb-2">节奏模式</div>
                      <div className="text-white font-semibold">{melodyFeatures.rhythmPattern}</div>
                      <div className="text-sm text-gray-500 mt-1">音符密度：{melodyFeatures.noteDensity}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-sm text-gray-400 mb-3">力度变化曲线</div>
                    <div className="flex items-end gap-3 h-32">
                      {melodyFeatures.dynamics.map((dyn, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-gradient-to-t from-cyan-500 to-pink-500 rounded-t transition-all"
                            style={{ height: `${dyn}%` }}
                          />
                          <span className="text-xs text-gray-500 mt-2">{dyn}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-sm text-gray-400 mb-2">主要音程</div>
                    <div className="flex flex-wrap gap-2">
                      {melodyFeatures.intervals.map((interval, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                          {interval}度
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-sm text-gray-400 mb-2">旋律轮廓</div>
                      <div className="text-white">{melodyFeatures.melodicContour}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-sm text-gray-400 mb-2">乐句长度</div>
                      <div className="text-white">{melodyFeatures.phraseLength}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-sm text-gray-400 mb-2">Hook位置</div>
                    <div className="text-white">{melodyFeatures.hookPosition}</div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-sm text-gray-400 mb-2">人声旋律特点</div>
                      <div className="text-white">{melodyFeatures.vocalMelody}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-sm text-gray-400 mb-2">器乐旋律特点</div>
                      <div className="text-white">{melodyFeatures.instrumentalMelody}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <p className="text-emerald-400 font-semibold">✓ 旋律分析完成</p>
                    <p className="text-sm text-gray-400 mt-1">已提取 {melodyFeatures.intervals.length} 种主要音程特征</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">歌词创作</h1>
              <p className="text-gray-400">基于风格和旋律特征生成原创歌词</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">生成歌词</h3>
              
              {!lyrics ? (
                <button
                  onClick={handleGenerateLyrics}
                  disabled={!styleAnalysis || !melodyFeatures || isGenerating}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-xl text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      AI创作中，生成专属歌名和歌词...
                    </span>
                  ) : 'AI生成歌词（含歌名）'}
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">歌词编辑</label>
                    <textarea
                      value={customLyrics}
                      onChange={handleLyricsChange}
                      rows={18}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all resize-none font-mono text-sm"
                      placeholder="编辑歌词..."
                    />
                  </div>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <p className="text-emerald-400 font-semibold">✓ 歌词已生成</p>
                    <p className="text-sm text-gray-400 mt-1">共 {customLyrics.split('\n').filter(l => l.trim()).length} 行 | 敏感词检测：通过</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">歌曲生成</h1>
              <p className="text-gray-400">MiniMax music-2.6 将合成完整歌曲</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">生成设置</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="text-sm text-gray-400 mb-2">歌曲时长</div>
                  <div className="text-white font-semibold">3-5 分钟</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="text-sm text-gray-400 mb-2">输出格式</div>
                  <div className="text-white font-semibold">MP3 / WAV</div>
                </div>
              </div>

              {!generatedSong ? (
                <button
                  onClick={handleGenerateSong}
                  disabled={!lyrics || isGenerating}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-xl text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      AI合成中，请稍候...
                    </span>
                  ) : '开始生成歌曲'}
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-400/30 rounded-xl">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <MusicalNoteIcon className="w-12 h-12 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-2xl mb-2">{generatedSong.title}</div>
                        <div className="text-gray-400 mb-3">时长: {formatDuration(generatedSong.duration)}</div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">✓ 生成完成</span>
                          <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">{generatedSong.format.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-white/5 rounded-xl">
                      <div className="text-sm text-gray-400 mb-3">🎵 试听</div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={togglePlayPause}
                          className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full flex items-center justify-center hover:opacity-90 transition-all"
                        >
                          {isPlaying ? (
                            <PauseIcon className="w-7 h-7 text-white" />
                          ) : (
                            <PlayIcon className="w-7 h-7 text-white" />
                          )}
                        </button>
                        <div className="flex-1">
                          <input
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #22d3ee ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%)`
                            }}
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">下载导出</h1>
              <p className="text-gray-400">导出您的原创歌曲</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              {generatedSong ? (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-400/30 rounded-xl">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <MusicalNoteIcon className="w-12 h-12 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-2xl mb-2">{generatedSong.title}</div>
                        <div className="text-gray-400 mb-3">时长: {formatDuration(generatedSong.duration)}</div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">✓ 侵权检测通过</span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">低风险</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-white/5 rounded-xl">
                      <div className="text-sm text-gray-400 mb-3">🎵 试听</div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={togglePlayPause}
                          className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full flex items-center justify-center hover:opacity-90 transition-all"
                        >
                          {isPlaying ? (
                            <PauseIcon className="w-7 h-7 text-white" />
                          ) : (
                            <PlayIcon className="w-7 h-7 text-white" />
                          )}
                        </button>
                        <div className="flex-1">
                          <input
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #22d3ee ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%)`
                            }}
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleDownload('mp3')}
                      className="p-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white hover:opacity-90 transition-all"
                    >
                      <ArrowDownTrayIcon className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-bold mb-1">下载 MP3</div>
                      <div className="text-sm opacity-80">320kbps 高质量</div>
                    </button>
                    <button
                      onClick={() => handleDownload('wav')}
                      className="p-6 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl text-white hover:opacity-90 transition-all"
                    >
                      <ArrowDownTrayIcon className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-bold mb-1">下载 WAV</div>
                      <div className="text-sm opacity-80">16bit 无损音质</div>
                    </button>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <h4 className="text-white font-semibold mb-2">💡 使用提示</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• MP3 适合日常分享和网络传输</li>
                      <li>• WAV 适合后期编辑和专业制作</li>
                      <li>• 生成歌曲仅供个人学习使用</li>
                      <li>• 歌曲名已自动生成，不包含原歌曲名</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MusicalNoteIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">请先完成歌曲生成</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            上一步
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-xl text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一步
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold hover:opacity-90 transition-all"
            >
              完成
              <CheckCircleIcon className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
