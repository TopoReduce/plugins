# Jianmu 插件社区

Jianmu 的社区插件目录由本仓库维护：`plugins/registry.json`。

## 查看与申请收录

- 插件目录：<https://github.com/TopoReduce/plugins/blob/main/plugins/registry.json>
- 提交和审核：<https://github.com/TopoReduce/plugins/pulls>
- 问题反馈：<https://github.com/TopoReduce/plugins/issues>

新增或修改条目请提交 Pull Request，说明插件用途、原始源码仓库、安装包名、版本、许可证和必要权限，并提供中英文简介。维护者检查来源、行为与兼容性后决定是否合并；仅修改目录展示名时保留原始 package、provider ID、安装 spec 与作者署名。

## 审核状态的含义

`community: true` 表示社区目录收录，不是独立的安全审核认证。GitHub topic 自动发现的插件仍显示“未审核”；下载量、Star、点赞不是审核结果。本仓库当前没有应用内审批后台或自动审批流程，审核记录保留在 PR 的讨论、Review 和合并记录中。

## 安装包与兼容性

本仓库维护插件目录，不重新发布第三方安装包。npm 包名和 `@magpie-community/` scope 保持原样；现有上游分发路径继续使用，避免破坏安装及更新。Magpie 上游社区是 <https://github.com/magpie-community/plugins>。
