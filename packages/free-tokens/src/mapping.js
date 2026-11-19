// AIHOT 羊毛 → magpie 插件。一律用完整 npm 包名（magpie plugin add <npm>），不使用短名（短名可能指向被抢注的无作用域包）。
export const MAPPING = {
  "豆包": { pid: "doubao-work", npm: "@jianmu-plugins/opencode-doubao-work-auth", name: "豆包工作", checkin: false },
  "Cloudflare": { pid: "cloudflare-workers-ai", npm: "@jianmu-plugins/opencode-cloudflare-workers-ai-auth", name: "Cloudflare Workers AI", checkin: false },
  "MiniMax": { pid: "minimax-code", npm: "@jianmu-plugins/opencode-minimax-auth", name: "MiniMax Code", checkin: true },
  "阿里云 Qoder": { pid: ["qoder", "qoder-cn"], npm: "@jianmu-plugins/opencode-qoder-auth", name: "Qoder", checkin: true },
  "字节 TRAE": { pid: "trae-cn", npm: "@jianmu-plugins/opencode-trae-auth", name: "Trae", checkin: true },
  "腾讯 WorkBuddy": { pid: "workbuddy", npm: "@jianmu-plugins/opencode-workbuddy-auth", name: "WorkBuddy", checkin: true },
  "书生·端砚": { pid: "intern-inkstone", npm: "@jianmu-plugins/opencode-inkstone-auth", name: "书生·端砚", checkin: true },
  "Zed": { pid: "zed", npm: "@jianmu-plugins/opencode-zed-auth", name: "Zed", checkin: false },
  "华为云码道": { pid: "codearts", npm: "@jianmu-plugins/opencode-codearts-auth", name: "CodeArts", checkin: true },
  "智谱 AutoClaw": { pid: "autoclaw-cn", npm: "@jianmu-plugins/opencode-autoclaw-auth", name: "AutoClaw", checkin: true },
  "智谱 ZCode": { pid: "zcode", npm: "@jianmu-plugins/opencode-zcode-auth", name: "ZCode", checkin: true },
  "商汤日日新": { pid: "sensenova-token-plan", npm: "@jianmu-plugins/opencode-sensenova-auth", name: "SenseNova", checkin: false },
  "OpenCode": { pid: "opencode-zen-free", npm: "@jianmu-plugins/opencode-zen-free-auth", name: "OpenCode Zen Free", checkin: false },
};
