import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MusicalNoteIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline'
import { useAppStore } from '../store/useAppStore'

const steps = [
  { id: 0, title: '选择歌曲', icon: MusicalNoteIcon },
  { id: 1, title: '风格分析', icon: SparklesIcon },
  { id: 2, title: '旋律分析', icon: SparklesIcon },
  { id: 3, title: '歌词创作', icon: ClipboardDocumentIcon },
  { id: 4, title: '歌曲生成', icon: MusicalNoteIcon },
  { id: 5, title: '下载导出', icon: CheckCircleIcon },
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
  { id: '1', title: '暖暖', artist: '梁静茹', duration: 265, category: 'love' },
  { id: '2', title: '起风了', artist: '买辣椒也用券', duration: 285, category: 'pop' },
  { id: '3', title: '孤勇者', artist: '陈奕迅', duration: 240, category: 'pop' },
  { id: '4', title: '晴天', artist: '周杰伦', duration: 267, category: 'pop' },
]

export default function StudioPage() {
  const {
    currentStep,
    setCurrentStep,
    sourceSong,
    setSourceSong,
    styleAnalysis,
    melodyFeatures,
    lyrics,
    generatedSong,
  } = useAppStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

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
    if (canProceed() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const CurrentStepIcon = steps[currentStep]?.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="relative border-b border-white/10 backdrop-blur-sm bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-xl flex items-center justify-center">
                <MusicalNoteIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                AI Song Generator
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                创作工作室
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index < currentStep
                        ? 'bg-gradient-to-br from-cyan-400 to-pink-500 text-white'
                        : index === currentStep
                        ? 'bg-white/10 border-2 border-cyan-400 text-white'
                        : 'bg-white/5 border border-white/10 text-gray-500'
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs mt-2 ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`w-16 md:w-32 h-0.5 mx-2 transition-all duration-300 ${
                      index < currentStep ? 'bg-gradient-to-r from-cyan-400 to-pink-500' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Panel - Steps Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 min-h-[600px]">
              {/* Step 0: Select Song */}
              {currentStep === 0 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">选择歌曲</h2>
                    <p className="text-gray-400">选择一首参考歌曲，AI将分析其风格并创作新歌</p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索歌曲或艺术家..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all"
                    />
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
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

                  {/* Song List */}
                  <div className="space-y-3">
                    {mockSongs.map((song) => (
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
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <MusicalNoteIcon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-semibold">{song.title}</div>
                            <div className="text-sm text-gray-400">{song.artist}</div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Selected Song */}
                  {sourceSong && (
                    <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-400/30 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <MusicalNoteIcon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-bold text-lg">{sourceSong.title}</div>
                          <div className="text-gray-400">{sourceSong.artist}</div>
                        </div>
                        <CheckCircleIcon className="w-8 h-8 text-cyan-400" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1-5: Placeholder content */}
              {currentStep > 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                      {CurrentStepIcon && <CurrentStepIcon className="w-12 h-12 text-cyan-400" />}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{steps[currentStep].title}</h3>
                    <p className="text-gray-400">步骤开发中...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                上一步
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-xl text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一步
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Panel - Info */}
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">当前状态</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">歌曲选择</span>
                  <span className={sourceSong ? 'text-cyan-400' : 'text-gray-500'}>
                    {sourceSong ? '✓ 已选择' : '待选择'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">风格分析</span>
                  <span className={styleAnalysis ? 'text-cyan-400' : 'text-gray-500'}>
                    {styleAnalysis ? '✓ 已完成' : '待分析'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">旋律分析</span>
                  <span className={melodyFeatures ? 'text-cyan-400' : 'text-gray-500'}>
                    {melodyFeatures ? '✓ 已完成' : '待分析'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">歌词创作</span>
                  <span className={lyrics ? 'text-cyan-400' : 'text-gray-500'}>
                    {lyrics ? '✓ 已完成' : '待创作'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">歌曲生成</span>
                  <span className={generatedSong ? 'text-cyan-400' : 'text-gray-500'}>
                    {generatedSong ? '✓ 已完成' : '待生成'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">💡 提示</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>• 选择您喜欢的歌曲作为参考</p>
                <p>• AI将学习歌曲的风格特点</p>
                <p>• 生成的新歌将保持相似风格</p>
                <p>• 支持3-5分钟的歌曲长度</p>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">创作进度</h3>
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                步骤 {currentStep + 1} / {steps.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

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
