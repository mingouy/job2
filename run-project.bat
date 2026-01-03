@echo off

REM 学生任务管理系统自动运行脚本
REM 作者: TraeAI
REM 日期: 2026-01-04

cls
echo ============================================
echo         学生任务管理系统启动脚本
        
echo 1. 安装依赖
        
echo 2. 启动开发服务器
        
echo ============================================
echo.

REM 检查Node.js是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 错误: 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo 检测到Node.js版本: 
node --version
echo.

REM 检查npm是否安装
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 错误: 未检测到npm，请先安装npm
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo 检测到npm版本: 
npm --version
echo.

REM 检查是否在项目根目录
if not exist "package.json" (
    echo 错误: 未找到package.json文件，请确保在项目根目录运行此脚本
    pause
    exit /b 1
)

echo ============================================
echo 正在安装依赖...
echo ============================================
npm install

if %ERRORLEVEL% NEQ 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

echo.
echo ============================================
echo 依赖安装成功！
echo 正在启动开发服务器...
echo ============================================
echo.
echo 服务器启动后，可通过以下地址访问：
echo http://localhost:5173/
echo.
echo 按 Ctrl+C 可停止服务器
echo ============================================
echo.
npm run dev

pause
