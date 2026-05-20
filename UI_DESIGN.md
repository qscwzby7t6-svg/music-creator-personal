# AI Song Generator - Web UI 设计文档

**版本**: v2.0  
**更新日期**: 2026-05-20  
**设计风格**: 复古未来主义 + 玻璃态（Retro-Futuristic + Glassmorphism）

---

## 🎨 设计理念

### 美学方向

本项目采用**复古未来主义 + 玻璃态设计**风格，融合80年代的霓虹美学与现代玻璃态效果，创造出独特而令人难忘的视觉体验。

### 核心设计原则

1. **避免通用AI美学** - 不使用紫色渐变、Inter字体等常见AI应用设计
2. **大胆的配色方案** - 使用霓虹色彩组合，而非传统蓝色/紫色
3. **深色主题优先** - 提供沉浸式的音乐创作体验
4. **流畅动画** - 使用波形动画和渐变效果增强互动感
5. **玻璃态效果** - 半透明背景配合模糊效果

---

## 🎨 色彩系统

### 主色调

```css
/* 青色 - 科技感、冷静 */
--cyan-400: #22d3ee
--cyan-500: #06b6d4

/* 粉色 - 温暖、创意 */
--pink-400: #f472b6
--pink-500: #ec4899

/* 紫色 - 辅助色 */
--purple-500: #a855f7

/* 背景色 */
--gray-900: #111827
--gray-800: #1f2937
--gray-700: #374151

/* 文本色 */
--white: #ffffff
--gray-300: #d1d5db
--gray-400: #9ca3af
--gray-500: #6b7280
```

### 渐变组合

```css
/* 青色到粉色渐变 - 主品牌色 */
background: linear-gradient(to right, #22d3ee, #ec4899, #a855f7);

/* 青色到蓝色渐变 - 按钮 */
background: linear-gradient(to right, #22d3ee, #3b82f6);

/* 粉色到玫瑰色渐变 - 强调 */
background: linear-gradient(to right, #f472b6, #f43f5e);
```

### 玻璃态效果

```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

---

## 🔤 字体系统

### 字体选择

- **标题字体**: Playfair Display（衬线字体，优雅、复古）
- **正文字体**: Outfit（无衬线字体，现代、易读）

### 字号层级

| 元素 | 字号 | 字重 | 行高 |
|------|------|------|------|
| H1 | 3rem (48px) | Bold (700) | 1.2 |
| H2 | 2.5rem (40px) | Bold (700) | 1.3 |
| H3 | 1.5rem (24px) | Semibold (600) | 1.4 |
| Body | 1rem (16px) | Regular (400) | 1.6 |
| Caption | 0.875rem (14px) | Regular (400) | 1.5 |

---

## 🎬 动画系统

### 关键动画

#### 1. 波形动画（Wave Animation）
```css
@keyframes wave {
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1); }
}

.animate-wave {
  animation: wave 1s ease-in-out infinite;
}
```
**用途**: 音乐相关的视觉反馈，如播放按钮、音频波形

#### 2. 渐变动画（Gradient Animation）
```css
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}
```
**用途**: Logo、标题等重要元素的视觉强调

#### 3. 淡入动画（Fade In）
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
```
**用途**: 页面加载、元素出现

#### 4. 悬浮动画（Float Animation）
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```
**用途**: 图标、装饰元素

### 过渡效果

```css
/* 通用过渡 */
transition: all 0.3s ease;

/* 按钮悬停 */
hover:scale-105
hover:shadow-2xl
hover:shadow-cyan-500/25

/* 卡片悬停 */
hover:-translate-y-2
hover:border-cyan-500/50
```

---

## 📐 布局系统

### 容器

```css
/* 最大宽度 */
max-width: 7xl; /* 1280px */

/* 页面边距 */
padding: 1.5rem; /* 24px */
@media (min-width: 768px) {
  padding: 3rem; /* 48px */
}

/* 卡片间距 */
gap: 2rem; /* 32px */
```

### 网格系统

```css
/* 创作工作室布局 */
grid-template-columns: repeat(3, 1fr);

@media (max-width: 1024px) {
  grid-template-columns: 1fr;
}
```

### 圆角系统

| 元素 | 圆角大小 |
|------|---------|
| 按钮 | 9999px (pill) 或 0.75rem |
| 卡片 | 1rem (16px) |
| 输入框 | 0.75rem (12px) |
| 图标容器 | 50% (circle) |

---

## 🧩 组件设计

### 1. 按钮组件

#### 主按钮
```css
.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #22d3ee, #ec4899);
  border-radius: 0.75rem;
  color: white;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(34, 211, 238, 0.25);
}
```

#### 次按钮
```css
.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  color: white;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}
```

### 2. 卡片组件

```css
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.3s;
}

