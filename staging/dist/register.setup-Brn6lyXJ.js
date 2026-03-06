import { p as theme } from "./globals-d3aR1MYC.js";
import "./paths-BMo6kTge.js";
import { d as defaultRuntime } from "./subsystem-Cfn2Pryx.js";
import "./boolean-DtWR5bt3.js";
import { G as writeConfigFile, R as createConfigIO } from "./auth-profiles-tPxLL4Q6.js";
import { E as ensureAgentWorkspace, _ as DEFAULT_AGENT_WORKSPACE_DIR } from "./agent-scope-BGsA4zEf.js";
import { x as shortenHomePath } from "./utils-cwpAMi-t.js";
import "./openclaw-root-BU3lu8pM.js";
import "./logger-DB-PHqB2.js";
import "./exec-B45rafWZ.js";
import "./registry-p3miLKfM.js";
import "./github-copilot-token-Byc_YVYE.js";
import "./manifest-registry-Dmh8Lc7n.js";
import "./version-DdJhsIqk.js";
import "./dock-TO1HzU4S.js";
import "./message-channel-BH8TVME5.js";
import "./sessions-0JfTMYG-.js";
import "./plugins-hyZRvFwO.js";
import "./accounts-5eLsrtsT.js";
import "./accounts-qTCkeVoU.js";
import "./logging-BvdokaVt.js";
import "./accounts-C9pjEZ6g.js";
import { o as resolveSessionTranscriptsDir } from "./paths-cmEiiwMK.js";
import "./chat-envelope-n7RmUTHV.js";
import "./client-CzImpHGe.js";
import "./call-MMA9uqcd.js";
import "./pairing-token-h5vg0oaO.js";
import "./net-0Fapzizl.js";
import "./tailnet-cWmPZlFU.js";
import "./redact-LmGH4yE3.js";
import "./errors-s25Xfb--.js";
import "./onboard-helpers-Cl_losjk.js";
import "./prompt-style-By2UMb-r.js";
import { t as formatDocsLink } from "./links-ILDVAiqt.js";
import { n as runCommandWithRuntime } from "./cli-utils-CzIyxbam.js";
import "./progress-5B42_wGt.js";
import { t as hasExplicitOptions } from "./command-options-j8s8APBQ.js";
import "./note-DrV9F1n8.js";
import "./clack-prompter-QUMfxj2-.js";
import "./runtime-guard-BMUPc-7K.js";
import "./onboarding.secret-input-izFJWWcE.js";
import "./onboarding-CFZiX9Li.js";
import { n as logConfigUpdated, t as formatConfigPath } from "./logging-BqngIj6t.js";
import { t as onboardCommand } from "./onboard-Dq2GOK6H.js";
import JSON5 from "json5";
import fsPromises from "node:fs/promises";

//#region src/commands/setup.ts
async function readConfigFileRaw(configPath) {
	try {
		const raw = await fsPromises.readFile(configPath, "utf-8");
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
	await fsPromises.mkdir(sessionsDir, { recursive: true });
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