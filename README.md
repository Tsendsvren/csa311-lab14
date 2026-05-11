# F.CSM311 — Лабротарын ажил 14: API Testing with Postman + Newman

## Тухай

JSONPlaceholder public API-г Postman болон Newman ашиглан тестлэсэн. GitHub Actions-аар CI pipeline зохион байгуулсан.

| Зүйл          | Дэлгэрэнгүй                              |
|---------------|------------------------------------------|
| API           | JSONPlaceholder (jsonplaceholder.typicode.com) |
| Auth          | Байхгүй                                  |
| Request       | 8 request, 3 folder                      |
| Assertion     | 25+ тест, 6 төрлийн assertion            |
| CI            | GitHub Actions + Newman                  |

## Бүтэц

```
bie-daalt-14/
├── .github/workflows/api-tests.yml   # CI/CD
├── partA/
│   ├── SETUP.md                      # API тайлбар
│   └── screenshot.png                # Эхний request-ийн screenshot
├── postman/
│   ├── collection.json               # 8 request бүхий collection
│   ├── env.dev.json                  # Dev environment
│   └── env.ci.json                   # CI environment
├── reports/
│   └── api.html                      # Newman HTML тайлан
├── README.md
└── REFLECTION.md
```

## Локалд ажиллуулах

### 1. Newman суулгах

```bash
npm install -g newman newman-reporter-htmlextra
```

### 2. Тестийг ажиллуулах

```bash
# Зөвхөн CLI
newman run postman/collection.json -e postman/env.dev.json

# HTML тайлантай
newman run postman/collection.json \
  -e postman/env.dev.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reports/api.html
```

### 3. Тайланг үзэх

```bash
# Тайлан үүссэний дараа
open reports/api.html
```

## Postman-д импортлох

1. Postman Desktop нээх
2. **Import** → `postman/collection.json` оруулах
3. **Import** → `postman/env.dev.json` оруулах
4. Environment-ыг `dev` болгон сонгох
5. Collection ажиллуулах

## Тест хамрах хүрээ

| Folder  | Request                        | Assertions |
|---------|--------------------------------|------------|
| Posts   | Happy GET /posts               | 6 тест     |
| Posts   | GET /posts/:id (chain)         | 4 тест     |
| Posts   | POST /posts (pre-request)      | 5 тест     |
| Posts   | PUT /posts/1                   | 3 тест     |
| Posts   | DELETE /posts/1                | 3 тест     |
| Users   | GET /users (chain)             | 4 тест     |
| Users   | GET /posts?userId= (chain)     | 3 тест     |
| Errors  | GET /posts/999999 (negative)   | 3 тест     |

## CI/CD

GitHub Actions автоматаар push болон pull_request дээр ажилладаг.

**Actions tab** → Workflow run-уудыг харах → `api-test-report` artifact татаж авах