// Makes a new plugin's skeleton: packages/<name>/ with a package.json, an
// implementation stub, a test, and (for a provider) the OpenCode 2 face;
// and one registry.json entry. The stub does nothing yet, but it passes
// scripts/check.mjs for its kind, so a contributor starts from a repo that
// checks clean.
//   bun scripts/new.mjs <name> [--kind provider|middleware|agent|page|tools]
//                     [--title "Shown Name"] [--summary-en "…"] [--summary-zh "…"]
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"

export const SCOPE = "@jianmu-plugins/"
export const KINDS = ["provider", "middleware", "agent", "page", "tools"]

// parseArgs reads the command line: the name, and the flags that fill the
// package and its entry.
export function parseArgs(argv) {
  const out = { kind: "provider", title: "", summaryEn: "", summaryZh: "" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const take = (key) => { const v = argv[++i]; if (v === undefined) throw new Error(`${a} needs a value`); out[key] = v }
    if (a === "--kind") take("kind")
    else if (a === "--title") take("title")
    else if (a === "--summary-en") take("summaryEn")
    else if (a === "--summary-zh") take("summaryZh")
    else if (a === "--root") take("root")
    else if (a.startsWith("--")) throw new Error(`unknown option ${a}`)
    else if (out.name) throw new Error(`unexpected argument ${a}`)
    else out.name = a
  }
  if (!out.name) throw new Error("usage: bun scripts/new.mjs <name> [--kind …] [--title …]")
  if (!KINDS.includes(out.kind)) throw new Error(`--kind is one of ${KINDS.join(", ")}`)
  return out
}

// namesOf is the package's full name and the folder it lives in: a bare
// name is put under the community scope; a scoped one is kept as written
// (an author's own package in their own scope).
export function namesOf(input) {
  const full = input.startsWith("@") ? input : SCOPE + input
  const m = /^(@[a-z0-9][a-z0-9._~-]*\/)?([a-z0-9][a-z0-9._~-]*)$/.exec(full)
  if (!m || full.length > 214) throw new Error(`"${input}" is not an npm package name`)
  return { full, dir: m[2] }
}

// providerId is the provider a provider package signs in to, guessed from
// its name (opencode-foo-auth → foo); the maintainer changes it if wrong.
export function providerId(dir) {
  return dir.replace(/^opencode-/, "").replace(/-(auth|plugin)$/, "").replace(/[^a-z0-9-]/g, "-")
}

const quote = (s) => JSON.stringify(s)

