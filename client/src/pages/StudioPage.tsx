import { useState, useRef } from 'react'
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
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline'
import { useAppStore } from '../store/useAppStore'

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
  { id: '1', title: '暖暖', artist: '梁静茹', duration: 265, category: 'love', playCount: 15000000 },
  { id: '2', title: '起风了', artist: '买辣椒也用券', duration: 285, category: 'pop', playCount: 10000000 },
  { id: '3', title: '孤勇者', artist: '陈奕迅', duration: 240, category: 'pop', playCount: 9500000 },
  { id: '4', title: '晴天', artist: '周杰伦', duration: 267, category: 'pop', playCount: 8900000 },
  { id: '5', title: 'See You Again', artist: 'Wiz Khalifa', duration: 237, category: 'western', playCount: 8500000 },
  { id: '6', title: 'Shape of You', artist: 'Ed Sheeran', duration: 234, category: 'western', playCount: 8200000 },
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredSongs = mockSongs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleAnalyze = async (type: 'style' | 'melody') => {
    if (!sourceSong) return
    
    setIsAnalyzing(true)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (type === 'style') {
      setStyleAnalysis({
        genre: '流行',
        mood: '温暖',
        vocalType: '女声',
        bpm: 76,
        instruments: ['钢琴', '吉他', '弦乐'],
        harmony: '大调',
        mixingStyle: '温暖',
        confidence: 0.92,
      })
    } else {
      setMelodyFeatures({
        pitchRange: { min: 60, max: 88 },
        avgDuration: 0.6,
        intervals: [2, 3, 4, 5, 6],
        dynamics: [75, 85, 95, 80, 90],
        rhythmPattern: '4/4拍',
      })
    }
    
    setIsAnalyzing(false)
  }

  const handleGenerateLyrics = async () => {
    if (!styleAnalysis || !melodyFeatures) return
    
    setIsGenerating(true)
    
    // 模拟歌词生成
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const generatedLyrics = `【前奏】

【主歌1】
轻轻的吹过风
像你温柔的问候
阳光洒落在肩膀
暖暖的感觉在心头
每一次见到你
心跳都加速跳动

【副歌】
甜蜜的爱恋
像冬日里的温暖
咖啡的香气弥漫在空气
手牵手走
我们并肩走过四季
心中充满暖暖的幸福

【主歌2】
我想说你真的很好
你总是那么体贴
默默的付出爱
从来不求回报
爱一个人就想他开心
从心里暖暖的
你是最重要的存在

【副歌】
甜蜜的爱恋
像冬日里的温暖
咖啡的香气弥漫在空气
手牵手走
我们并肩走过四季
心中充满暖暖的幸福

【桥段】
我想说你真的很好
你总是那么体贴
默默的付出爱
从来不求回报
爱一个人就想他开心
从心里暖暖的
你是最重要的存在

【结尾】
轻轻的吹过风
像你温柔的问候
回忆里幸福的旋律
每一次想到你
脸上都露出笑容
因为我深深爱着你`

    setLyrics(generatedLyrics)
    setCustomLyrics(generatedLyrics)
    setIsGenerating(false)
  }

  const handleGenerateSong = async () => {
    if (!lyrics) return
    
    setIsGenerating(true)
    
    // 模拟歌曲生成
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    setGeneratedSong({
      id: 'generated-' + Date.now(),
      title: '暖暖的爱',
      audioUrl: '/outputs/generated-song.mp3',
      duration: 258,
      format: 'mp3',
      createdAt: new Date().toISOString(),
    })
    
    setIsGenerating(false)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSourceSong({
        id: 'local-' + Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: '本地文件',
        duration: 0,
        coverUrl: '',
        audioUrl: URL.createObjectURL(file),
      })
    }
  }

  const handleLyricsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomLyrics(e.target.value)
    setLyrics(e.target.value)
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
    alert(`正在下载 ${format.toUpperCase()} 格式...\n\n(演示模式)`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
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

      {/* Progress Bar */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step 0: Select Song */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">选择歌曲</h1>
              <p className="text-gray-400">选择一首参考歌曲，AI将分析其风格并创作新歌</p>
            </div>

            {/* Search and Upload */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Search */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MagnifyingGlassIcon className="w-5 h-5 text-cyan-400" />
                  搜索歌曲
                </h3>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="搜索歌曲或艺术家..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all"
                  />
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedCategory === cat.value
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Song List */}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredSongs.map((song) => (
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
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MusicalNoteIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-semibold truncate">{song.title}</div>
                          <div className="text-sm text-gray-400 truncate">{song.artist}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm text-gray-500">{formatDuration(song.duration)}</div>
                          <div className="text-xs text-gray-600">{formatPlayCount(song.playCount)}播放</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CloudArrowUpIcon className="w-5 h-5 text-pink-400" />
                  上传本地歌曲
                </h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp3,.wav,.m4a,.flac"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={handleFileUpload}
                  className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-cyan-400/50 transition-all"
                >
                  <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-white font-semibold mb-2">点击或拖拽上传音频文件</p>
                  <p className="text-sm text-gray-400">支持 MP3、WAV、M4A、FLAC 格式</p>
                  <p className="text-xs text-gray-500 mt-2">最大100MB</p>
                </div>
              </div>
            </div>

            {/* Selected Song */}
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
                    {sourceSong.duration > 0 && (
                      <div className="text-sm text-gray-500">时长: {formatDuration(sourceSong.duration)}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Style Analysis */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">风格分析</h1>
              <p className="text-gray-400">DeepSeek V4Pro 将分析歌曲的风格特征</p>
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
                      分析中...
                    </span>
                  ) : '开始风格分析'}
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <div className="text-cyan-400 font-bold text-lg">{styleAnalysis.genre}</div>
                      <div className="text-sm text-gray-400">曲风</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <div className="text-pink-400 font-bold text-lg">{styleAnalysis.mood}</div>
                      <div className="text-sm text-gray-400">情绪</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <div className="text-purple-400 font-bold text-lg">{styleAnalysis.vocalType}</div>
                      <div className="text-sm text-gray-400">人声</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <div className="text-emerald-400 font-bold text-lg">{styleAnalysis.bpm}</div>
                      <div className="text-sm text-gray-400">BPM</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-sm text-gray-400 mb-2">乐器配置</div>
                    <div className="flex flex-wrap gap-2">
                      {styleAnalysis.instruments.map((inst, idx) => (
                        <span key={idx} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                          {inst}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <p className="text-emerald-400 font-semibold">✓ 风格分析完成</p>
                    <p className="text-sm text-gray-400 mt-1">置信度: {(styleAnalysis.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Melody Analysis */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">旋律分析</h1>
              <p className="text-gray-400">提取歌曲的旋律特征</p>
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
                      分析中...
                    </span>
                  ) : '开始旋律分析'}
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-cyan-400 font-bold text-lg mb-2">音域范围</div>
                      <div className="text-white">MIDI {melodyFeatures.pitchRange.min} - {melodyFeatures.pitchRange.max}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-pink-400 font-bold text-lg mb-2">节奏模式</div>
                      <div className="text-white">{melodyFeatures.rhythmPattern}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-sm text-gray-400 mb-3">力度变化</div>
                    <div className="flex items-end gap-2 h-24">
                      {melodyFeatures.dynamics.map((dyn, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-gradient-to-t from-cyan-500 to-pink-500 rounded-t"
                            style={{ height: `${dyn}%` }}
                          />
                          <span className="text-xs text-gray-500 mt-1">{dyn}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <p className="text-emerald-400 font-semibold">✓ 旋律分析完成</p>
                    <p className="text-sm text-gray-400 mt-1">已提取 {melodyFeatures.intervals.length} 种主要音程</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Lyrics Generation */}
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
                      生成中...
                    </span>
                  ) : 'AI生成歌词'}
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">歌词编辑</label>
                    <textarea
                      value={customLyrics}
                      onChange={handleLyricsChange}
                      rows={16}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all resize-none"
                      placeholder="编辑歌词..."
                    />
                  </div>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <p className="text-emerald-400 font-semibold">✓ 歌词已生成</p>
                    <p className="text-sm text-gray-400 mt-1">共 {customLyrics.split('\n').filter(l => l.trim()).length} 行</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Song Generation */}
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
                      生成中...
                    </span>
                  ) : '开始生成歌曲'}
                </button>
              ) : (
                <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-400/30 rounded-xl">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <MusicalNoteIcon className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold text-xl mb-1">{generatedSong.title}</div>
                      <div className="text-gray-400 mb-2">时长: {formatDuration(generatedSong.duration)}</div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">✓ 生成完成</span>
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">{generatedSong.format.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Download */}
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
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <MusicalNoteIcon className="w-12 h-12 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-2xl mb-2">{generatedSong.title}</div>
                        <div className="text-gray-400 mb-2">时长: {formatDuration(generatedSong.duration)}</div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">✓ 侵权检测通过</span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">低风险</span>
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
                      <div className="text-sm opacity-80">16bit 无损</div>
                    </button>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <h4 className="text-white font-semibold mb-2">💡 使用提示</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• MP3 适合日常分享和网络传输</li>
                      <li>• WAV 适合后期编辑和专业制作</li>
                      <li>• 生成歌曲仅供个人学习使用</li>
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

        {/* Navigation Buttons */}
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

      <style>{`
        .gradient-text {
          background: linear-gradient(to right, #22d3ee, #ec4899, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  )
}
