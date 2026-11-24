import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function listTrackedFiles() {
  try {
    const out = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" });
    return out.split(/\r?\n/).filter(Boolean);
  } catch {
    return walkDir(ROOT);
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(full));
    } else {
      files.push(path.relative(ROOT, full));
    }
  }
  return files;
}

function validateJsFiles(files) {
  const jsFiles = files.filter((f) => f.endsWith(".js") || f.endsWith(".mjs"));
  for (const file of jsFiles) {
    try {
      execFileSync(process.execPath, ["--check", path.join(ROOT, file)], {
        stdio: "pipe",
        encoding: "utf8",
      });
    } catch (err) {
      fail(`JS syntax error in ${file}: ${err.stderr || err.message}`);
    }
  }

  const htmlFiles = files.filter((f) => f.endsWith(".html"));
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(ROOT, file), "utf8");
    const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
    let match;
    let index = 0;
    while ((match = scriptRegex.exec(html)) !== null) {
      index += 1;
      const body = match[1].trim();
      if (!body) continue;
      try {
        new vm.Script(body, { filename: `${file}#script-${index}` });
      } catch (err) {
        fail(`Inline JS syntax error in ${file} block #${index}: ${err.message}`);
      }
    }
  }
}

function checkBalancedBraces(cssText, label) {
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inComment = false;

  for (let i = 0; i < cssText.length; i++) {
    const ch = cssText[i];
    const next = cssText[i + 1];

    if (inComment) {
      if (ch === "*" && next === "/") {
        inComment = false;
        i += 1;
      }
      continue;
    }

    if (!inSingle && !inDouble && ch === "/" && next === "*") {
      inComment = true;
      i += 1;
      continue;
    }

    if (!inDouble && ch === "'" && cssText[i - 1] !== "\\") {
      inSingle = !inSingle;
      continue;
    }
    if (!inSingle && ch === '"' && cssText[i - 1] !== "\\") {
      inDouble = !inDouble;
      continue;
    }

    if (inSingle || inDouble) continue;

    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth < 0) {
        fail(`Unexpected closing brace '}' in ${label}`);
        return;
      }
    }
  }

  if (inComment) fail(`Unclosed CSS comment in ${label}`);
  if (inSingle || inDouble) fail(`Unclosed CSS string literal in ${label}`);
  if (depth !== 0) fail(`Unbalanced CSS braces (depth=${depth}) in ${label}`);
}

function checkLocalUrl(rawUrl, sourceFile) {
  const cleaned = rawUrl.trim().replace(/^['"]|['"]$/g, "");
  if (
    !cleaned ||
    cleaned.startsWith("http://") ||
    cleaned.startsWith("https://") ||
    cleaned.startsWith("data:") ||
    cleaned.startsWith("mailto:") ||
    cleaned.startsWith("#") ||
    cleaned.startsWith("javascript:")
  ) {
    return;
  }
  const target = cleaned.split("#")[0].split("?")[0];
  if (!target) return;
  const resolved = path.resolve(ROOT, path.dirname(sourceFile), target);
  if (!fs.existsSync(resolved)) {
    fail(`Missing local asset/link target "${cleaned}" referenced in ${sourceFile}`);
  }
}

function validateHtmlAndCss(files) {
  const htmlFiles = files.filter((f) => f.endsWith(".html"));
  const scriptJs = fs.existsSync(path.join(ROOT, "script.js"))
    ? fs.readFileSync(path.join(ROOT, "script.js"), "utf8")
    : "";

  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(ROOT, file), "utf8");

    if (!/<!DOCTYPE\s+html>/i.test(html)) {
      fail(`Missing <!DOCTYPE html> declaration in ${file}`);
    }
    for (const tag of ["<html", "</html>", "<head", "</head>", "<body", "</body>"]) {
      if (!html.toLowerCase().includes(tag)) {
        fail(`Missing structural tag ${tag} in ${file}`);
      }
    }

    const ids = [];
    const seen = new Set();
    const idRegex = /\bid=["']([^"']+)["']/g;
    let m;
    while ((m = idRegex.exec(html)) !== null) {
      if (seen.has(m[1])) {
        fail(`Duplicate id="${m[1]}" in ${file}`);
      }
      seen.add(m[1]);
      ids.push(m[1]);
    }

    const attrRegex = /\b(?:src|href)=["']([^"']+)["']/g;
    while ((m = attrRegex.exec(html)) !== null) {
      checkLocalUrl(m[1], file);
    }

    const styleRegex = /<style(?:\s+[^>]*)?>([\s\S]*?)<\/style>/gi;
    let styleIdx = 0;
    while ((m = styleRegex.exec(html)) !== null) {
      styleIdx += 1;
      checkBalancedBraces(m[1], `${file}#style-${styleIdx}`);
      const urlRegex = /url\(([^)]+)\)/gi;
      let u;
      while ((u = urlRegex.exec(m[1])) !== null) {
        checkLocalUrl(u[1], file);
      }
    }

    const combinedScripts =
      html + (html.includes('src="script.js"') || html.includes("src='script.js'") ? `\n${scriptJs}` : "");
    const getByIdRegex = /getElementById\(\s*["']([^"']+)["']\s*\)/g;
    while ((m = getByIdRegex.exec(combinedScripts)) !== null) {
      if (!seen.has(m[1])) {
        fail(`getElementById("${m[1]}") target missing in ${file}`);
      }
    }
  }

  for (const cssFile of files.filter((f) => f.endsWith(".css"))) {
    const css = fs.readFileSync(path.join(ROOT, cssFile), "utf8");
    checkBalancedBraces(css, cssFile);
    const urlRegex = /url\(([^)]+)\)/gi;
    let u;
    while ((u = urlRegex.exec(css)) !== null) {
      checkLocalUrl(u[1], cssFile);
    }
  }
}

