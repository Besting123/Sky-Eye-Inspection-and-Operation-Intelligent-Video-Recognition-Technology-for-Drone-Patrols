# 铁路编组识别系统 API 规范

## 概述

本文档定义铁路编组识别工作站的后端 API 接口规范,包括 RESTful API 和 WebSocket 实时通信协议。

**版本**: v1.0  
**基础路径**: `/api/v1`  
**认证方式**: JWT Bearer Token

---

## 1. 认证接口

### 1.1 用户登录

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**响应 200**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "string",
    "expiresIn": 3600,
    "user": {
      "id": "string",
      "username": "string",
      "role": "admin|operator|viewer",
      "avatar": "string"
    }
  }
}
```

### 1.2 刷新 Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "string"
}
```

---

## 2. 任务管理接口

### 2.1 创建识别任务

```http
POST /api/v1/tasks
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "video": File,
  "metadata": {
    "location": "string",      // 例: "京广线 - 04号进站口"
    "description": "string"     // 可选
  }
}
```

**响应 201**:
```json
{
  "success": true,
  "data": {
    "taskId": "TASK-RW-20260406-001",
    "status": "pending",
    "createdAt": "2026-04-06T16:40:00Z",
    "videoUrl": "string",
    "estimatedDuration": 120  // 秒
  }
}
```

**错误响应 400**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_FORMAT",
    "message": "仅支持 MP4, AVI, MOV 格式",
    "details": {
      "allowedFormats": ["mp4", "avi", "mov"],
      "maxSize": 2147483648  // 2GB in bytes
    }
  }
}
```

### 2.2 获取任务列表

```http
GET /api/v1/tasks?page=1&limit=10&status=completed&sortBy=createdAt&order=desc
Authorization: Bearer {token}
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10, 最大: 100)
- `status`: 过滤状态 `pending|processing|completed|error`
- `sortBy`: 排序字段 `createdAt|updatedAt`
- `order`: 排序方向 `asc|desc`

**响应 200**:
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "TASK-RW-20260406-001",
        "code": "TASK-RW-20260406-001",
        "location": "京广线 - 04号进站口",
        "timestamp": "2026-04-06T14:22:10Z",
        "status": "completed",
        "totalCars": 48,
        "errorCount": 0,
        "progress": 100,
        "videoUrl": "string",
        "thumbnailUrl": "string"
      }
    ],
    "pagination": {
      "total": 2842,
      "page": 1,
      "limit": 10,
      "totalPages": 285
    }
  }
}
```

### 2.3 获取任务详情

```http
GET /api/v1/tasks/{taskId}
Authorization: Bearer {token}
```

**响应 200**:
```json
{
  "success": true,
  "data": {
    "id": "TASK-RW-20260406-001",
    "code": "TASK-RW-20260406-001",
    "location": "京广线 - 04号进站口",
    "createdAt": "2026-04-06T14:22:10Z",
    "updatedAt": "2026-04-06T14:25:30Z",
    "status": "completed",
    "progress": 100,
    "videoUrl": "string",
    "videoMetadata": {
      "duration": 720,
      "fps": 30,
      "resolution": "1920x1080",
      "size": 524288000
    },
    "recognition": {
      "totalCars": 48,
      "recognizedCars": 48,
      "errorCount": 0,
      "accuracy": 99.8,
      "processingTime": 180
    },
    "cars": [
      {
        "id": "string",
        "sequence": 1,
        "carNumber": "GH921",
        "carType": "C70",
        "carTypeName": "平车",
        "confidence": 0.998,
        "status": "confirmed",
        "timestamp": 12.5,
        "boundingBox": {
          "x": 100,
          "y": 200,
          "width": 300,
          "height": 150
        },
        "thumbnailUrl": "string",
        "containers": [
          {
            "id": "string",
            "containerNumber": "MSKU2094821",
            "containerType": "40HC",
            "company": "MAERSK LOGISTICS",
            "loadStatus": "loaded",
            "confidence": 0.995,
            "boundingBox": {
              "x": 120,
              "y": 220,
              "width": 260,
              "height": 110
            }
          }
        ]
      }
    ]
  }
}
```

### 2.4 删除任务

```http
DELETE /api/v1/tasks/{taskId}
Authorization: Bearer {token}
```

**响应 204**: No Content

---

## 3. 识别结果接口

### 3.1 获取车厢识别结果

```http
GET /api/v1/tasks/{taskId}/cars
Authorization: Bearer {token}
```

**响应 200**:
```json
{
  "success": true,
  "data": {
    "taskId": "TASK-RW-20260406-001",
    "totalCars": 48,
    "cars": [
      {
        "id": "string",
        "sequence": 1,
        "carNumber": "GH921",
        "carType": "C70",
        "carTypeName": "平车",
        "confidence": 0.998,
        "status": "confirmed|pending|error",
        "timestamp": 12.5,
        "thumbnailUrl": "string",
        "containers": [...]
      }
    ]
  }
}
```

### 3.2 更新车厢识别结果 (人工复核)

```http
PATCH /api/v1/tasks/{taskId}/cars/{carId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "carNumber": "GH921",
  "carType": "C70",
  "status": "confirmed",
  "note": "人工复核确认"
}
```

**响应 200**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "carNumber": "GH921",
    "status": "confirmed",
    "updatedAt": "2026-04-06T16:45:00Z",
    "updatedBy": "admin"
  }
}
```

