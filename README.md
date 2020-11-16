# SEproject

> 已关闭eslint

```json
//若重新启动
//在package.json中

  "husky": {
    "hooks": {
      "pre-commit": "npm run lint-staged"
    }
  },
```



> 问题：Ant Design Pro：只有 pages 或 page 目录下的页面才能插入资产。

解决办法：

```js
set BABEL_CACHE=none&&umi dev
```