.card:hover {
  border-color: rgba(34, 211, 238, 0.5);
  transform: translateY(-0.5rem);
}
```

### 3. 输入框组件

```css
input {
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  color: white;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: rgba(34, 211, 238, 0.5);
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1);
}

input::placeholder {
  color: #6b7280;
}
```

### 4. 步骤指示器

```css
.step-circle {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

/* 完成状态 */
.step-circle.completed {
  background: linear-gradient(to right, #22d3ee, #ec4899);
  color: white;
}

/* 当前状态 */
.step-circle.active {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #22d3ee;
  color: white;
}

/* 未完成状态 */
.step-circle.pending {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #6b7280;
}
```

### 5. 进度条

```css
.progress-bar {
  position: relative;
  height: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #22d3ee, #ec4899);
  border-radius: 9999px;
  transition: width 0.5s;
}
```

---

## 📱 响应式设计

### 断点

| 断点 | 最小宽度 | 描述 |
|------|---------|------|
| sm | 640px | 手机横屏 |
| md | 768px | 平板 |
| lg | 1024px | 小笔记本 |
| xl | 1280px | 桌面 |

### 响应式策略

1. **移动优先**: 默认样式适用于小屏幕
2. **渐进增强**: 使用 `md:` 和 `lg:` 添加大屏幕样式
3. **流式布局**: 使用 Flexbox 和 Grid 适应不同屏幕

---

## 🎨 视觉资源

### 图标

使用 [Heroicons](https://heroicons.com/) Outline 风格：
- 线条粗细: 24px
- 颜色: 白色或渐变色
- 尺寸: 16px、20px、24px、32px、48px

### 背景效果

#### 动态渐变背景
```css
background: linear-gradient(
  135deg,
  rgba(34, 211, 238, 0.1) 0%,
  rgba(236, 72, 153, 0.1) 50%,
  rgba(168, 85, 247, 0.1) 100%
);
```

#### 模糊光斑
```css
.blob-1 {
  position: absolute;
  width: 24rem;
  height: 24rem;
  background: rgba(34, 211, 238, 0.2);
  border-radius: 50%;
  filter: blur(3rem);
  animation: pulse 4s ease-in-out infinite;
}

.blob-2 {
  position: absolute;
  width: 24rem;
  height: 24rem;
  background: rgba(236, 72, 153, 0.2);
  border-radius: 50%;
  filter: blur(3rem);
  animation: pulse 4s ease-in-out infinite;
  animation-delay: 2s;
}
```

---

## ♿ 无障碍设计

### 颜色对比

- 文本与背景对比度 ≥ 4.5:1
- 大文本对比度 ≥ 3:1
- 使用 `text-gray-300` 或更浅的颜色作为正文

### 焦点状态

```css
button:focus,
input:focus {
  outline: none;
  ring: 2px;
  ring-color: rgba(34, 211, 238, 0.5);
}
```

### 语义HTML

- 使用 `<button>` 而非 `<div>` 作为按钮
- 使用 `<nav>` 包裹导航
- 使用 `<header>` 包裹头部
- 使用 `<main>` 包裹主要内容
- 使用 `<footer>` 包裹页脚

---

## 📝 使用示例

### 页面结构

```tsx
<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
  {/* 动态背景 */}
  <div className="absolute inset-0">
    <div className="blob-1" />
    <div className="blob-2" />
  </div>

  {/* 内容 */}
  <div className="relative z-10">
    <header>
      {/* Logo 和导航 */}
    </header>

    <main>
      {/* 主要内容 */}
    </main>

    <footer>
      {/* 页脚 */}
    </footer>
  </div>
</div>
```

### 玻璃态卡片

```tsx
<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
  <h2 className="text-2xl font-bold text-white mb-4">标题</h2>
  <p className="text-gray-400">内容...</p>
</div>
```

### 渐变按钮

```tsx
<button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full font-semibold text-white hover:scale-105 transition-all">
  开始创作
</button>
```

---

## 🎯 未来优化方向

1. **深色/浅色模式切换**
2. **更多动画效果**（页面转场、微交互）
3. **3D效果**（CSS 3D transforms）
4. **声音可视化**（实时音频波形）
5. **主题定制**（用户选择配色方案）

---

## 📚 参考资源

- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
- [Google Fonts - Playfair Display](https://fonts.google.com/specimen/Playfair+Display)
- [Google Fonts - Outfit](https://fonts.google.com/specimen/Outfit)
- [Glassmorphism Design Inspiration](https://glassmorphism.com/)

---

**文档版本**: 1.0  
**最后更新**: 2026-05-20
