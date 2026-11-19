// Runs `smartypants job` for the Smarty Pants GitHub step (goal 58) and turns its result into
// step outputs and a step summary. Inputs arrive in IN_* environment variables, never through a shell.
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/** The `smartypants` arguments for these inputs. */
export function jobArgs(e) {
  const args = ["job"];
  const add = (flag, value) => { if (value !== undefined && value !== "") args.push(`--${flag}`, value); };
  if (e.IN_REPO) add("repo", e.IN_REPO);
  else if (e.IN_FROM) add("from", e.IN_FROM);
  else add("dir", e.IN_DIR || ".");
  add("setup", e.IN_SETUP); add("task", e.IN_TASK); add("test", e.IN_TEST); add("collect", e.IN_COLLECT);
  add("model", e.IN_MODEL); add("budget", e.IN_BUDGET); add("minutes", e.IN_MINUTES); add("retries", e.IN_RETRIES); add("wait", e.IN_WAIT);
  return args;
}

/** How to start the tool: a local bin file, or the npm package through npx. */
export function command(cli) {
  const spec = cli || "smartypants-network@latest";
  return /\.(m?js)$/.test(spec) ? [process.execPath, [spec]] : ["npx", ["-y", "-p", spec, "smartypants"]];
}

/** The step summary, as Markdown. */
export function summary(r) {
  const cost = r.chargeMicros === null || r.chargeMicros === undefined ? "?" : (r.chargeMicros / 1e6).toFixed(6);
  const rows = r.steps.map((s) => `| ${s.name}${s.lost ? " (Mac lost)" : ""} | ${s.exitCode ?? "none"} | ${s.seconds} s |`).join("\n");
  const models = r.inferenceUsage?.spentMicros ? ` + models $${(r.inferenceUsage.spentMicros / 1e6).toFixed(6)}` : "";
  const files = r.files?.names?.length ? `\nFiles brought back: ${r.files.names.slice(0, 20).map((n) => `\`${n}\``).join(", ")}\n` : "";
  return `### Smarty Pants job: ${r.passed ? "passed" : `failed at ${r.failedStep}`}\n\n`
    + `| Step | Exit code | Time |\n|---|---|---|\n${rows}\n\n`
    + `${r.seconds} s in all, cost $${cost}${models}${r.retries ? `, picked up on another Mac ${r.retries} time(s)` : ""}. Workspace \`${r.workspaceId}\`.\n${files}`;
}

function main(env) {
  if (!env.SMARTYPANTS_API_KEY) { console.error("api-key is empty: add a SMARTYPANTS_API_KEY repository secret"); return 2; }
  console.log(`::add-mask::${env.SMARTYPANTS_API_KEY}`);
  const output = (k, v) => env.GITHUB_OUTPUT && appendFileSync(env.GITHUB_OUTPUT, `${k}=${String(v).replace(/\n/g, " ")}\n`);
  const out = mkdtempSync(join(env.RUNNER_TEMP || tmpdir(), "smartypants-job-"));
  const [cmd, pre] = command(env.IN_CLI);
  const run = spawnSync(cmd, [...pre, ...jobArgs(env), "--out", out], { stdio: "inherit", env: { ...env, SMARTYPANTS_JOB_SOURCE: "github" } });
  const file = join(out, "result.json");
  if (!existsSync(file)) {
    output("passed", "false"); output("out", "");
    console.error("the job did not finish (no result.json); see the log above");
    return run.status || 1;
  }
  const r = JSON.parse(readFileSync(file, "utf8"));
  output("passed", r.passed); output("failed_step", r.failedStep ?? ""); output("workspace", r.workspaceId); output("out", out);
  output("cost_usd", r.chargeMicros === null || r.chargeMicros === undefined ? "" : (r.chargeMicros / 1e6).toFixed(6));
  if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, summary(r));
  return r.passed ? 0 : (run.status || 1);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) process.exit(main(process.env));