// Basic YAML checks in plain Node, so `npm run validate` works without Ruby.
// They catch the common mistakes (tabs, unclosed quotes/brackets, empty files,
// missing required keys); full parsing still happens below when Ruby exists.
function lintYamlText(text, file) {
  const problems = [];
  const lines = text.split(/\r?\n/);

  if (!lines.some((line) => line.trim() && !line.trim().startsWith("#"))) {
    problems.push("file is empty");
    return problems;
  }

  const topLevelKeys = new Set();
  let blockScalarIndent = null; // indentation of the line that opened a | or > block

  lines.forEach((line, i) => {
    const lineNo = i + 1;
    const indent = /^ */.exec(line)[0].length;

    // Lines inside a block scalar (`key: |`) are free text, not YAML structure.
    if (blockScalarIndent !== null) {
      if (!line.trim() || indent > blockScalarIndent) return;
      blockScalarIndent = null;
    }

    if (/^ *\t/.test(line)) {
      problems.push(`line ${lineNo}: tab character used for indentation`);
      return;
    }

    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || /^(---|\.\.\.)(\s|$)/.test(trimmed)) return;

    let rest = trimmed;
    while (/^-(\s|$)/.test(rest)) rest = rest.slice(1).trimStart();

    const keyMatch = /^("(?:[^"\\]|\\.)*"|'(?:[^']|'')*'|[^\s"'#\[{][^#]*?):(?:\s+|$)/.exec(rest);
    if (indent === 0 && !trimmed.startsWith("-")) {
      if (!keyMatch) {
        problems.push(`line ${lineNo}: top-level line is not a "key: value" entry`);
        return;
      }
      topLevelKeys.add(keyMatch[1].replace(/^["']|["']$/g, ""));
    }

    const value = keyMatch ? rest.slice(keyMatch[0].length) : rest;
    if (value.startsWith('"') && !/^"(?:[^"\\]|\\.)*"/.test(value)) {
      problems.push(`line ${lineNo}: unclosed double-quoted string`);
    } else if (value.startsWith("'") && !/^'(?:[^']|'')*'/.test(value)) {
      problems.push(`line ${lineNo}: unclosed single-quoted string`);
    } else if (value.startsWith("[") || value.startsWith("{")) {
      const unquoted = value.replace(/"(?:[^"\\]|\\.)*"|'(?:[^']|'')*'/g, "");
      const opens = (unquoted.match(/[[{]/g) || []).length;
      const closes = (unquoted.match(/[\]}]/g) || []).length;
      if (opens !== closes) problems.push(`line ${lineNo}: unbalanced brackets`);
    } else if (/^[|>][-+0-9]*\s*(#.*)?$/.test(value)) {
      blockScalarIndent = indent;
    }
  });

  const required = file.startsWith(".github/workflows/")
    ? ["on", "jobs"]
    : file.startsWith(".github/ISSUE_TEMPLATE/") && !/\/config\.ya?ml$/.test(file)
      ? ["name", "description", "body"]
      : [];
  for (const key of required) {
    if (!topLevelKeys.has(key)) problems.push(`missing required top-level key "${key}"`);
  }

  return problems;
}

