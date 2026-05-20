#!/bin/bash

echo "🧪 AI Song Generator - 模块测试脚本"
echo "========================================"
echo ""

# 测试颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试函数
test_endpoint() {
    local name=$1
    local url=$2
    local expected=$3

    echo -n "测试 $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "$expected" ]; then
        echo -e "${GREEN}✓ 通过${NC}"
        return 0
    else
        echo -e "${RED}✗ 失败 (期望: $expected, 实际: $response)${NC}"
        return 1
    fi
}

test_json() {
    local name=$1
    local url=$2

    echo -n "测试 $name... "
    
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "success"; then
        echo -e "${GREEN}✓ 通过${NC}"
        return 0
    else
        echo -e "${RED}✗ 失败${NC}"
        echo "响应: $response"
        return 1
    fi
}

# 开始测试
echo "========================================"
echo "1. 健康检查测试"
echo "========================================"
test_endpoint "健康检查" "http://localhost:5000/api/health" "200"
test_json "健康检查数据" "http://localhost:5000/api/health"

echo ""
echo "========================================"
echo "2. 歌曲接口测试"
echo "========================================"
test_json "获取热门歌曲" "http://localhost:5000/api/songs/hot?limit=3"
test_json "搜索歌曲" "http://localhost:5000/api/songs/search?q=周杰伦"

echo ""
echo "========================================"
echo "3. 前端服务测试"
echo "========================================"
test_endpoint "前端首页" "http://localhost:3000" "200"

echo ""
echo "========================================"
echo "4. CORS配置测试"
echo "========================================"
echo -n "测试 CORS... "
cors_header=$(curl -s -I "http://localhost:5000/api/health" | grep -i "access-control-allow-origin" | wc -l)
if [ "$cors_header" -gt 0 ]; then
    echo -e "${GREEN}✓ 通过${NC}"
else
    echo -e "${YELLOW}⚠ 警告 - CORS头未设置${NC}"
fi

echo ""
echo "========================================"
echo "5. 文件上传目录测试"
echo "========================================"
if [ -d "server/uploads" ]; then
    echo -e "${GREEN}✓ 上传目录存在${NC}"
else
    echo -e "${YELLOW}⚠ 创建上传目录${NC}"
    mkdir -p server/uploads
fi

if [ -d "server/outputs" ]; then
    echo -e "${GREEN}✓ 输出目录存在${NC}"
else
    echo -e "${YELLOW}⚠ 创建输出目录${NC}"
    mkdir -p server/outputs
fi

echo ""
echo "========================================"
echo "测试完成"
echo "========================================"
echo ""
echo "如果所有测试都通过，说明系统已准备就绪！"
echo ""
echo "📚 后续测试建议:"
echo "  1. 配置真实的DeepSeek API密钥"
echo "  2. 配置真实的MiniMax API密钥"
echo "  3. 测试完整的创作流程"
echo "  4. 测试文件上传功能"
