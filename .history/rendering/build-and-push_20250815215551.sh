#!/bin/bash

# 杭州二手房数据可视化项目 Docker 构建和推送脚本

echo "🏠 杭州二手房数据可视化项目 - Docker 构建开始..."

# 设置镜像信息
IMAGE_NAME="sakimi9/DPV-SHP_HangZhou"
CONTAINER_NAME="DPV-SHP_HangZhou"
VERSION="latest"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 rendering 目录下运行此脚本"
    exit 1
fi

# 构建 Docker 镜像
echo "🔨 正在构建 Docker 镜像: $IMAGE_NAME:$VERSION"
docker build -t $IMAGE_NAME:$VERSION .

if [ $? -eq 0 ]; then
    echo "✅ Docker 镜像构建成功!"
else
    echo "❌ Docker 镜像构建失败!"
    exit 1
fi

# 推送到 Docker Hub
echo "📤 正在推送镜像到 Docker Hub..."
docker push $IMAGE_NAME:$VERSION

if [ $? -eq 0 ]; then
    echo "✅ 镜像推送成功!"
    echo "📝 镜像信息:"
    echo "   - 镜像名称: $IMAGE_NAME:$VERSION"
    echo "   - 容器名称: $CONTAINER_NAME"
    echo "   - 访问端口: 8080"
else
    echo "❌ 镜像推送失败!"
    exit 1
fi

# 提供使用说明
echo ""
echo "🚀 部署说明:"
echo "1. 使用 Docker 直接运行:"
echo "   docker run -d -p 8080:80 --name $CONTAINER_NAME $IMAGE_NAME:$VERSION"
echo ""
echo "2. 使用 Docker Compose 运行:"
echo "   docker-compose up -d"
echo ""
echo "3. 访问应用:"
echo "   http://localhost:8080"
echo ""
echo "🎉 构建和推送完成!"
