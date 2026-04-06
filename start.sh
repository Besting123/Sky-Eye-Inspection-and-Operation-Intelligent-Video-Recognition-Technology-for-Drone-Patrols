#!/bin/bash

echo ""
echo "========================================"
echo "  铁路编组识别工作站"
echo "  Railway Recognition Workstation"
echo "========================================"
echo ""

if ! command -v python3 &> /dev/null; then
    echo "[错误] 未找到 Python3"
    echo "请安装 Python 3"
    exit 1
fi

python3 start.py
