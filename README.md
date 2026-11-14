# Jianmu Plugin Community

> English is the primary version. 简体中文版本见下文。

Jianmu's community catalog is maintained in [`plugins/registry.json`](plugins/registry.json). This repository is for proposing, reviewing, and maintaining community plugin listings.

- [Browse the catalog](plugins/registry.json)
- [Propose a change](https://github.com/TopoReduce/plugins/pulls)
- [Report a listing issue](https://github.com/TopoReduce/plugins/issues)

## What catalog inclusion means

A catalog entry means that maintainers accepted the listing into Jianmu's directory. It is **not** a security audit, a guarantee that a plugin is safe, or an endorsement of every future release. Review the plugin's source, permissions, dependencies, and publisher before installing it.

Plugins discovered automatically from public repositories are not curated catalog entries. Jianmu labels those entries **Unreviewed** until a maintainer reviews and lists them.

## Development standard

Community plugins must meet these baseline requirements:

1. **Open and attributable source.** Keep the implementation in a public source repository. Name the responsible maintainer and use a recognized open-source license; the repository and published package must identify the same project.
2. **Jianmu package namespace.** Publish community packages under `@TopoReduce/<package>`. Choose a stable, descriptive package name. Do not change an existing listing's install spec until the replacement package is published and its compatibility and migration path have been verified.
3. **Documented behavior.** Explain the plugin's purpose, supported products and platforms, required permissions, authentication flow, data sent to third parties, configuration, limitations, and how to sign out or remove it. Disclose telemetry and any background network activity.
4. **Credential and data safety.** Never commit credentials, tokens, private keys, or user data. Request only the access needed for the documented behavior; protect credentials in storage and logs; use HTTPS and validate remote responses. Do not collect or transmit user data beyond what the feature requires and documents.
5. **Respectful vendor integration.** Use supported sign-in and API flows. Do not bypass access controls, harvest credentials, evade usage limits, or misrepresent a vendor's service or a plugin's affiliation.
6. **Maintainable builds.** Keep dependencies minimal and lock them. Avoid opaque generated executables and undisclosed install-time downloads. Publish reproducible versioned releases and state which Jianmu/plugin-host API versions are supported.
7. **Evidence of testing.** Test the published package and its main success, failure, refresh, and removal paths. Include the commands and results in the source repository or pull request. Do not claim platforms or behaviors that were not tested.

## Catalog inclusion criteria

A listing is eligible when all of the following are true:

- The source repository is public, maintained, and clearly attributable to the package publisher.
- The package is published and installable, and its exact package name and version are verifiable from the package registry.
- The project has a recognized open-source license and a user-facing README covering purpose, setup, permissions, data handling, limitations, and support contact.
- The plugin meets the development standard above, has a clear Jianmu use case, and provides enough test evidence for maintainers to review its core behavior.
- The proposed registry entry has the correct package spec, display name, provider IDs, kind, replacement mapping (if any), and concise English and Chinese summaries. Each claim matches the source and published package.
- The change does not duplicate an existing listing or silently take over another publisher's package or provider identity.

A listing can be declined or removed if its source disappears, its publisher cannot be verified, it stops meeting these requirements, or a material security or compatibility issue remains unresolved.

## Submit or update a listing

Open a pull request that changes `plugins/registry.json`. Include:

- The source repository URL and exact published package name/version.
- License, maintainer, purpose, provider IDs, supported platforms, and required permissions.
- English and Chinese summaries, plus any replacement mapping and kind.
- The test commands and results for the published version.
- A note describing any install-spec, provider-ID, or ownership change and its migration impact.

Keep one plugin's listing changes focused in each pull request. Do not include credentials, user data, or unrelated generated files. Maintainers may request changes before merging.

## Review and security

Maintainers review pull requests in GitHub. Review includes checking registry structure and the contributor's test evidence. Automated checks, when configured, do not replace human review. Stars, downloads, and automatic discovery are not approval signals. There is no in-app moderation queue: use the repository's pull requests for proposed changes and issues for public listing problems.

For a suspected vulnerability, do not post exploit details or personal data in a public issue. Use GitHub's private vulnerability reporting for this repository if it is enabled; otherwise open an issue requesting a private contact channel without publishing the sensitive details.

---

# Jianmu 插件社区

> 以下为简体中文说明；英文版为主版本。

Jianmu 社区目录维护于 [`plugins/registry.json`](plugins/registry.json)。本仓库用于提交、审核和维护社区插件条目。

- [查看目录](plugins/registry.json)
- [提交修改](https://github.com/TopoReduce/plugins/pulls)
- [反馈条目问题](https://github.com/TopoReduce/plugins/issues)

## 收录的含义

被收录表示维护者接受了该插件的目录条目，**不代表**完成安全审计、不代表插件绝对安全，也不代表认可其后续所有版本。安装前请自行检查源码、权限、依赖和发布者。

从公开仓库自动发现的插件不属于已审核目录条目；维护者审核并收录之前，Jianmu 会将其标为“未审核”。

## 开发标准

社区插件至少应符合以下要求：

1. **源码公开且可追责。** 在公开仓库维护实现，说明责任维护者，采用公认的开源许可证；源码仓库与发布包必须对应同一项目。
2. **使用 Jianmu 包命名空间。** 社区插件发布至 `@TopoReduce/<package>`，名称应稳定且能说明用途。替换包须先发布并验证兼容性与迁移方案，之后才能修改现有条目的安装 spec。
3. **行为有文档说明。** 说明用途、支持的产品和平台、所需权限、认证方式、发送给第三方的数据、配置、限制，以及退出登录或卸载方法；披露遥测和后台网络行为。
4. **保护凭据和数据。** 不得提交凭据、令牌、私钥或用户数据。只请求实现功能所需的权限；妥善保护存储与日志中的凭据；使用 HTTPS 并校验远程响应。不得收集或传输超出功能所需且未披露的数据。
5. **遵守服务方规则。** 使用受支持的登录和 API 流程；不得绕过访问控制、收集凭据、规避使用限制，也不得误述服务方或插件的归属关系。
6. **便于维护和构建。** 尽量减少并锁定依赖；避免不透明的生成式可执行文件和未披露的安装时下载。发布可追溯的版本，并说明支持的 Jianmu/插件宿主 API 版本。
7. **提供测试证据。** 测试已发布包的主要成功、失败、刷新和卸载流程。在源码仓库或 PR 中列出测试命令与结果；未验证的平台或行为不得宣称已支持。

## 目录收录标准

同时满足以下条件的条目才可收录：

- 源码仓库公开、持续维护，且包的发布者和项目归属清晰。
- 包已发布且可安装，准确的包名和版本可在包注册表中核验。
- 项目使用公认的开源许可证，并有面向用户的 README，说明用途、配置、权限、数据处理、限制和支持渠道。
- 符合上述开发标准，具有明确的 Jianmu 使用场景，并提供足以审核核心行为的测试证据。
- 注册表条目的 package spec、显示名称、provider ID、类型、替换关系（如适用）和中英文简介准确，并与源码及已发布包一致。
- 不重复已有条目，不冒用其他发布者的包或 provider 身份。

如果源码失效、发布者无法核实、不再符合要求，或重大安全/兼容问题未解决，维护者可以拒绝或移除条目。

## 提交或更新条目

通过 PR 修改 `plugins/registry.json`，并提供：

- 源码仓库地址和准确的已发布包名/版本。
- 许可证、维护者、用途、provider ID、支持平台和所需权限。
- 英文与中文简介，以及替换关系和插件类型（如适用）。
- 对应已发布版本的测试命令与结果。
- 安装 spec、provider ID 或所有权变更及其迁移影响。

每个 PR 尽量只聚焦一个插件条目。不要提交凭据、用户数据或无关生成文件。维护者可以在合并前要求修改。

## 审核与安全

维护者在 GitHub PR 中审核。审核包括检查注册表结构与贡献者提供的测试证据。若配置了自动检查，它们也不能替代人工审核。Star、下载量和自动发现都不代表通过审核。应用内没有审核队列：目录修改请走 PR，公开条目问题请提 Issue。

发现疑似安全漏洞时，不要在公开 Issue 中披露利用细节或个人数据。若本仓库启用了 GitHub 私密漏洞报告，请使用该功能；否则仅提交请求私下联系的 Issue，不要公开敏感细节。
