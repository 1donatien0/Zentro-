import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const VALIDATE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "scripts", "validate.mjs");

const WORKFLOW = `name: CI
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: "Run tests"
        run: |
          echo "it's fine: quotes in a block scalar are free text"
          npm test
`;

const ISSUE_FORM = `name: Bug report
description: Something isn't working
body:
  - type: textarea
    attributes:
      label: 'What happened?'
`;

// A PATH holding only node, so the script runs the way it would without Ruby.
function nodeOnlyPath() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "zentro-bin-"));
  fs.symlinkSync(process.execPath, path.join(dir, "node"));
  return dir;
}

function runValidate(files, { withRuby = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "zentro-validate-"));
  for (const [rel, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), content);
  }
  const env = { ...process.env };
  const binDir = withRuby ? null : nodeOnlyPath();
  if (binDir) env.PATH = binDir;
  try {
    const result = spawnSync(process.execPath, [VALIDATE], { cwd: root, env, encoding: "utf8" });
    return { status: result.status, output: `${result.stdout}${result.stderr}` };
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    if (binDir) fs.rmSync(binDir, { recursive: true, force: true });
  }
}

const rubyInstalled = spawnSync("ruby", ["-v"]).error === undefined;

test("validate: passes without ruby on PATH and says full YAML parsing was skipped", () => {
  const { status, output } = runValidate({
    ".github/workflows/ci.yml": WORKFLOW,
    ".github/ISSUE_TEMPLATE/bug.yml": ISSUE_FORM,
    ".github/ISSUE_TEMPLATE/config.yml": "blank_issues_enabled: false\n",
  });
  assert.equal(status, 0, output);
  assert.match(output, /Validation passed cleanly/);
  assert.match(output, /WARN: ruby not found on PATH/);
  assert.doesNotMatch(output, /ENOENT/);
});

test("validate: without ruby, basic YAML mistakes still exit 1", () => {
  const cases = [
    ["tab indentation", WORKFLOW.replace("  push:", "\tpush:"), /line 3: tab character used for indentation/],
    ["empty file", "# only a comment\n\n", /file is empty/],
    ["unclosed double quote", WORKFLOW.replace('"Run tests"', '"Run tests'), /unclosed double-quoted string/],
    ["unclosed single quote", ISSUE_FORM.replace("'What happened?'", "'What happened?"), /unclosed single-quoted string/],
    ["unbalanced brackets", WORKFLOW.replace("[main]", "[main"), /unbalanced brackets/],
    ["stray top-level line", `${ISSUE_FORM}oops\n`, /top-level line is not a "key: value" entry/],
  ];
  for (const [name, content, expected] of cases) {
    const file = name === "unclosed single quote" ? ".github/ISSUE_TEMPLATE/bug.yml" : ".github/workflows/ci.yml";
    const { status, output } = runValidate({ [file]: content });
    assert.equal(status, 1, `${name}: ${output}`);
    assert.match(output, expected, name);
  }
});

test("validate: without ruby, missing required workflow and issue form keys exit 1", () => {
  const { status, output } = runValidate({
    ".github/workflows/ci.yml": "name: CI\non: push\n",
    ".github/ISSUE_TEMPLATE/bug.yml": "name: Bug report\nbody: []\n",
  });
  assert.equal(status, 1, output);
  assert.match(output, /ci\.yml: missing required top-level key "jobs"/);
  assert.match(output, /bug\.yml: missing required top-level key "description"/);
});

test("validate: with ruby, YAML the basic checks miss still fails the full parse", { skip: !rubyInstalled && "ruby is not installed" }, () => {
  const { status, output } = runValidate(
    { ".github/workflows/ci.yml": `${WORKFLOW}extra: a: b\n` },
    { withRuby: true }
  );
  assert.equal(status, 1, output);
  assert.match(output, /Invalid YAML in \.github\/workflows\/ci\.yml/);
  assert.doesNotMatch(output, /ruby not found/);
});