### 3.3 获取异常列表

```http
GET /api/v1/tasks/{taskId}/errors
Authorization: Bearer {token}
```

**响应 200**:
```json
{
  "success": true,
  "data": {
    "taskId": "TASK-RW-20260406-001",
    "errorCount": 3,
    "errors": [
      {
        "id": "string",
        "carSequence": 8,
        "errorType": "occlusion|blur|low_confidence|missing",
        "errorMessage": "车号遮挡",
        "confidence": 0.45,
        "thumbnailUrl": "string",
        "timestamp": 45.2,
        "status": "pending|ignored|resolved"
      }
    ]
  }
}
```

### 3.4 处理异常

```http
POST /api/v1/tasks/{taskId}/errors/{errorId}/resolve
Authorization: Bearer {token}
Content-Type: application/json

{
  "action": "ignore|manual_label",
  "correctedData": {
    "carNumber": "ER091",
    "carType": "P62"
  },
  "note": "人工标记"
}
```

---

## 4. 统计分析接口

### 4.1 获取统计概览

```http
GET /api/v1/statistics/overview?period=month
Authorization: Bearer {token}
```

**查询参数**:
- `period`: `day|week|month|year`

**响应 200**:
```json
{
  "success": true,
  "data": {
    "period": "month",
    "totalRecognitions": 2842,
    "averageAccuracy": 99.8,
    "totalRuntime": 4120,
    "pendingErrors": 12,
    "comparison": {
      "recognitions": {
        "current": 2842,
        "previous": 2536,
        "change": 12.1
      }
    }
  }
}
```

### 4.2 导出报告

```http
POST /api/v1/reports/export
Authorization: Bearer {token}
Content-Type: application/json

{
  "taskIds": ["TASK-RW-20260406-001", "TASK-RW-20260406-002"],
  "format": "pdf|excel|csv",
  "includeImages": true
}
```

**响应 200**:
```json
{
  "success": true,
  "data": {
    "reportId": "string",
    "downloadUrl": "string",
    "expiresAt": "2026-04-07T16:45:00Z"
  }
}
```

---

## 5. WebSocket 实时通信

### 5.1 连接

```
ws://api.example.com/api/v1/ws?token={jwt_token}
```

### 5.2 消息格式

**客户端订阅任务**:
```json
{
  "type": "subscribe",
  "payload": {
    "taskId": "TASK-RW-20260406-001"
  }
}
```

**服务端推送进度**:
```json
{
  "type": "task_progress",
  "payload": {
    "taskId": "TASK-RW-20260406-001",
    "status": "processing",
    "progress": 45,
    "currentCar": 22,
    "totalCars": 48,
    "estimatedTimeRemaining": 60
  }
}
```