function validateYamlFiles(files) {
  const yamlFiles = files.filter(
    (f) => f.startsWith(".github/") && (f.endsWith(".yml") || f.endsWith(".yaml"))
  );
  let rubyAvailable = true;
  for (const file of yamlFiles) {
    const text = fs.readFileSync(path.join(ROOT, file), "utf8");
    for (const problem of lintYamlText(text, file)) {
      fail(`Invalid YAML in ${file}: ${problem}`);
    }

    if (!rubyAvailable) continue;
    try {
      execFileSync(
        "ruby",
        ["-ryaml", "-e", "YAML.load_file(ARGV[0])", path.join(ROOT, file)],
        { stdio: "pipe", encoding: "utf8" }
      );
    } catch (err) {
      if (err.code === "ENOENT") {
        rubyAvailable = false;
        warn("ruby not found on PATH; .github/ YAML got the basic Node checks only (full YAML parsing skipped).");
        continue;
      }
      fail(`Invalid YAML in ${file}: ${err.stderr || err.message}`);
    }
  }
}

function extractHeadingSlugs(markdownText) {
  const slugs = new Set();
  const lines = markdownText.split(/\r?\n/);
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^#{1,6}\s+(.+)$/.exec(line);
    if (!m) continue;
    const slug = m[1]
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-");
    if (slug) slugs.add(slug);
  }
  return slugs;
}

function validateMarkdown(files) {
  const mdFiles = files.filter((f) => f.endsWith(".md"));
  const slugCache = new Map();
  const getSlugs = (relPath) => {
    if (!slugCache.has(relPath)) {
      const content = fs.readFileSync(path.join(ROOT, relPath), "utf8");
      slugCache.set(relPath, extractHeadingSlugs(content));
    }
    return slugCache.get(relPath);
  };

  for (const file of mdFiles) {
    const txt = fs.readFileSync(path.join(ROOT, file), "utf8");
    const linkRegex = /!?\[[^\]]*\]\(([^)]+)\)/g;
    let m;
    while ((m = linkRegex.exec(txt)) !== null) {
      const raw = m[1].trim();
      if (
        !raw ||
        raw.startsWith("http://") ||
        raw.startsWith("https://") ||
        raw.startsWith("mailto:")
      ) {
        continue;
      }
      if (raw.startsWith("#")) {
        const anchor = raw.slice(1);
        if (!getSlugs(file).has(anchor)) {
          fail(`Broken internal anchor "${raw}" in ${file}`);
        }
        continue;
      }
      const [targetPath, anchor] = raw.split("#");
      const resolved = path.resolve(ROOT, path.dirname(file), targetPath);
      if (!fs.existsSync(resolved)) {
        fail(`Broken relative Markdown link "${raw}" in ${file}`);
        continue;
      }
      if (anchor && targetPath.endsWith(".md")) {
        const relTarget = path.relative(ROOT, resolved);
        if (!getSlugs(relTarget).has(anchor)) {
          fail(`Broken heading anchor "${raw}" in ${file} (target: ${relTarget})`);
        }
      }
    }
  }
}

function validateHygiene(files) {
  const forbiddenNames = [/^\.env($|\.)/i, /\.(pem|key|p12|pfx)$/i, /^id_rsa/i];
  const secretPatterns = [
    /AKIA[0-9A-Z]{16}/,
    /AIza[0-9A-Za-z_-]{35}/,
    /ghp_[A-Za-z0-9]{36}/,
    /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/,
  ];

  for (const file of files) {
    const base = path.basename(file);
    if (base !== ".env.example" && forbiddenNames.some((rx) => rx.test(base))) {
      fail(`Forbidden sensitive file tracked: ${file}`);
    }

    if (/\.(png|jpe?g|avif|gif|webp|ico)$/i.test(file)) continue;
    const content = fs.readFileSync(path.join(ROOT, file), "utf8");

    if (/^(<{7}|={7}|>{7})(?:\s|$)/m.test(content)) {
      fail(`Merge conflict marker found in ${file}`);
    }
    if (file !== "scripts/validate.mjs") {
      for (const rx of secretPatterns) {
        if (rx.test(content)) {
          fail(`Potential secret pattern (${rx}) detected in ${file}`);
        }
      }
    }
  }
}

const allFiles = [
  ...new Set([
    ...listTrackedFiles(),
    ...walkDir(ROOT).filter((f) => !/^\.DS_Store$|^(backgorund\.jpg|background\.avif|screenshot\.png)$/.test(f)),
  ]),
].sort();

validateJsFiles(allFiles);
validateHtmlAndCss(allFiles);
validateYamlFiles(allFiles);
validateMarkdown(allFiles);
validateHygiene(allFiles);

if (warnings.length > 0) {
  for (const w of warnings) console.warn(`WARN: ${w}`);
}

if (errors.length > 0) {
  for (const e of errors) console.error(`ERROR: ${e}`);
  console.error(`\nValidation failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`Validation passed cleanly across ${allFiles.length} repository files.`);