// filesOf is every file the kind's skeleton has, by path under the package.
export function filesOf({ full, dir, kind, title, provider }) {
  const words = title || dir
  const meta = (extra) => ({ jianmu: extra, magpie: extra })
  switch (kind) {
    case "provider":
      return {
        "package.json": JSON.stringify({
          name: full, version: "0.1.0", description: `${words} for Jianmu`,
          type: "module", main: "./index.mjs",
          exports: { ".": "./opencode2.mjs" },
          files: ["index.mjs", "opencode.mjs", "opencode2.mjs", "README.md"],
          license: "MIT", keywords: ["jianmu", "jianmu-plugin", "opencode-plugin"],
          engines: { node: ">=20" },
          ...meta({ name: words, summary: { en: `${words} for Jianmu.`, zh: `${words}：Jianmu 的插件。` } }),
        }, null, 2) + "\n",
        "index.mjs": `// ${words}: a provider plugin. Replace the stub's sign-in and fetch with
// the vendor's own flow; scripts/check.mjs only checks the shape.
export const Plugin = async ({ client }) => ({
  auth: {
    provider: ${quote(provider)},
    methods: [{ type: "api", label: "API key", authorize: async () => ({ type: "api", key: "" }) }],
    loader: async (getAuth) => ({
      fetch: async (input, init) => fetch(input, init),
    }),
  },
  config: async (cfg) => {
    cfg.provider[${quote(provider)}] = {
      name: ${quote(words)},
      npm: "@ai-sdk/openai-compatible",
      models: {},
    }
  },
  provider: { id: ${quote(provider)}, models: () => ({}) },
})
`,
        "opencode.mjs": 'export { Plugin } from "./index.mjs"\n',
        "README.md": `# ${words}

${words} for Jianmu.

## Install

\`\`\`sh
jianmu plugin add ${full}
\`\`\`

Configure it under Providers. It signs in with an API key and serves the
vendor's models.

## What it does

- Signs in to the vendor.
- Serves the account's models.

## Data

It sends the requests your agents make and the account's sign-in to the
vendor. It reads no other file and sends nothing else.

## License

MIT.
`,
        "index.test.mjs": `import { expect, test } from "bun:test"
import { Plugin } from "./index.mjs"

test("the plugin gives its provider", async () => {
  const hooks = await Plugin({ client: { auth: { set: async () => {} } } })
  expect(hooks.auth.provider).toBe(${quote(provider)})
})
`,
      }
    case "middleware":
      return {
        "package.json": JSON.stringify({
          name: full, version: "0.1.0", description: `${words}: a gateway middleware for Jianmu`,
          type: "module", main: "./index.mjs", files: ["index.mjs", "README.md"],
          license: "MIT", keywords: ["jianmu", "jianmu-middleware"],
          ...meta({ name: words, middleware: "./index.mjs", options: {} }),
        }, null, 2) + "\n",
        "index.mjs": `// ${words}: a gateway middleware. jianmu hands it the request body and
// the options the user set; what it returns is what goes upstream.
export default async function middleware(body, ctx) {
  return body
}
`,
        "README.md": `# ${words}

A Jianmu gateway middleware: it changes the requests your agents send.

## Install

\`\`\`sh
jianmu plugin add ${full}
\`\`\`

## What it does

It rewrites the request body in every API spoken through the gateway.
Nothing else is read or sent.

## License

MIT.
`,
        "index.test.mjs": `import { expect, test } from "bun:test"
import middleware from "./index.mjs"

test("a request goes through as it came", async () => {
  const body = { model: "m", messages: [] }
  expect(await middleware(body, { options: {} })).toEqual(body)
})
`,
      }
    case "agent":
      return {
        "package.json": JSON.stringify({
          name: full, version: "0.1.0", description: `${words}: an agent for Jianmu`,
          type: "module", main: "./index.mjs", files: ["index.mjs", "README.md"],
          license: "MIT", keywords: ["jianmu", "jianmu-agent"],
          ...meta({ name: words, agent: "./index.mjs" }),
        }, null, 2) + "\n",
        "index.mjs": `// ${words}: an agent jianmu wires to its gateway. Export what the agent's
// setup needs; nothing is loaded by the plugin host.
export const agent = { id: ${quote(dir)} }
`,
        "README.md": `# ${words}

${words} as a Jianmu agent: pick a model on the Agents page and it goes
through jianmu's gateway.

## Install

\`\`\`sh
jianmu plugin add ${full}
\`\`\`

## License

MIT.
`,
        "index.test.mjs": `import { expect, test } from "bun:test"
import { agent } from "./index.mjs"

test("the agent names itself", () => {
  expect(agent.id).toBe(${quote(dir)})
})
`,
      }
    case "page":
      return {
        "package.json": JSON.stringify({
          name: full, version: "0.1.0", description: `${words}: a page in Jianmu's window`,
          type: "module", files: ["page/index.html", "README.md"],
          license: "MIT", keywords: ["jianmu", "jianmu-page"],
          ...meta({ name: words, page: { title: words, file: "page/index.html" }, permissions: [] }),
        }, null, 2) + "\n",
        "page/index.html": `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${words}</title></head>
<body><p>${words}</p></body>
</html>
`,
        "README.md": `# ${words}

A page in Jianmu's window. It reads only what its \`jianmu.permissions\`
list asks for.

## Install

\`\`\`sh
jianmu plugin add ${full}
\`\`\`

## License

MIT.
`,
      }
    case "tools":
      return {
        "package.json": JSON.stringify({
          name: full, version: "0.1.0", description: `${words}: tools for every Jianmu agent`,
          type: "module", main: "./index.mjs", files: ["index.mjs", "README.md"],
          license: "MIT", keywords: ["jianmu", "jianmu-tools"],
          ...meta({ name: words }),
        }, null, 2) + "\n",
        "index.mjs": `// ${words}: tools every agent gets, through jianmu's MCP server.
export const Plugin = async () => ({
  tool: {
    hello: {
      description: "Say hello to a name.",
      args: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
      execute: async ({ name }) => ({ title: "Hello", output: \`Hello, \${name}\` }),
    },
  },
})
`,
        "README.md": `# ${words}

Tools every Jianmu agent gets, through jianmu's MCP server.

## Install

\`\`\`sh
jianmu plugin add ${full}
\`\`\`

## License

MIT.
`,
        "index.test.mjs": `import { expect, test } from "bun:test"
import { Plugin } from "./index.mjs"

test("the tool answers", async () => {
  const { tool } = await Plugin()
  expect((await tool.hello.execute({ name: "Jianmu" })).output).toBe("Hello, Jianmu")
})
`,
      }
  }
  throw new Error(`no skeleton for ${kind}`)
}