**服务端推送识别结果**:
```json
{
  "type": "car_recognized",
  "payload": {
    "taskId": "TASK-RW-20260406-001",
    "car": {
      "sequence": 22,
      "carNumber": "TK442",
      "confidence": 0.987,
      "thumbnailUrl": "string"
    }
  }
}
```

**服务端推送错误**:
```json
{
  "type": "recognition_error",
  "payload": {
    "taskId": "TASK-RW-20260406-001",
    "error": {
      "carSequence": 8,
      "errorType": "occlusion",
      "message": "车号遮挡"
    }
  }
}
```

**服务端推送完成**:
```json
{
  "type": "task_completed",
  "payload": {
    "taskId": "TASK-RW-20260406-001",
    "status": "completed",
    "totalCars": 48,
    "errorCount": 3,
    "accuracy": 99.2
  }
}
```

---

## 6. 数据模型

### 6.1 Task (任务)

```typescript
interface Task {
  id: string;                    // 任务唯一标识
  code: string;                  // 任务编号 (显示用)
  location: string;              // 位置信息
  createdAt: string;             // ISO 8601 时间戳
  updatedAt: string;
  status: TaskStatus;
  progress: number;              // 0-100
  videoUrl: string;
  videoMetadata: VideoMetadata;
  recognition: RecognitionResult;
  cars: Car[];
}

type TaskStatus = 'pending' | 'processing' | 'completed' | 'error';
```

### 6.2 Car (车厢)

```typescript
interface Car {
  id: string;
  sequence: number;              // 车厢序号
  carNumber: string;             // 车号
  carType: string;               // 车型代码
  carTypeName: string;           // 车型名称
  confidence: number;            // 0-1
  status: CarStatus;
  timestamp: number;             // 视频时间戳(秒)
  boundingBox: BoundingBox;
  thumbnailUrl: string;
  containers: Container[];
}

type CarStatus = 'confirmed' | 'pending' | 'error';
```

### 6.3 Container (集装箱)

```typescript
interface Container {
  id: string;
  containerNumber: string;       // 箱号
  containerType: string;         // 40HC, 40GP, 20GP 等
  company: string;               // 所属公司
  loadStatus: 'loaded' | 'empty';
  confidence: number;
  boundingBox: BoundingBox;
}
```

### 6.4 Error (异常)

```typescript
interface RecognitionError {
  id: string;
  carSequence: number;
  errorType: ErrorType;
  errorMessage: string;
  confidence: number;
  thumbnailUrl: string;
  timestamp: number;
  status: 'pending' | 'ignored' | 'resolved';
}

type ErrorType = 'occlusion' | 'blur' | 'low_confidence' | 'missing';
```

---

## 7. 错误码

| 错误码 | HTTP 状态 | 说明 |
|--------|----------|------|
| `INVALID_TOKEN` | 401 | Token 无效或过期 |
| `INSUFFICIENT_PERMISSIONS` | 403 | 权限不足 |
| `TASK_NOT_FOUND` | 404 | 任务不存在 |
| `INVALID_FILE_FORMAT` | 400 | 文件格式不支持 |
| `FILE_TOO_LARGE` | 400 | 文件超过大小限制 |
| `PROCESSING_ERROR` | 500 | 识别处理失败 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求频率超限 |

---

## 8. 速率限制

- 认证接口: 10 次/分钟
- 任务创建: 5 次/分钟
- 其他接口: 100 次/分钟

**响应头**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1712419200
```

---

## 9. 分页规范

所有列表接口统一使用以下分页格式:

**请求**:
```
GET /api/v1/tasks?page=1&limit=10
```

**响应**:
```json
{
  "data": [...],
  "pagination": {
    "total": 2842,
    "page": 1,
    "limit": 10,
    "totalPages": 285
  }
}
```

---

## 10. 环境配置

### 开发环境
- Base URL: `http://localhost:3000/api/v1`
- WebSocket: `ws://localhost:3000/api/v1/ws`

### 生产环境
- Base URL: `https://api.railway-recognition.com/api/v1`
- WebSocket: `wss://api.railway-recognition.com/api/v1/ws`
