#!/usr/bin/env node
/**
 * Local board server: serves board.html and lets people AND tools write to the board.
 *
 *   pnpm board          (in src/frontend) start it: http://localhost:4000, or the next free port;
 *                       Ctrl+C stops it. Same as `node board-server.mjs` from the repo root.
 *   node board-server.mjs --stop     stop a board running in the background (no terminal to Ctrl+C)
 *   node board-server.mjs --port 4100 --root <dir>   (other port / another repo copy)
 *
 * Without it, board.html still opens straight from disk, read-only.
 *
 * API (JSON, 127.0.0.1 only):
 *   GET  /api/health                         { ok, board: true, port, root }
 *   GET  /api/board                          the full board (same data as docs/tracker/board-data.js)
 *   POST /api/items/:key/comments            { author, role?, body, attachments? } → the saved comment
 *   POST /api/items/:key/status              { status, author? } → the updated item
 *        status is one of: New, In Progress, In Review, In QA, In Acceptance, Done
 *   POST /api/items/:key/attachments?name=…  raw file body → { path } under docs/qa/<KEY>/
 *
 * Every write re-reads docs/tracker/board-data.js, applies one change and atomically replaces the
 * file, one write at a time — so humans on the board and AI tools never overwrite each other.
 * Plain Node, no dependencies.
 */
import http from "node:http"
import fs from "node:fs"
import fsp from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const args = process.argv.slice(2)
const argValue = (name) => {
  const i = args.indexOf(name)
  return i !== -1 ? args[i + 1] : undefined
}

const ROOT = path.resolve(argValue("--root") ?? path.dirname(fileURLToPath(import.meta.url)))
const DATA_FILE = path.join(ROOT, "docs", "tracker", "board-data.js")
const QA_DIR = path.join(ROOT, "docs", "qa")
const STATE_FILE = path.join(ROOT, ".board-server.json")
const FIRST_PORT = Number(argValue("--port") ?? process.env.BOARD_PORT ?? 4000)
const STATUSES = ["New", "In Progress", "In Review", "In QA", "In Acceptance", "Done"]
const MAX_JSON_BYTES = 256 * 1024
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024
const PREFIX = "window.BOARD = "

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
}
const UPLOAD_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".webm", ".mp4", ".md", ".txt", ".json"])

// ---------------------------------------------------------------- --stop
if (args.includes("--stop")) {
  try {
    const { pid, port } = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"))
    process.kill(pid)
    fs.rmSync(STATE_FILE, { force: true })
    console.log(`Board server stopped (port ${port}, pid ${pid}).`)
  } catch {
    console.log("No running board server found.")
  }
  process.exit(0)
}

// ---------------------------------------------------------------- board data
function now() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function readBoard() {
  const text = await fsp.readFile(DATA_FILE, "utf8")
  const start = text.indexOf(PREFIX)
  if (start === -1) throw new HttpError(500, "board-data.js doesn't start with window.BOARD =")
  const json = text.slice(start + PREFIX.length).trim().replace(/;\s*$/, "")
  return JSON.parse(json)
}

async function writeBoard(board) {
  const tmp = `${DATA_FILE}.${process.pid}.tmp`
  await fsp.writeFile(tmp, PREFIX + JSON.stringify(board, null, 2) + ";\n", "utf8")
  await fsp.rename(tmp, DATA_FILE) // atomic: readers never see a half-written file
}

// One write at a time, each on a fresh read of the file.
let queue = Promise.resolve()
function updateBoard(change) {
  const run = queue.then(async () => {
    const board = await readBoard()
    const result = change(board)
    await writeBoard(board)
    return result
  })
  queue = run.catch(() => {})
  return run
}

function findItem(board, key) {
  const item = Array.isArray(board.items) ? board.items.find((i) => i.key === key) : undefined
  if (!item) throw new HttpError(404, `No item ${key} on the board`)
  return item
}

// An epic's status follows its stories: all New → New, all Done → Done, all In Acceptance or Done
// → In Acceptance, anything else once work has started → In Progress.
function epicStatus(statuses) {
  const s = statuses.map((x) => STATUSES.find((k) => k.toLowerCase() === String(x ?? "").trim().toLowerCase()) ?? "New")
  if (!s.length || s.every((x) => x === "New")) return "New"
  if (s.every((x) => x === "Done")) return "Done"
  if (s.every((x) => x === "In Acceptance" || x === "Done")) return "In Acceptance"
  return "In Progress"
}

function touch(item) {
  item.updated = now()
  item.updates = (Number(item.updates) || 0) + 1
}

