import { p as theme } from "./globals-Bv4ZcVWM.js";
import "./paths-BfR2LXbA.js";
import { d as defaultRuntime } from "./subsystem-B4CcvtwB.js";
import "./boolean-DTgd5CzD.js";
import { K as writeConfigFile, z as createConfigIO } from "./auth-profiles-Ok_29lfs.js";
import { E as ensureAgentWorkspace, _ as DEFAULT_AGENT_WORKSPACE_DIR } from "./agent-scope-Ct4K9XNr.js";
import { x as shortenHomePath } from "./utils-C5WN6czr.js";
import "./openclaw-root-BD5PlMF6.js";
import "./logger-DK5MgyI_.js";
import "./exec-Ma6oRU03.js";
import "./github-copilot-token-V8sGXzUU.js";
import "./host-env-security-BqjSpt13.js";
import "./version-CWAlVg1Z.js";
import "./registry-COiI4eXe.js";
import "./manifest-registry-CDX-Vxgs.js";
import "./dock-D5Ul7srh.js";
import "./accounts-Cs7lRJ22.js";
import "./plugins-DH0nf2wM.js";
import "./logging-DYOk_rR3.js";
import "./accounts-C5aOTkts.js";
import "./message-channel-DwOOiHnr.js";
import "./tailnet-CxYaUoxP.js";
import "./ws-BzjlD7jY.js";
import "./redact-BPv8nenp.js";
import "./errors-Bxy1kFT-.js";
import "./sessions-CkpVe03D.js";
import "./accounts-BER1yztz.js";
import { o as resolveSessionTranscriptsDir } from "./paths-E64m60XY.js";
import "./chat-envelope-CH5bYP5u.js";
import "./client-BFxmeDqQ.js";
import "./call-DVkWjKJC.js";
import "./pairing-token-B_ihwlFf.js";
import "./onboard-helpers-0WTf7rCZ.js";
import "./prompt-style-DMpJWKki.js";
import { t as formatDocsLink } from "./links-BhWccyz9.js";
import { n as runCommandWithRuntime } from "./cli-utils-CZIibHLA.js";
import "./progress-iK4ygO8h.js";
import { t as hasExplicitOptions } from "./command-options-BMU9FBQI.js";
import "./note-C3x48sve.js";
import "./clack-prompter-CPKGQ_7X.js";
import "./runtime-guard-CfwwbQAP.js";
import "./onboarding.secret-input-8hI6dJpv.js";
import "./onboarding-CqZbYFPH.js";
import { n as logConfigUpdated, t as formatConfigPath } from "./logging-CQxJ5H3_.js";
import { t as onboardCommand } from "./onboard-CMAbYUrU.js";
import JSON5 from "json5";
import fs from "node:fs/promises";
//#region src/commands/setup.ts
async function readConfigFileRaw(configPath) {
	try {
		const raw = await fs.readFile(configPath, "utf-8");
		const parsed = JSON5.parse(raw);
		if (parsed && typeof parsed === "object") return {
			exists: true,
			parsed
		};
		return {
			exists: true,
			parsed: {}
		};
	} catch {
		return {
			exists: false,
			parsed: {}
		};
	}
}
async function setupCommand(opts, runtime = defaultRuntime) {
	const desiredWorkspace = typeof opts?.workspace === "string" && opts.workspace.trim() ? opts.workspace.trim() : void 0;
	const configPath = createConfigIO().configPath;
	const existingRaw = await readConfigFileRaw(configPath);
	const cfg = existingRaw.parsed;
	const defaults = cfg.agents?.defaults ?? {};
	const workspace = desiredWorkspace ?? defaults.workspace ?? DEFAULT_AGENT_WORKSPACE_DIR;
	const next = {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...defaults,
				workspace
			}
		}
	};
	if (!existingRaw.exists || defaults.workspace !== workspace) {
		await writeConfigFile(next);
		if (!existingRaw.exists) runtime.log(`Wrote ${formatConfigPath(configPath)}`);
		else logConfigUpdated(runtime, {
			path: configPath,
			suffix: "(set agents.defaults.workspace)"
		});
	} else runtime.log(`Config OK: ${formatConfigPath(configPath)}`);
	const ws = await ensureAgentWorkspace({
		dir: workspace,
		ensureBootstrapFiles: !next.agents?.defaults?.skipBootstrap
	});
	runtime.log(`Workspace OK: ${shortenHomePath(ws.dir)}`);
	const sessionsDir = resolveSessionTranscriptsDir();
	await fs.mkdir(sessionsDir, { recursive: true });
	runtime.log(`Sessions OK: ${shortenHomePath(sessionsDir)}`);
}
//#endregion
//#region src/cli/program/register.setup.ts
function registerSetupCommand(program) {
	program.command("setup").description("Initialize ~/.openclaw/openclaw.json and the agent workspace").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/setup", "docs.openclaw.ai/cli/setup")}\n`).option("--workspace <dir>", "Agent workspace directory (default: ~/.openclaw/workspace; stored as agents.defaults.workspace)").option("--wizard", "Run the interactive onboarding wizard", false).option("--non-interactive", "Run the wizard without prompts", false).option("--mode <mode>", "Wizard mode: local|remote").option("--remote-url <url>", "Remote Gateway WebSocket URL").option("--remote-token <token>", "Remote Gateway token (optional)").action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const hasWizardFlags = hasExplicitOptions(command, [
				"wizard",
				"nonInteractive",
				"mode",
				"remoteUrl",
				"remoteToken"
			]);
			if (opts.wizard || hasWizardFlags) {
				await onboardCommand({
					workspace: opts.workspace,
					nonInteractive: Boolean(opts.nonInteractive),
					mode: opts.mode,
					remoteUrl: opts.remoteUrl,
					remoteToken: opts.remoteToken
				}, defaultRuntime);
				return;
			}
			await setupCommand({ workspace: opts.workspace }, defaultRuntime);
		});
	});
}
//#endregion
export { registerSetupCommand };
