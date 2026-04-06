#!/usr/bin/env python3

import os
import sys
import subprocess
import platform
import time
from pathlib import Path

class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text.center(60)}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}[OK] {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}[ERROR] {text}{Colors.END}")

def print_warning(text):
    print(f"{Colors.YELLOW}[WARN] {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.BLUE}[INFO] {text}{Colors.END}")

def check_command(command):
    try:
        if platform.system() == 'Windows':
            result = subprocess.run(
                [command, '--version'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                shell=True
            )
            return result.returncode == 0
        else:
            subprocess.run(
                [command, '--version'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True
            )
            return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def check_node():
    print_info("检查 Node.js 环境...")
    if not check_command('node'):
        print_error("未找到 Node.js")
        print_info("请访问 https://nodejs.org/ 下载安装 Node.js")
        return False
    
    if platform.system() == 'Windows':
        result = subprocess.run(['node', '--version'], capture_output=True, text=True, shell=True)
    else:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
    
    version = result.stdout.strip()
    print_success(f"Node.js 版本: {version}")
    return True

def check_npm():
    print_info("检查 npm 环境...")
    if not check_command('npm'):
        print_error("未找到 npm")
        return False
    
    if platform.system() == 'Windows':
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True, shell=True)
    else:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
    
    version = result.stdout.strip()
    print_success(f"npm 版本: {version}")
    return True

def check_dependencies():
    node_modules = Path('node_modules')
    package_lock = Path('package-lock.json')
    
    if not node_modules.exists() or not package_lock.exists():
        return False
    
    return True

def install_dependencies():
    print_info("安装项目依赖...")
    print_warning("这可能需要几分钟时间，请耐心等待...")
    
    try:
        cmd = ['npm', 'install']
        if platform.system() == 'Windows':
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True,
                shell=True
            )
        else:
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True
            )
        
        if process.stdout:
            for line in process.stdout:
                print(f"  {line.rstrip()}")
        
        process.wait()
        
        if process.returncode == 0:
            print_success("依赖安装完成")
            return True
        else:
            print_error("依赖安装失败")
            return False
    except Exception as e:
        print_error(f"安装依赖时出错: {str(e)}")
        return False

def check_port(port=5173):
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', port))
    sock.close()
    return result == 0

def start_dev_server():
    print_info("启动开发服务器...")
    
    port = 5173
    if check_port(port):
        print_warning(f"端口 {port} 已被占用")
        print_info("尝试使用其他端口...")
    
    try:
        print_success("开发服务器启动中...")
        print_info("按 Ctrl+C 停止服务器\n")
        
        if platform.system() == 'Windows':
            subprocess.run(['npm', 'run', 'dev'], shell=True)
        else:
            subprocess.run(['npm', 'run', 'dev'])
            
    except KeyboardInterrupt:
        print_info("\n正在停止服务器...")
        print_success("服务器已停止")
    except Exception as e:
        print_error(f"启动服务器时出错: {str(e)}")
        return False
    
    return True

def main():
    os.chdir(Path(__file__).parent)
    
    print_header("铁路编组识别工作站")
    print_info("Railway Recognition Workstation")
    print_info("正在准备启动...\n")
    
    if not check_node():
        sys.exit(1)
    
    if not check_npm():
        sys.exit(1)
    
    if not check_dependencies():
        print_warning("未找到项目依赖")
        response = input(f"\n{Colors.YELLOW}是否现在安装依赖? (y/n): {Colors.END}").lower()
        if response == 'y':
            if not install_dependencies():
                sys.exit(1)
        else:
            print_error("无法启动项目，缺少依赖")
            sys.exit(1)
    else:
        print_success("项目依赖已就绪")
    
    print_info("\n环境检查完成，准备启动开发服务器...")
    time.sleep(1)
    
    start_dev_server()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print_info("\n\n用户中断")
        sys.exit(0)
    except Exception as e:
        print_error(f"\n发生错误: {str(e)}")
        sys.exit(1)
