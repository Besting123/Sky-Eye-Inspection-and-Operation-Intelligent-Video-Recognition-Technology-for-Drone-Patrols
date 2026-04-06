@echo off
chcp 65001 >nul
title 铁路编组识别工作站 - 启动脚本

echo.
echo ========================================
echo   铁路编组识别工作站
echo   Railway Recognition Workstation
echo ========================================
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Python
    echo 请访问 https://www.python.org/ 下载安装 Python
    pause
    exit /b 1
)

python start.py
pause
