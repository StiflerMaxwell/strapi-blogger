# API 对接开发指南 (开发者版)

本文档将指导您如何从 Strapi CMS 中获取文章数据，并将其集成到您的网站中。

## 1. 快速上手

*   **API 基础地址**: `https://blogger.vertu.com/api`
*   **请求方法**: `GET`
*   **返回格式**: `JSON`

> **重要**: 在开始编码前，请向运营人员获取您所负责网站的 **`identifier` (网站唯一标识)**，例如 `vertu-tech-blog`。这是精确筛选内容的关键。

## 2. 核心 API 接口

您只需要关注以下两个核心接口。

---

### 接口一：获取网站的文章列表

用于在您网站的首页或博客列表页展示所有文章。

*   **端点**: `GET /api/articles`

*   **核心参数**:
    | 参数 | 示例 | **说明** |
    | :--- | :--- | :--- |
    | `filters[website][identifier][$eq]` | `openseo` | **[必需]** 用于筛选出属于您网站的文章。这里的值是网站的identifier字段。 |
    | `populate` | `*` | **[推荐]** 用于加载所有关联数据（如封面图、网站信息）。 |
    | `sort` | `createdAt:desc` | **[推荐]** 按创建时间倒序，确保最新文章在前。 |
    | `pagination[pageSize]` | `10` | **[可选]** 控制每页返回的文章数量。 |

*   **请求示例**:
    ```http
    GET https://blogger.vertu.com/api/articles?filters[website][identifier][$eq]=openseo&populate=*&sort=createdAt:desc&pagination[pageSize]=10
    ```

---

### 接口二：根据 Slug 获取单篇文章详情

用于在文章详情页，通过对人类友好的 URL (`slug`) 来获取特定文章的完整内容。

*   **端点**: `GET /api/articles`

*   **核心参数**:
    | 参数 | 示例 | **说明** |
    | :--- | :--- | :--- |
    | `filters[slug][$eq]` | `my-first-post` | **[必需]** 使用文章的 `slug` 字段进行精确查找。 |
    | `populate` | `*` | **[推荐]** 加载文章所有关联数据。 |

*   **请求示例**:
    ```http
    GET https://blogger.vertu.com/api/articles?filters[slug][$eq]=my-first-post&populate=*
    ```

---

### 接口三：增加文章浏览量

用于在用户访问文章详情页时记录浏览次数。

*   **端点**: `POST /api/articles/:id/increment-view`

*   **核心参数**:
    | 参数 | 示例 | **说明** |
    | :--- | :--- | :--- |
    | `id` | `1` | **[必需]** 文章的ID（在URL路径中）。 |

*   **特性**:
    - 自动记录客户端IP地址，防止5分钟内重复计数
    - 不需要身份认证，可公开访问
    - 返回更新后的浏览量

*   **请求示例**:
    ```http
    POST https://blogger.vertu.com/api/articles/1/increment-view
    ```

*   **响应示例**:
    ```json
    {
      "data": {
        "id": 1,
        "view_count": 42
      }
    }
    ```

---

## 3. JavaScript 代码示例 (`fetch`)

您可以将以下函数直接用于您的项目中。

```javascript
const STRAPI_BASE_URL = 'https://blogger.vertu.com/api';

/**
 * 根据网站标识符获取文章列表。
 * @param {string} websiteIdentifier - 您网站的唯一标识 (e.g., 'openseo')。
 * @returns {Promise<Array>} 文章对象数组。
 */
async function getArticlesByWebsite(websiteIdentifier) {
  const params = new URLSearchParams({
    'filters[website][identifier][$eq]': websiteIdentifier,
    'populate': '*',
    'sort': 'createdAt:desc',
  });

  const response = await fetch(`${STRAPI_BASE_URL}/articles?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const { data } = await response.json();
  return data;
}

/**
 * 根据 slug 获取单篇文章详情。
 * @param {string} slug - 文章的 slug (e.g., 'my-first-post')。
 * @returns {Promise<Object|null>} 单个文章对象，或在未找到时返回 null。
 */
async function getArticleBySlug(slug) {
  const params = new URLSearchParams({
    'filters[slug][$eq]': slug,
    'populate': '*',
  });

  const response = await fetch(`${STRAPI_BASE_URL}/articles?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const { data } = await response.json();
  
  // Strapi 的筛选结果总是一个数组，我们只需要第一项。
  return data.length > 0 ? data : null;
}

/**
 * 增加文章浏览量。
 * @param {number} articleId - 文章的ID。
 * @returns {Promise<Object>} 包含更新后浏览量的对象。
 */
async function incrementArticleView(articleId) {
  const response = await fetch(`${STRAPI_BASE_URL}/articles/${articleId}/increment-view`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const { data } = await response.json();
  return data;
}

// --- 使用示例 ---
// 获取openseo网站的所有文章
// getArticlesByWebsite('openseo')
//   .then(articles => console.log('文章列表:', articles));

// 根据slug获取特定文章详情
// getArticleBySlug('my-first-post')
//   .then(article => console.log('文章详情:', article));

// 增加文章浏览量（在文章详情页加载时调用）
// incrementArticleView(1)
//   .then(result => console.log('更新后的浏览量:', result.view_count));
```