// ---------------------------------------------------------------- validation
class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function text(value, field, max, required = false) {
  if (value === undefined || value === null || value === "") {
    if (required) throw new HttpError(400, `${field} is required`)
    return undefined
  }
  if (typeof value !== "string") throw new HttpError(400, `${field} must be text`)
  const trimmed = value.trim()
  if (required && !trimmed) throw new HttpError(400, `${field} is required`)
  if (trimmed.length > max) throw new HttpError(400, `${field} is longer than ${max} characters`)
  return trimmed
}

// Attachments may only point at files next to the board (relative paths) or http(s) URLs.
function cleanAttachment(a) {
  if (!a || typeof a !== "object") throw new HttpError(400, "each attachment must be an object")
  const type = ["video", "image", "link"].includes(a.type) ? a.type : "link"
  const ref = text(a.path ?? a.url, "attachment path", 500, true)
  const isHttp = /^https?:\/\//i.test(ref)
  if (!isHttp && (/^[a-z][a-z0-9+.-]*:/i.test(ref) || ref.startsWith("/") || ref.split(/[\\/]/).includes(".."))) {
    throw new HttpError(400, `attachment path must be relative to the repo or an http(s) URL: ${ref}`)
  }
  const out = { type, [isHttp || type === "link" ? "url" : "path"]: ref }
  const label = text(a.label, "attachment label", 200)
  if (label) out.label = label
  if (a.ac !== undefined && a.ac !== null && a.ac !== "") out.ac = typeof a.ac === "number" ? a.ac : text(String(a.ac), "ac", 20)
  if (a.result === "pass" || a.result === "fail") out.result = a.result
  return out
}

// ---------------------------------------------------------------- HTTP helpers
function send(res, status, body, type = "application/json; charset=utf-8") {
  const payload = typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body)
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" })
  res.end(payload)
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on("data", (chunk) => {
      size += chunk.length
      if (size > limit) {
        reject(new HttpError(413, "Body too large"))
        req.destroy()
      } else {
        chunks.push(chunk)
      }
    })
    req.on("end", () => resolve(Buffer.concat(chunks)))
    req.on("error", reject)
  })
}

async function readJson(req) {
  const raw = await readBody(req, MAX_JSON_BYTES)
  try {
    return JSON.parse(raw.toString("utf8") || "{}")
  } catch {
    throw new HttpError(400, "Body must be JSON")
  }
}

// Static files: only board.html and files under docs/, never dotfiles, never outside the repo.
async function serveStatic(res, urlPath) {
  let requested
  try {
    requested = decodeURIComponent(urlPath === "/" ? "/board.html" : urlPath).replace(/^\/+/, "")
  } catch {
    throw new HttpError(400, "Bad path")
  }
  const full = path.resolve(ROOT, requested)
  // Checks run on the RESOLVED path, so "docs/../CLAUDE.md" can't sneak past them.
  const rel = path.relative(ROOT, full).split(path.sep).join("/")
  const inside = full.startsWith(ROOT + path.sep)
  const allowed = rel === "board.html" || rel.startsWith("docs/")
  const hidden = rel.split("/").some((part) => part.startsWith("."))
  if (!inside || !allowed || hidden) throw new HttpError(404, "Not found")
  const type = TYPES[path.extname(full).toLowerCase()]
  if (!type) throw new HttpError(404, "Not found")
  let stat
  try {
    stat = await fsp.stat(full)
  } catch {
    throw new HttpError(404, "Not found")
  }
  if (!stat.isFile()) throw new HttpError(404, "Not found")
  res.writeHead(200, { "Content-Type": type, "Content-Length": stat.size, "Cache-Control": "no-store" })
  fs.createReadStream(full).pipe(res)
}

