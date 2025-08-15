@echo off
REM 杭州二手房数据可视化项目 Docker 构建和推送脚本 (Windows)

echo 🏠 杭州二手房数据可视化项目 - Docker 构建开始...

REM 设置镜像信息
set IMAGE_NAME=sakimi9/dpv-shp_hangzhou
set CONTAINER_NAME=DPV-SHP_HangZhou
set VERSION=latest

REM 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误: 请在 rendering 目录下运行此脚本
    pause
    exit /b 1
)

REM 构建 Docker 镜像
echo 🔨 正在构建 Docker 镜像: %IMAGE_NAME%:%VERSION%
docker build -t %IMAGE_NAME%:%VERSION% .

if %errorlevel% equ 0 (
    echo ✅ Docker 镜像构建成功!
) else (
    echo ❌ Docker 镜像构建失败!
    pause
    exit /b 1
)

REM 推送到 Docker Hub
echo 📤 正在推送镜像到 Docker Hub...
docker push %IMAGE_NAME%:%VERSION%

if %errorlevel% equ 0 (
    echo ✅ 镜像推送成功!
    echo 📝 镜像信息:
    echo    - 镜像名称: %IMAGE_NAME%:%VERSION%
    echo    - 容器名称: %CONTAINER_NAME%
    echo    - 访问端口: 8080
) else (
    echo ❌ 镜像推送失败!
    pause
    exit /b 1
)

REM 提供使用说明
echo.
echo 🚀 部署说明:
echo 1. 使用 Docker 直接运行:
echo    docker run -d -p 8080:80 --name %CONTAINER_NAME% %IMAGE_NAME%:%VERSION%
echo.
echo 2. 使用 Docker Compose 运行:
echo    docker-compose up -d
echo.
echo 3. 访问应用:
echo    http://localhost:8080
echo.
echo 🎉 构建和推送完成!
pause
