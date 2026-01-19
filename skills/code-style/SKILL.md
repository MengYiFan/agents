---
name: code-style
description: 代码生成规范，支持通用规范和项目差异化
---

# 代码生成规范 (Code Style Guidelines)

所有生成的代码必须遵循以下规范。请先检查项目特定规范，再使用通用规范。

---

## 项目特定规范

> **优先级**：项目规范 > 框架规范 > 通用规范

### 检测项目类型

请根据以下文件判断项目类型：

| 项目类型 | 特征文件 | 适用规范 |
|----------|----------|----------|
| **Nuxt 2** | `nuxt.config.js` | [Nuxt 2 规范](#nuxt-2-规范) |
| **Vue 2 SPA** | `vue.config.js` 或 `vite.config.ts` + Vue 2 | [Vue 2 SPA 规范](#vue-2-spa-规范) |
| **Vue 2 SSR** | `vue.config.js` + SSR 配置 | [Vue 2 SSR 规范](#vue-2-ssr-规范) |
| **Midway/Egg.js** | `midway.config.ts` 或 `egg` 依赖 | [Midway/Egg 规范](#midwayegg-规范) |
| **通用 TypeScript** | `tsconfig.json` | [TypeScript 通用规范](#typescript-通用规范) |

### 自定义规范文件

如果项目根目录存在以下文件，请优先使用：
- `.rules` - 项目规则文件
- `.code-style.yaml` - 代码风格配置
- `CODE_STANDARD.md` - 代码规范文档

---

## 通用规范 (Common)

### 命名规范

| 类型 | 风格 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | `getUserName` |
| 常量 | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| 类名 | PascalCase | `UserService` |
| 枚举 | UPPER_SNAKE | `USER_STATUS` |
| CSS 类名 | kebab-case | `user-profile-card` |

### 注释规范

- **语言**：使用中文注释
- **原则**：解释"为什么"，而非"是什么"
- **必要性**：仅在复杂逻辑处添加

### 格式规范

- **缩进**：2 空格
- **分号**：始终使用
- **引号**：字符串用单引号，JSX 用双引号
- **return 空行**：`return` 语句上方留一行空行
- **大括号**：即使单行也使用大括号

### 安全规范

- 使用链式调用 (`?.`) 处理空值
- 禁止使用 `any` 类型
- 避免 `eval()` 和 `new Function()`

---

## Nuxt 2 规范

### 目录结构

```
├── pages/           # 路由页面
├── components/      # 组件
├── store/           # Vuex 状态
├── plugins/         # 插件
├── middleware/      # 中间件
├── assets/          # 静态资源
└── static/          # 不编译的静态文件
```

### 特定规则

| 规则 | 说明 |
|------|------|
| **asyncData** | 服务端数据获取必须使用 `asyncData` 或 `fetch` |
| **SEO** | 页面必须设置 `head()` 返回 title 和 meta |
| **Vuex** | 使用 `nuxtServerInit` 进行服务端初始化 |
| **路由守卫** | 使用 Nuxt middleware 而非 Vue Router 守卫 |

### 代码示例

```vue
<script>
export default {
  async asyncData({ $axios, params, error }) {
    try {
      const data = await $axios.$get(`/api/item/${params.id}`);

      return { item: data };
    } catch (e) {
      error({ statusCode: 404, message: '未找到' });
    }
  },

  head() {
    return {
      title: this.item?.name ?? '默认标题',
      meta: [
        { hid: 'description', name: 'description', content: this.item?.desc }
      ]
    };
  }
};
</script>
```

---

## Vue 2 SPA 规范

### 特定规则

| 规则 | 说明 |
|------|------|
| **组件命名** | 多词命名，如 `UserProfile.vue` |
| **Prop 定义** | 必须指定类型和默认值 |
| **事件命名** | 使用 kebab-case，如 `@update-user` |
| **v-for** | 必须配合 `:key` 使用 |
| **样式作用域** | 使用 `scoped` 或 BEM 命名 |

### Vue 2 Options API 顺序

```javascript
export default {
  name: 'ComponentName',
  components: {},
  mixins: [],
  props: {},
  data() { return {}; },
  computed: {},
  watch: {},
  // 生命周期钩子
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
```

### 深度选择器

```scss
// ✅ 正确
::v-deep .child-class { }

// ❌ 错误
/deep/ .child-class { }
>>> .child-class { }
```

---

## Vue 2 SSR 规范

### 特定规则

继承 [Vue 2 SPA 规范](#vue-2-spa-规范)，额外注意：

| 规则 | 说明 |
|------|------|
| **window/document** | 仅在 `mounted` 或 `beforeMount` 中使用 |
| **状态共享** | 避免模块级变量导致状态污染 |
| **数据预取** | 使用 `serverPrefetch` 或框架提供的方法 |
| **第三方库** | 确认是否支持 SSR |

### TypeScript 集成

```typescript
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class UserCard extends Vue {
  @Prop({ type: String, required: true })
  readonly userId!: string;

  private loading = false;

  async fetchUser(): Promise<void> {
    this.loading = true;
    // ...
  }
}
```

---

## Midway/Egg 规范

### 目录结构

```
├── src/
│   ├── controller/    # 控制器
│   ├── service/       # 业务服务
│   ├── middleware/    # 中间件
│   ├── entity/        # 数据库实体
│   ├── dto/           # 数据传输对象
│   └── config/        # 配置文件
```

### 特定规则

| 规则 | 说明 |
|------|------|
| **依赖注入** | 使用 `@Inject()` 装饰器 |
| **路由定义** | 使用 `@Controller` 和 `@Get/@Post` |
| **参数校验** | 使用 DTO + class-validator |
| **错误处理** | 使用统一的异常过滤器 |
| **日志** | 使用 `this.logger` 而非 `console` |

### 代码示例

```typescript
import { Controller, Get, Inject, Query } from '@midwayjs/core';
import { UserService } from '../service/user.service';
import { QueryUserDTO } from '../dto/user.dto';

@Controller('/api/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Get('/list')
  async list(@Query() query: QueryUserDTO) {
    const result = await this.userService.findAll(query);

    return { success: true, data: result };
  }
}
```

---

## TypeScript 通用规范

### 类型规范

| 规则 | 说明 |
|------|------|
| **禁止 any** | 使用 `unknown` 替代 |
| **接口优先** | 优先 `interface` 而非 `type` |
| **readonly** | 不变数据使用 `readonly` |
| **枚举** | 使用 `const enum` 或字符串字面量联合 |

### 示例

```typescript
// ✅ 正确
interface UserProfile {
  readonly id: string;
  name: string;
  avatar?: string;
}

function getUser(id: string): UserProfile | null {
  // ...
}

// ❌ 错误
function getUser(id: any): any {
  // ...
}
```

---

## 检查项清单

在代码生成完成后，请自检以下项目：

- [ ] 命名符合规范（驼峰/常量/类名）
- [ ] 使用链式调用 `?.` 处理空值
- [ ] return 语句上方有空行
- [ ] 无 `any` 类型
- [ ] 使用 `::v-deep` 替代 `/deep/`
- [ ] 函数不超过 50 行
- [ ] 三元表达式嵌套不超过 2 层
- [ ] 每个组件标签有语义化 className
