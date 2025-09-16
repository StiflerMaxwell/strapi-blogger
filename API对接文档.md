# API对接文档

## 基本信息
- **API 基础地址**: `http://localhost:1337/api` (开发环境)
- **Content-Type**: `application/json`
- **Strapi 版本**: 5.23.1
- **数据库**: PostgreSQL

## 核心API接口

### 1. 获取文章列表
```http
GET /api/articles
```

**查询参数:**
- `pagination[page]`: 页码（默认: 1）
- `pagination[pageSize]`: 每页数量（默认: 25，最大: 100）
- `sort`: 排序字段（例如: `createdAt:desc`）
- `populate`: 关联数据（例如: `cover_image,website`）
- `publicationState`: 发布状态（`live`只显示已发布）

**请求示例:**
```http
GET /api/articles?pagination[page]=1&pagination[pageSize]=10&sort=createdAt:desc&populate=cover_image,website&publicationState=live
```

**响应示例:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "文章标题",
        "content": [
          {
            "type": "paragraph",
            "children": [
              {
                "text": "文章内容..."
              }
            ]
          }
        ],
        "slug": "wen-zhang-biao-ti",
        "view_count": 123,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "publishedAt": "2024-01-01T00:00:00.000Z",
        "cover_image": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "name": "image.jpg",
                "url": "/uploads/image.jpg",
                "mime": "image/jpeg",
                "size": 123456
              }
            }
          ]
        },
        "website": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "网站名称",
              "url": "https://example.com",
              "identifier": "example"
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 5,
      "total": 50
    }
  }
}
```

### 2. 根据slug获取文章详情
```http
GET /api/articles?filters[slug][$eq]={slug}&populate=cover_image,website
```

**请求示例:**
```http
GET /api/articles?filters[slug][$eq]=wen-zhang-biao-ti&populate=cover_image,website
```

**响应示例:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "文章标题",
        "content": [
          {
            "type": "paragraph",
            "children": [
              {
                "text": "完整的文章内容..."
              }
            ]
          }
        ],
        "slug": "wen-zhang-biao-ti",
        "view_count": 123,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "publishedAt": "2024-01-01T00:00:00.000Z",
        "cover_image": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "name": "image.jpg",
                "url": "/uploads/image.jpg",
                "mime": "image/jpeg",
                "size": 123456
              }
            }
          ]
        },
        "website": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "网站名称",
              "url": "https://example.com",
              "identifier": "example"
            }
          }
        }
      }
    }
  ]
}
```

## JavaScript SDK 示例

### 获取文章列表
```javascript
async function getArticles(page = 1, pageSize = 10) {
  try {
    const response = await fetch(`http://localhost:1337/api/articles?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc&populate=cover_image,website&publicationState=live`);
    
    if (!response.ok) {
      throw new Error('获取文章列表失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### 根据slug获取文章详情
```javascript
async function getArticleBySlug(slug) {
  try {
    const response = await fetch(`http://localhost:1337/api/articles?filters[slug][$eq]=${slug}&populate=cover_image,website`);
    
    if (!response.ok) {
      throw new Error('获取文章详情失败');
    }
    
    const data = await response.json();
    return data.data[0]; // 返回第一个匹配的文章
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

## 数据模型说明

### Article (文章)
- `title`: 文章标题
- `content`: 文章内容（富文本块）
- `slug`: URL友好的标识符（自动从标题生成）
- `view_count`: 浏览次数
- `cover_image`: 封面图片（关联媒体文件）
- `website`: 关联的网站信息
- `publishedAt`: 发布时间

### Website (网站)
- `name`: 网站名称
- `url`: 网站地址
- `identifier`: 网站标识符

### Media (媒体文件)
- `name`: 文件名
- `url`: 访问地址
- `mime`: 文件类型
- `size`: 文件大小