// ---------------------------------------------------------------- routes
async function handle(req, res, port) {
  const url = new URL(req.url, "http://localhost")
  const route = url.pathname

  // Same-machine only, and no cross-site writes from other pages in the browser.
  if (req.method !== "GET") {
    const origin = req.headers.origin
    if (origin && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) throw new HttpError(403, "Cross-origin write refused")
  }

  if (req.method === "GET" && route === "/api/health") return send(res, 200, { ok: true, board: true, port, root: ROOT })
  if (req.method === "GET" && route === "/api/board") return send(res, 200, await readBoard())

  const m = route.match(/^\/api\/items\/([A-Za-z][A-Za-z0-9]*-\d+)\/(comments|status|attachments)$/)
  if (m && req.method === "POST") {
    const [, key, action] = m

    if (action === "comments") {
      const body = await readJson(req)
      const comment = {
        author: text(body.author, "author", 80, true),
        role: text(body.role, "role", 40),
        created: now(),
        body: text(body.body, "body", 10000, true),
      }
      if (!comment.role) delete comment.role
      if (body.attachments !== undefined) {
        if (!Array.isArray(body.attachments) || body.attachments.length > 20) throw new HttpError(400, "attachments must be a list of at most 20")
        comment.attachments = body.attachments.map(cleanAttachment)
      }
      const saved = await updateBoard((board) => {
        const item = findItem(board, key)
        item.comments = Array.isArray(item.comments) ? item.comments : []
        item.comments.push(comment)
        touch(item)
        return comment
      })
      return send(res, 201, saved)
    }

    if (action === "status") {
      const body = await readJson(req)
      const status = STATUSES.find((s) => s.toLowerCase() === String(body.status ?? "").trim().toLowerCase())
      if (!status) throw new HttpError(400, `status must be one of: ${STATUSES.join(", ")}`)
      const updated = await updateBoard((board) => {
        const item = findItem(board, key)
        if (item.type === "Epic") {
          throw new HttpError(400, `${key} is an epic: its status follows its stories, so move a story instead`)
        }
        item.status = status
        touch(item)
        // The story's epic follows its stories (board.html applies the same rule).
        const epic = item.parent ? board.items.find((i) => i.key === item.parent && i.type === "Epic") : null
        if (epic) {
          const next = epicStatus(board.items.filter((i) => i.parent === epic.key).map((i) => i.status))
          if (epic.status !== next) {
            epic.status = next
            touch(epic)
          }
        }
        return item
      })
      return send(res, 200, updated)
    }

    if (action === "attachments") {
      const name = path.basename(String(url.searchParams.get("name") ?? "")).replace(/[^A-Za-z0-9._-]/g, "_")
      const ext = path.extname(name).toLowerCase()
      if (!name || name.startsWith(".") || !UPLOAD_EXTENSIONS.has(ext)) {
        throw new HttpError(400, `name must be a file name ending in one of: ${[...UPLOAD_EXTENSIONS].join(" ")}`)
      }
      findItem(await readBoard(), key) // 404 for unknown tickets before writing anything
      const data = await readBody(req, MAX_UPLOAD_BYTES)
      if (!data.length) throw new HttpError(400, "Empty file")
      const dir = path.join(QA_DIR, key)
      await fsp.mkdir(dir, { recursive: true })
      await fsp.writeFile(path.join(dir, name), data)
      return send(res, 201, { path: `docs/qa/${key}/${name}`, bytes: data.length })
    }
  }

  if (req.method === "GET") return serveStatic(res, route)
  throw new HttpError(404, "Not found")
}

// ---------------------------------------------------------------- start
async function isOurServer(port) {
  try {
    const r = await fetch(`http://127.0.0.1:${port}/api/health`, { signal: AbortSignal.timeout(800) })
    const body = await r.json()
    // Another copy of this repo (a second clone or worktree) may hold the port: that board isn't
    // ours, so start our own on the next free port instead of reusing it.
    return body && body.board === true && body.root === ROOT
  } catch {
    return false
  }
}

function listen(port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      handle(req, res, port).catch((err) => {
        const status = err instanceof HttpError ? err.status : 500
        if (!(err instanceof HttpError)) console.error(err)
        if (!res.headersSent) send(res, status, { error: err.message })
        else res.end()
      })
    })
    server.once("error", reject)
    server.listen(port, "127.0.0.1", () => resolve(server))
  })
}

for (let port = FIRST_PORT; port < FIRST_PORT + 10; port++) {
  if (await isOurServer(port)) {
    console.log(`Board server already running: http://localhost:${port}`)
    process.exit(0)
  }
  try {
    await listen(port)
    fs.writeFileSync(STATE_FILE, JSON.stringify({ port, pid: process.pid, root: ROOT }) + "\n")
    const cleanup = () => {
      try {
        const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"))
        if (state.pid === process.pid) fs.rmSync(STATE_FILE, { force: true })
      } catch {}
      process.exit(0)
    }
    process.on("SIGINT", cleanup)
    process.on("SIGTERM", cleanup)
    console.log(`Board: http://localhost:${port}`)
    break
  } catch (err) {
    if (err.code !== "EADDRINUSE") throw err
    if (port === FIRST_PORT + 9) {
      console.error(`Ports ${FIRST_PORT}-${port} are all taken. Try: pnpm board --port 5000`)
      process.exit(1)
    }
  }
}
