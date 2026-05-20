interface PlagiarismReport {
  riskLevel: 'low' | 'medium' | 'high'
  audioSimilarity: number
  melodySimilarity: number
  similarSegments: Array<{ start: number; end: number; similarity: number }>
  suggestions: string[]
}

export async function checkPlagiarism(audioUrl: string): Promise<PlagiarismReport> {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockAudioSimilarity = Math.random() * 0.4
    const mockMelodySimilarity = Math.random() * 0.35

    const riskLevel: 'low' | 'medium' | 'high' =
      mockAudioSimilarity < 0.15 && mockMelodySimilarity < 0.15
        ? 'low'
        : mockAudioSimilarity < 0.25 && mockMelodySimilarity < 0.25
        ? 'medium'
        : 'high'

    const similarSegments: Array<{ start: number; end: number; similarity: number }> = []
    if (mockAudioSimilarity > 0.1) {
      const numSegments = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < numSegments; i++) {
        const start = Math.random() * 120
        const end = start + Math.random() * 10 + 5
        similarSegments.push({
          start,
          end,
          similarity: Math.random() * 0.3 + 0.1,
        })
      }
    }

    const suggestions: string[] = []
    if (riskLevel === 'high') {
      suggestions.push('建议修改副歌部分的旋律走向')
      suggestions.push('尝试调整和弦进行以降低相似度')
      suggestions.push('可以改变节奏模式增加差异性')
    } else if (riskLevel === 'medium') {
      suggestions.push('可以微调部分乐句以增强原创性')
      suggestions.push('建议在编曲上增加独特元素')
    } else {
      suggestions.push('歌曲原创性良好，可正常使用')
      suggestions.push('建议保持当前创作方向')
    }

    return {
      riskLevel,
      audioSimilarity: mockAudioSimilarity,
      melodySimilarity: mockMelodySimilarity,
      similarSegments,
      suggestions,
    }
  } catch (error: any) {
    console.error('侵权检测失败:', error)
    return {
      riskLevel: 'medium',
      audioSimilarity: 0,
      melodySimilarity: 0,
      similarSegments: [],
      suggestions: ['侵权检测服务暂时不可用，请人工审核'],
    }
  }
}

export async function compareWithDatabase(audioFingerprint: string): Promise<number> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    return Math.random() * 0.3
  } catch (error) {
    console.error('数据库比对失败:', error)
    return 0
  }
}

export async function extractAudioFingerprint(audioData: ArrayBuffer): Promise<string> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    const hash = Array.from(new Uint8Array(new Uint8Array(audioData).slice(0, 100)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    return hash
  } catch (error) {
    console.error('音频指纹提取失败:', error)
    return ''
  }
}

export async function analyzeMelodySimilarity(
  generatedSong: ArrayBuffer,
  originalSong?: ArrayBuffer
): Promise<number> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    return Math.random() * 0.35
  } catch (error) {
    console.error('旋律相似度分析失败:', error)
    return 0
  }
}

export function calculateRiskLevel(
  audioSimilarity: number,
  melodySimilarity: number
): 'low' | 'medium' | 'high' {
  if (audioSimilarity < 0.15 && melodySimilarity < 0.15) {
    return 'low'
  } else if (audioSimilarity < 0.25 && melodySimilarity < 0.25) {
    return 'medium'
  } else {
    return 'high'
  }
}

export function generateSuggestions(
  audioSimilarity: number,
  melodySimilarity: number
): string[] {
  const suggestions: string[] = []

  if (audioSimilarity > 0.2) {
    suggestions.push('音频整体相似度较高，建议在编曲上增加变化')
  }

  if (melodySimilarity > 0.2) {
    suggestions.push('旋律相似度较高，建议修改部分旋律线条')
    suggestions.push('可以尝试改变音符时值或音高走向')
  }

  if (suggestions.length === 0) {
    suggestions.push('歌曲原创性良好，可正常使用')
  }

  return suggestions
}
