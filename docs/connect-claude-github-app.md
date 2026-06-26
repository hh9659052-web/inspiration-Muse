# 连接 Claude GitHub App

让 Claude（Claude Code on the web / GitHub Actions）能够在你的仓库里**创建 PR、评论、推送修复**。本次会话中创建 PR 失败（`403 Resource not accessible by integration`），正是因为该仓库还没连接好具备写权限的 Claude GitHub App。

## 为什么需要它

| 能力 | 没连接 App | 连接 App 后 |
|------|-----------|------------|
| 读代码 / 推送分支（用 PAT） | ✅ | ✅ |
| Claude 自动**创建 PR** | ❌ 403 | ✅ |
| Claude **回复评论 / 自动修 CI** | ❌ | ✅ |
| 订阅 PR 事件并跟进 | ❌ | ✅ |

## 安装步骤

### 方式 A：在 Claude Code CLI 里一键安装（最快）

```bash
# 在本地终端运行
claude
# 进入后输入斜杠命令
/install-github-app
```

按提示选择要授权的账号/组织与仓库（选 `inspiration-Muse` 或 All repositories）。

### 方式 B：在 GitHub 网页安装

1. 打开 https://github.com/apps/claude
2. 点 **Install / Configure**
3. 选择账号 `hh9659052-web`
4. **Repository access** → 选 `Only select repositories` → 勾 `inspiration-Muse`（或 All repositories）
5. 确认权限（见下）并安装

## 需要授予的权限

| 权限项 | 级别 | 用途 |
|--------|------|------|
| Contents | Read and write | 推送、读写文件 |
| Pull requests | Read and write | 创建 / 更新 PR、评论 |
| Issues | Read and write | 读写 issue（可选） |
| Metadata | Read | 基础信息（自动包含） |
| Workflows / Checks | Read | 读取 CI 状态（自动修 CI 时需要） |

> 若仓库属于**组织**，需要组织管理员批准 App 安装；个人账号则你自己确认即可。

## 验证是否生效

连接后，在新的 Claude Code on the web 会话里让 Claude「创建一个 PR」或「读取 PR 列表」，不再返回 403 即表示成功。也可在 GitHub → `Settings → Integrations / Applications → Installed GitHub Apps` 看到 **Claude** 并确认其仓库范围与权限。

## 与 PAT 的关系

- **PAT（个人访问令牌）**：用于 `git push` 这类 Git 操作，本次推送就是靠它完成的。
- **GitHub App**：用于 Claude 通过 GitHub **API** 做 PR/评论/CI 等。
- 两者互补：连了 App 之后，日常仍可能用 PAT 推送，但 PR 等 API 操作就不再被 `403` 挡住了。

参考：https://docs.anthropic.com/en/docs/claude-code/github-actions
