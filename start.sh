#!/bin/bash

echo "🎵 AI Song Generator - 智能仿写歌曲生成器"
echo "=========================================="

# 检查Node.js版本
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本过低，需要 18+ 版本"
    exit 1
fi

echo "✅ Node.js 版本检查通过"

# 安装依赖
echo ""
echo "📦 安装依赖..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

echo "✅ 依赖安装完成"

# 检查端口占用
echo ""
echo "🔍 检查端口占用..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  端口 3000 已被占用，前端服务可能无法启动"
fi

if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  端口 5000 已被占用，后端服务可能无法启动"
fi

# 启动服务
echo ""
echo "🚀 启动服务..."
echo ""

# 启动后端
cd server
npm run dev &
SERVER_PID=$!
cd ..

# 等待后端启动
sleep 3

# 启动前端
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo ""
echo "✅ 服务启动成功！"
echo ""
echo "🌐 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:5000"
echo "📊 健康检查: http://localhost:5000/api/health"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

# 捕获中断信号
trap "echo '正在停止服务...'; kill $SERVER_PID $CLIENT_PID; exit 0" INT TERM

# 保持脚本运行
wait
