import { expect, test } from "bun:test"
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { parseArgs, namesOf, providerId, scaffold } from "./new.mjs"

// A tiny repository of its own: the checker, the two files it shares with
// a package, and one listing, so a scaffold is checked the way a real one
// would be. Nothing here reads or writes this repository.
function repo() {
  const dir = mkdtempSync(join(tmpdir(), "jianmu-new-test-"))
  mkdirSync(join(dir, "scripts"))
  mkdirSync(join(dir, "packages"))
  for (const f of ["check.mjs", "registry.mjs", "opencode2.mjs"]) copyFileSync(new URL(`./${f}`, import.meta.url), join(dir, "scripts", f))
  writeFileSync(join(dir, "registry.json"), JSON.stringify({ version: 1, plugins: [
    { package: "fixture", name: "Fixture", community: true, summary: { en: "A fixture.", zh: "示例。" } },
  ] }, null, 2) + "\n")
  return dir
}

const check = (dir) => {
  const r = Bun.spawnSync([process.execPath, join(dir, "scripts", "check.mjs")], { cwd: dir })
  return { code: r.exitCode, output: r.stdout.toString() + r.stderr.toString() }
}

test("a provider's skeleton checks clean and is listed", async () => {
  const dir = repo()
  try {
    const made = await scaffold(dir, { name: "opencode-foo-auth", kind: "provider", title: "Foo" })
    expect(made.full).toBe("@jianmu-plugins/opencode-foo-auth")
    const pkg = JSON.parse(readFileSync(join(dir, "packages", "opencode-foo-auth", "package.json"), "utf8"))
    // the old block stays for older hosts; the new one is read first
    expect(pkg.jianmu).toEqual(pkg.magpie)
    expect(pkg.exports["."]).toBe("./opencode2.mjs")
    const result = check(dir)
    expect(result.output).toContain("✓ registry.json")
    expect(result.output).toContain("✓ opencode-foo-auth")
    expect(result.code).toBe(0)
    const entry = JSON.parse(readFileSync(join(dir, "registry.json"), "utf8")).plugins.pop()
    expect(entry).toMatchObject({ package: "@jianmu-plugins/opencode-foo-auth", name: "Foo", providers: ["foo"], community: true })
    expect(entry.summary.en).toBeTruthy()
    expect(entry.summary.zh).toBeTruthy()
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("a middleware's skeleton checks clean with its kind", async () => {
  const dir = repo()
  try {
    await scaffold(dir, { name: "middleware-quiet", kind: "middleware", title: "Quiet" })
    const entry = JSON.parse(readFileSync(join(dir, "registry.json"), "utf8")).plugins.pop()
    expect(entry.kind).toBe("middleware")
    expect(entry.providers).toBeUndefined()
    const result = check(dir)
    expect(result.code).toBe(0)
    // a middleware is loaded by jianmu's gateway, not the plugin host, so
    // the checker lists the registry and leaves the package to its own tests
    expect(result.output).not.toContain("✗")
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("a tool's skeleton checks clean", async () => {
  const dir = repo()
  try {
    await scaffold(dir, { name: "tools-hello", kind: "tools" })
    expect(check(dir).code).toBe(0)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("a package already here, or listed already, is refused", async () => {
  const dir = repo()
  try {
    await scaffold(dir, { name: "agent-twice", kind: "agent" })
    await expect(scaffold(dir, { name: "agent-twice", kind: "agent" })).rejects.toThrow("already exists")
    const registry = JSON.parse(readFileSync(join(dir, "registry.json"), "utf8"))
    registry.plugins.push({ package: "@jianmu-plugins/listed-first", name: "Listed", community: true, summary: { en: "Listed.", zh: "已列出。" } })
    writeFileSync(join(dir, "registry.json"), JSON.stringify(registry, null, 2) + "\n")
    await expect(scaffold(dir, { name: "listed-first", kind: "agent" })).rejects.toThrow("is listed already")
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("names and kinds are read strictly", () => {
  expect(namesOf("foo")).toEqual({ full: "@jianmu-plugins/foo", dir: "foo" })
  expect(namesOf("@acme/foo")).toEqual({ full: "@acme/foo", dir: "foo" })
  expect(providerId("opencode-foo-auth")).toBe("foo")
  expect(() => namesOf("Foo Bar")).toThrow()
  expect(() => parseArgs([])).toThrow()
  expect(() => parseArgs(["x", "--kind", "nope"])).toThrow()
  expect(parseArgs(["x", "--kind", "page", "--title", "X"]).title).toBe("X")
})
