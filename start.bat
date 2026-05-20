@echo off
chcp 65001 > nul
echo 🎵 AI Song Generator - 智能仿写歌曲生成器
echo ==========================================
echo.

:: 检查Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js 18+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%

:: 安装依赖
echo.
echo 📦 安装依赖...
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

echo ✅ 依赖安装完成

:: 创建必要目录
if not exist "server\uploads" mkdir server\uploads
if not exist "server\outputs" mkdir server\outputs

:: 启动后端
echo.
echo 🚀 启动服务...
echo.

start "Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak > nul

:: 启动前端
start "Client" cmd /k "cd client && npm run dev"

echo.
echo ✅ 服务启动成功！
echo.
echo 🌐 前端地址: http://localhost:3000
echo 🔧 后端地址: http://localhost:5000
echo 📊 健康检查: http://localhost:5000/api/health
echo.
echo 按任意键退出此窗口（服务将继续在后台运行）
pause > nul