// entryText is the registry.json entry, as the file writes one: four
// spaces in, its summary on the next line.
export function entryText({ full, kind, title, provider, summaryEn, summaryZh }) {
  const kindField = kind === "provider" ? "" : `"kind": ${quote(kind)}, `
  const providers = kind === "provider" ? `"providers": [${quote(provider)}], ` : ""
  return `    { "package": ${quote(full)}, "name": ${quote(title)}, ${kindField}${providers}"community": true,\n`
    + `      "summary": { "en": ${quote(summaryEn)}, "zh": ${quote(summaryZh)} } }`
}

// scaffold writes the files and adds the entry under root. It returns what
// it made, so a caller (and its test) can say what to do next.
export async function scaffold(root, opts) {
  const { full, dir } = namesOf(opts.name)
  const kind = opts.kind
  const title = opts.title || dir
  const provider = providerId(dir)
  const summaryEn = opts.summaryEn || `TODO: one sentence on what ${title} does.`
  const summaryZh = opts.summaryZh || `TODO：一句话说明 ${title} 的用途。`

  const pkgDir = join(root, "packages", dir)
  if (await stat(pkgDir).then(() => true, () => false)) throw new Error(`packages/${dir} already exists`)

  const registryPath = join(root, "registry.json")
  const text = await readFile(registryPath, "utf8")
  const registry = JSON.parse(text)
  if (registry.plugins.some((p) => p.package === full)) throw new Error(`${full} is listed already`)
  const end = text.lastIndexOf("\n  ]")
  if (end < 0) throw new Error("registry.json does not end with \"  ]\"")

  const files = filesOf({ full, dir, kind, title, provider })
  for (const [rel, body] of Object.entries(files)) {
    const to = join(pkgDir, rel)
    await mkdir(dirname(to), { recursive: true })
    await writeFile(to, body)
  }
  // the OpenCode 2 face is one file, byte for byte, copied from scripts/
  if (kind === "provider") {
    await copyFile(join(root, "scripts", "opencode2.mjs"), join(pkgDir, "opencode2.mjs"))
  }
  const entry = entryText({ full, kind, title, provider, summaryEn, summaryZh })
  await writeFile(registryPath, text.slice(0, end) + ",\n" + entry + text.slice(end))
  return { full, dir, kind, entry, files: Object.keys(files) }
}

// main is the command line.
async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const root = opts.root || resolve(import.meta.dir, "..")
  const made = await scaffold(root, opts)
  console.log(`✓ packages/${made.dir} (${made.kind}) and its registry.json entry for ${made.full}`)
  console.log("next: fill in the stub and its README, then")
  console.log("  bun scripts/check.mjs")
  console.log(`  bun test packages/${made.dir}`)
  console.log("  sh scripts/publish.sh")
}

if (import.meta.main) {
  main().catch((e) => {
    console.error(`✗ ${e.message}`)
    process.exit(1)
  })
}
