# 文章阅读记录接口使用说明

## 接口概述

新增了文章阅读记录接口，支持IP限制功能，确保同一个IP地址在一天内只能为同一篇文章记录一次阅读行为。该接口只记录阅读行为，不会修改文章的任何数据。

## 接口详情

### 记录阅读行为接口

**请求方式**: `GET`  
**请求路径**: `/api/articles/{id}/increment-view`  
**认证要求**: 无需认证（公开接口）

#### 请求参数

- `id` (路径参数): 文章ID

#### 请求示例

```bash
# 使用curl
curl http://localhost:1337/api/articles/1/increment-view

# 使用浏览器直接访问
http://localhost:1337/api/articles/1/increment-view
```

#### 响应格式

**成功响应** (首次访问):
```json
{
  "success": true,
  "message": "阅读记录已保存",
  "already_read": false
}
```

**成功响应** (同一天重复访问):
```json
{
  "success": true,
  "message": "今天已经记录过阅读",
  "already_read": true
}
```

**错误响应**:
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "记录阅读失败",
    "details": {
      "error": "具体错误信息"
    }
  }
}
```

## 功能特性

1. **IP限制**: 同一个IP地址在一天内只能为同一篇文章记录一次阅读行为
2. **自动记录**: 系统会自动记录访问者的IP地址和访问日期
3. **只记录不修改**: 接口只记录阅读行为，不会修改文章的任何数据
4. **重复访问处理**: 同一天内重复访问会返回成功，但不会重复记录

## 数据库结构

### 文章表 (articles)
- 保持原有结构不变，不会被此接口修改

### 阅读记录表 (reading_records)
- `ip_address`: 访问者IP地址
- `article`: 关联的文章ID
- `read_date`: 访问日期 (YYYY-MM-DD格式)
- `createdAt`: 记录创建时间
- `updatedAt`: 记录更新时间

## 注意事项

1. 接口无需认证，适合前端直接调用
2. IP地址获取优先级: `ctx.request.ip` > `ctx.request.socket.remoteAddress` > `'unknown'`
3. 日期以服务器时区为准，使用YYYY-MM-DD格式
4. **只记录阅读行为，不修改文章数据**
5. **使用GET方法**，可以直接在浏览器地址栏访问或通过img标签等方式调用

## 使用建议

```javascript
// 前端调用示例
async function recordArticleView(articleId) {
  try {
    const response = await fetch(`/api/articles/${articleId}/increment-view`);
    const result = await response.json();
    
    if (result.success) {
      if (result.already_read) {
        console.log('今天已经记录过此文章的阅读');
      } else {
        console.log('阅读记录已保存');
      }
    }
  } catch (error) {
    console.error('记录阅读失败:', error);
  }
}

// 或者直接在HTML中使用
// <img src="/api/articles/1/increment-view" style="display:none;" />
```

## 测试接口

您可以通过以下方式测试接口：

1. **浏览器直接访问**: 在浏览器中打开 `http://localhost:1337/api/articles/1/increment-view`
2. **curl命令**: `curl http://localhost:1337/api/articles/1/increment-view`
3. **JavaScript fetch**: 使用上面的代码示例