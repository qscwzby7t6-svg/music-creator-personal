import { Link } from 'react-router-dom'
import { SparklesIcon, MusicalNoteIcon, ShieldCheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const features = [
  {
    icon: SparklesIcon,
    title: 'AI智能分析',
    description: '基于DeepSeek V4Pro深度学习模型，精准分析歌曲风格与旋律特征',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: MusicalNoteIcon,
    title: '智能创作',
    description: '结合风格提示词与旋律提示词，生成原创歌曲，支持3-5分钟时长',
    color: 'from-pink-400 to-rose-500',
  },
  {
    icon: ShieldCheckIcon,
    title: '侵权检测',
    description: '多维度版权检测系统，确保生成歌曲的原创性与合法性',
    color: 'from-emerald-400 to-teal-500',
  },
]

const steps = [
  { step: '01', title: '选择歌曲', desc: '搜索热门歌曲或上传自定义歌曲' },
  { step: '02', title: 'AI风格分析', desc: 'DeepSeek深度分析曲风、情绪、乐器等特征' },
  { step: '03', title: '旋律特征提取', desc: '提取音高、时长、音程、力度等旋律信息' },
  { step: '04', title: '歌词创作', desc: 'AI生成原创歌词，自动过滤敏感词' },
  { step: '05', title: '歌曲生成', desc: 'MiniMax music-2.6合成完整歌曲' },
  { step: '06', title: '侵权检测与导出', desc: '确保原创性，下载MP3/WAV格式' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Animated badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-sm text-gray-300">Powered by DeepSeek V4Pro & MiniMax</span>
            </div>

            {/* Main heading */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
                AI Song Generator
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              基于先进的AI技术，自动分析原曲风格与旋律特征，
              <br />
              创作独一无二的原创歌曲
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/studio"
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  开始创作
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <Link
                to="/library"
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full font-semibold text-white hover:bg-white/10 transition-all duration-300"
              >
                查看歌曲库
              </Link>
            </div>

            {/* Waveform animation */}
            <div className="flex items-center justify-center gap-1 h-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-cyan-400 to-pink-500 rounded-full animate-wave"
                  style={{
                    height: `${Math.random() * 60 + 20}px`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`inline-flex p-3 bg-gradient-to-br ${feature.color} rounded-xl mb-6`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>

                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>

                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                创作流程
              </span>
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              简单六步，轻松创作专属原创歌曲
            </p>

            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-pink-500 to-purple-500"></div>

              <div className="space-y-12">
                {steps.map((item, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col gap-8`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center md:text-left`}>
                      <div className="inline-block px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                        <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent mb-2">
                          {item.step}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="hidden md:flex w-4 h-4 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-full border-4 border-gray-900 z-10"></div>

                    <div className="flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative p-12 bg-gradient-to-br from-cyan-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-pink-500/5"></div>

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  准备好开始创作了吗？
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  加入我们，开始您的AI音乐创作之旅
                </p>

                <Link
                  to="/studio"
                  className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full font-bold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
                >
                  立即开始
                  <ArrowRightIcon className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-12 px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400 mb-2">
              AI Song Generator © {new Date().getFullYear()} - 智能仿写歌曲创作平台
            </p>
            <p className="text-sm text-gray-500">
              Powered by DeepSeek V4Pro & MiniMax music-2.6
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }

        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
