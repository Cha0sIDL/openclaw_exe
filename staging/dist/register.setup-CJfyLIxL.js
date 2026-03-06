import "./paths-BBP4yd-2.js";
import { p as theme } from "./globals-DyWRcjQY.js";
import { S as shortenHomePath } from "./utils-xFiJOAuL.js";
import { E as ensureAgentWorkspace, _ as DEFAULT_AGENT_WORKSPACE_DIR } from "./agent-scope-Ckfy1eLE.js";
import { d as defaultRuntime } from "./subsystem-D5pRlZe-.js";
import "./openclaw-root-DeEQQJyX.js";
import "./logger-DHGbafYr.js";
import "./exec-XzljJcHM.js";
import { Qt as createConfigIO, an as writeConfigFile } from "./model-selection-D6yIS4i6.js";
import "./registry-D9k2JaF8.js";
import "./github-copilot-token-b6kJVrW-.js";
import "./boolean-BsqeuxE6.js";
import "./env-BCNBCy-T.js";
import "./manifest-registry-CfBuZDUD.js";
import "./dock-y4QSCOQM.js";
import "./message-channel-FOEqd4n-.js";
import "./plugins-DmEd4pqG.js";
import "./sessions-Dt8vnmQq.js";
import "./tailnet-XGVl9sUv.js";
import "./ws-hC2980ir.js";
import "./redact-C5yfNdVB.js";
import "./errors-kKUPais3.js";
import "./accounts-Gk6U_wCL.js";
import "./accounts-DAImktI2.js";
import "./logging-B-Ool4n-.js";
import "./accounts-V_js5_KL.js";
import { o as resolveSessionTranscriptsDir } from "./paths-C_Kd9gsY.js";
import "./chat-envelope-BBn0ocB6.js";
import "./client-Ca8oW9ow.js";
import "./call-CXalT0Oq.js";
import "./pairing-token-DW-Qfpqh.js";
import "./onboard-helpers-KqKFzq9h.js";
import "./prompt-style-DRL6JbLb.js";
import { t as formatDocsLink } from "./links-CYThhxFD.js";
import { n as runCommandWithRuntime } from "./cli-utils-CwhfeUyk.js";
import "./progress-DJwvk8T-.js";
import "./runtime-guard-DXXPNQIx.js";
import { t as hasExplicitOptions } from "./command-options-DgcCGXMQ.js";
import "./note-BcRMnc8F.js";
import "./clack-prompter-HncP7fC-.js";
import "./onboarding.secret-input-DquQf28v.js";
import "./onboarding-BdbH3aIl.js";
import { n as logConfigUpdated, t as formatConfigPath } from "./logging-C9DZ91kl.js";
import { t as onboardCommand } from "./onboard-Od4SJxt9.js";
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