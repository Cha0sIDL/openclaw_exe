import { F as getPrimaryCommand, I as getVerboseFlag, L as hasFlag, M as getCommandPositionalsWithRootOptions, N as getFlagValue, P as getPositiveIntFlagValue, R as hasHelpOrVersion, W as isValueToken, j as getCommandPathWithRootOptions } from "./globals-Bv4ZcVWM.js";
import "./paths-BfR2LXbA.js";
import { d as defaultRuntime, r as enableConsoleCapture } from "./subsystem-B4CcvtwB.js";
import "./boolean-DTgd5CzD.js";
import { a as normalizeEnv, c as parseCliProfileArgs, o as normalizeWindowsArgv, r as isTruthyEnvValue, s as applyCliProfileEnv } from "./entry.js";
import { Gn as loadDotEnv } from "./auth-profiles-Ok_29lfs.js";
import "./agent-scope-Ct4K9XNr.js";
import "./utils-C5WN6czr.js";
import "./openclaw-root-BD5PlMF6.js";
import "./logger-DK5MgyI_.js";
import "./exec-Ma6oRU03.js";
import "./github-copilot-token-V8sGXzUU.js";
import "./host-env-security-BqjSpt13.js";
import { t as VERSION } from "./version-CWAlVg1Z.js";
import "./registry-COiI4eXe.js";
import "./manifest-registry-CDX-Vxgs.js";
import "./dock-D5Ul7srh.js";
import "./tokens-BhADjYNF.js";
import "./compact-BjaPuUSI.js";
import "./accounts-Cs7lRJ22.js";
import "./plugins-DH0nf2wM.js";
import "./logging-DYOk_rR3.js";
import "./send-CHYrGJ-I.js";
import "./send-CpYAYWpc.js";
import "./with-timeout-Bd6CqutM.js";
import "./deliver-BCYVnhPK.js";
import "./diagnostic-SNxOWYSM.js";
import "./accounts-C5aOTkts.js";
import "./image-ops-CgkYbHWv.js";
import "./send-CK386y2p.js";
import "./pi-model-discovery-v4IEHC8Z.js";
import "./message-channel-DwOOiHnr.js";
import "./pi-embedded-helpers-CBRvxz6e.js";
import "./sandbox-B3ZfWqQX.js";
import "./tool-catalog-BipbxDxK.js";
import "./chrome-DtNznCNZ.js";
import "./tailscale-Ch9Mc7pc.js";
import "./tailnet-CxYaUoxP.js";
import "./ws-BzjlD7jY.js";
import "./auth-DPbW35vL.js";
import "./server-context-BGjLULS5.js";
import "./frontmatter-Hg10Mdyo.js";
import "./env-overrides-lQ9nfNgI.js";
import "./path-alias-guards-Dd9daA8Q.js";
import "./skills-UtzuOmV5.js";
import "./paths-BsQGrIJV.js";
import "./redact-BPv8nenp.js";
import { i as formatUncaughtError } from "./errors-Bxy1kFT-.js";
import "./fs-safe-DGIa4SNP.js";
import "./proxy-env-BQ8shHGR.js";
import "./store-CRz4WjkH.js";
import "./ports-fgKk6ALw.js";
import "./trash-qzaIKOIU.js";
import "./server-middleware-B1Hn5Uxq.js";
import "./sessions-CkpVe03D.js";
import "./accounts-BER1yztz.js";
import "./paths-E64m60XY.js";
import "./chat-envelope-CH5bYP5u.js";
import "./tool-images-1mCfmpMJ.js";
import "./thinking-B_wxfji0.js";
import "./models-config-B3eI7jzL.js";
import "./exec-approvals-allowlist-B0IMftwt.js";
import "./exec-safe-bin-runtime-policy-D8Ep09V5.js";
import "./model-catalog-H8j7NulN.js";
import "./fetch-sqY6FCRx.js";
import { h as installUnhandledRejectionHandler } from "./audio-transcription-runner-CQ9UFry3.js";
import "./fetch-guard-DrmhSLIg.js";
import "./image-DiopATC4.js";
import "./tool-display-IDeAbAnn.js";
import "./api-key-rotation-CYoJjZWj.js";
import "./proxy-fetch-B03VJLvi.js";
import "./ir-BpELxS6U.js";
import "./render-DW1ufaCx.js";
import "./target-errors-SNhw0r88.js";
import "./commands-BNyCzjzn.js";
import "./commands-registry-Q8iSE9Pt.js";
import "./session-cost-usage-CC6en8Ih.js";
import "./session-utils-8me_yrWv.js";
import "./sqlite-uJG4TSsp.js";
import "./client-BFxmeDqQ.js";
import "./call-DVkWjKJC.js";
import "./pairing-token-B_ihwlFf.js";
import "./fetch-BVBCAMkc.js";
import "./pairing-store-Dbq5DTRR.js";
import "./exec-approvals-CngqmPvY.js";
import "./nodes-screen-CM7n1Oxp.js";
import "./system-run-command-CkXujFqj.js";
import "./skill-commands-D9v_q1rE.js";
import "./pi-tools.policy-BIEFeQWi.js";
import "./workspace-dirs-DdEhuQjV.js";
import "./channel-activity-3j51L78e.js";
import "./tables-Duos7WfV.js";
import "./server-lifecycle-DSNhGySu.js";
import "./stagger-DErl3pTN.js";
import "./channel-selection-BecRU3f4.js";
import "./plugin-auto-enable-gQYJ9imj.js";
import "./send-CsB3e-Qc.js";
import "./outbound-attachment-DDhNRzXp.js";
import "./delivery-queue-CzFxbZH8.js";
import "./send-B61oUHf1.js";
import "./proxy-CRODgiWq.js";
import "./timeouts-DeXgc5B0.js";
import "./runtime-config-collectors-C7NEx3Ij.js";
import "./command-secret-targets-Hw0LPI1L.js";
import "./onboard-helpers-0WTf7rCZ.js";
import "./prompt-style-DMpJWKki.js";
import "./pairing-labels-DLeO9en5.js";
import "./memory-cli-f9_hnNTS.js";
import "./manager-P7P02HnV.js";
import "./links-BhWccyz9.js";
import "./cli-utils-CZIibHLA.js";
import "./help-format-CMYKW3HF.js";
import "./progress-iK4ygO8h.js";
import { t as ensureOpenClawCliOnPath } from "./path-env-DKITKILj.js";
import "./note-C3x48sve.js";
import "./issue-format-BngyB0_B.js";
import { t as ensurePluginRegistryLoaded } from "./plugin-registry-DNplR5Iu.js";
import { t as assertSupportedRuntime } from "./runtime-guard-CfwwbQAP.js";
import { t as emitCliBanner } from "./banner-iVEU_7jq.js";
import "./doctor-config-flow-BBFdKnm9.js";
import { n as ensureConfigReady } from "./config-guard-DwHVZVJ5.js";
import process$1 from "node:process";
import "node:url";
//#region src/cli/program/routes.ts
const routeHealth = {
	match: (path) => path[0] === "health",
	loadPlugins: (argv) => !hasFlag(argv, "--json"),
	run: async (argv) => {
		const json = hasFlag(argv, "--json");
		const verbose = getVerboseFlag(argv, { includeDebug: true });
		const timeoutMs = getPositiveIntFlagValue(argv, "--timeout");
		if (timeoutMs === null) return false;
		const { healthCommand } = await import("./health-CK72o5Yn.js").then((n) => n.i);
		await healthCommand({
			json,
			timeoutMs,
			verbose
		}, defaultRuntime);
		return true;
	}
};
const routeStatus = {
	match: (path) => path[0] === "status",
	loadPlugins: true,
	run: async (argv) => {
		const json = hasFlag(argv, "--json");
		const deep = hasFlag(argv, "--deep");
		const all = hasFlag(argv, "--all");
		const usage = hasFlag(argv, "--usage");
		const verbose = getVerboseFlag(argv, { includeDebug: true });
		const timeoutMs = getPositiveIntFlagValue(argv, "--timeout");
		if (timeoutMs === null) return false;
		const { statusCommand } = await import("./status-D4jqyvUz.js").then((n) => n.t);
		await statusCommand({
			json,
			deep,
			all,
			usage,
			timeoutMs,
			verbose
		}, defaultRuntime);
		return true;
	}
};
const routeSessions = {
	match: (path) => path[0] === "sessions" && !path[1],
	run: async (argv) => {
		const json = hasFlag(argv, "--json");
		const allAgents = hasFlag(argv, "--all-agents");
		const agent = getFlagValue(argv, "--agent");
		if (agent === null) return false;
		const store = getFlagValue(argv, "--store");
		if (store === null) return false;
		const active = getFlagValue(argv, "--active");
		if (active === null) return false;
		const { sessionsCommand } = await import("./sessions-CC5KSH9l.js").then((n) => n.n);
		await sessionsCommand({
			json,
			store,
			agent,
			allAgents,
			active
		}, defaultRuntime);
		return true;
	}
};
const routeAgentsList = {
	match: (path) => path[0] === "agents" && path[1] === "list",
	run: async (argv) => {
		const json = hasFlag(argv, "--json");
		const bindings = hasFlag(argv, "--bindings");
		const { agentsListCommand } = await import("./agents-BTcFiJy1.js").then((n) => n.t);
		await agentsListCommand({
			json,
			bindings
		}, defaultRuntime);
		return true;
	}
};
const routeMemoryStatus = {
	match: (path) => path[0] === "memory" && path[1] === "status",
	run: async (argv) => {
		const agent = getFlagValue(argv, "--agent");
		if (agent === null) return false;
		const json = hasFlag(argv, "--json");
		const deep = hasFlag(argv, "--deep");
		const index = hasFlag(argv, "--index");
		const verbose = hasFlag(argv, "--verbose");
		const { runMemoryStatus } = await import("./memory-cli-f9_hnNTS.js").then((n) => n.t);
		await runMemoryStatus({
			agent,
			json,
			deep,
			index,
			verbose
		});
		return true;
	}
};
function getFlagValues(argv, name) {
	const values = [];
	const args = argv.slice(2);
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (!arg || arg === "--") break;
		if (arg === name) {
			const next = args[i + 1];
			if (!isValueToken(next)) return null;
			values.push(next);
			i += 1;
			continue;
		}
		if (arg.startsWith(`${name}=`)) {
			const value = arg.slice(name.length + 1).trim();
			if (!value) return null;
			values.push(value);
		}
	}
	return values;
}
const routes = [
	routeHealth,
	routeStatus,
	routeSessions,
	routeAgentsList,
	routeMemoryStatus,
	{
		match: (path) => path[0] === "config" && path[1] === "get",
		run: async (argv) => {
			const positionals = getCommandPositionalsWithRootOptions(argv, {
				commandPath: ["config", "get"],
				booleanFlags: ["--json"]
			});
			if (!positionals || positionals.length !== 1) return false;
			const pathArg = positionals[0];
			if (!pathArg) return false;
			const json = hasFlag(argv, "--json");
			const { runConfigGet } = await import("./config-cli-CV-g4tNP.js");
			await runConfigGet({
				path: pathArg,
				json
			});
			return true;
		}
	},
	{
		match: (path) => path[0] === "config" && path[1] === "unset",
		run: async (argv) => {
			const positionals = getCommandPositionalsWithRootOptions(argv, { commandPath: ["config", "unset"] });
			if (!positionals || positionals.length !== 1) return false;
			const pathArg = positionals[0];
			if (!pathArg) return false;
			const { runConfigUnset } = await import("./config-cli-CV-g4tNP.js");
			await runConfigUnset({ path: pathArg });
			return true;
		}
	},
	{
		match: (path) => path[0] === "models" && path[1] === "list",
		run: async (argv) => {
			const provider = getFlagValue(argv, "--provider");
			if (provider === null) return false;
			const all = hasFlag(argv, "--all");
			const local = hasFlag(argv, "--local");
			const json = hasFlag(argv, "--json");
			const plain = hasFlag(argv, "--plain");
			const { modelsListCommand } = await import("./models-Bdn2Ydgp.js").then((n) => n.t);
			await modelsListCommand({
				all,
				local,
				provider,
				json,
				plain
			}, defaultRuntime);
			return true;
		}
	},
	{
		match: (path) => path[0] === "models" && path[1] === "status",
		run: async (argv) => {
			const probeProvider = getFlagValue(argv, "--probe-provider");
			if (probeProvider === null) return false;
			const probeTimeout = getFlagValue(argv, "--probe-timeout");
			if (probeTimeout === null) return false;
			const probeConcurrency = getFlagValue(argv, "--probe-concurrency");
			if (probeConcurrency === null) return false;
			const probeMaxTokens = getFlagValue(argv, "--probe-max-tokens");
			if (probeMaxTokens === null) return false;
			const agent = getFlagValue(argv, "--agent");
			if (agent === null) return false;
			const probeProfileValues = getFlagValues(argv, "--probe-profile");
			if (probeProfileValues === null) return false;
			const probeProfile = probeProfileValues.length === 0 ? void 0 : probeProfileValues.length === 1 ? probeProfileValues[0] : probeProfileValues;
			const json = hasFlag(argv, "--json");
			const plain = hasFlag(argv, "--plain");
			const check = hasFlag(argv, "--check");
			const probe = hasFlag(argv, "--probe");
			const { modelsStatusCommand } = await import("./models-Bdn2Ydgp.js").then((n) => n.t);
			await modelsStatusCommand({
				json,
				plain,
				check,
				probe,
				probeProvider,
				probeProfile,
				probeTimeout,
				probeConcurrency,
				probeMaxTokens,
				agent
			}, defaultRuntime);
			return true;
		}
	}
];
function findRoutedCommand(path) {
	for (const route of routes) if (route.match(path)) return route;
	return null;
}
//#endregion
//#region src/cli/route.ts
async function prepareRoutedCommand(params) {
	const suppressDoctorStdout = hasFlag(params.argv, "--json");
	emitCliBanner(VERSION, { argv: params.argv });
	await ensureConfigReady({
		runtime: defaultRuntime,
		commandPath: params.commandPath,
		...suppressDoctorStdout ? { suppressDoctorStdout: true } : {}
	});
	if (typeof params.loadPlugins === "function" ? params.loadPlugins(params.argv) : params.loadPlugins) ensurePluginRegistryLoaded();
}
async function tryRouteCli(argv) {
	if (isTruthyEnvValue(process.env.OPENCLAW_DISABLE_ROUTE_FIRST)) return false;
	if (hasHelpOrVersion(argv)) return false;
	const path = getCommandPathWithRootOptions(argv, 2);
	if (!path[0]) return false;
	const route = findRoutedCommand(path);
	if (!route) return false;
	await prepareRoutedCommand({
		argv,
		commandPath: path,
		loadPlugins: route.loadPlugins
	});
	return route.run(argv);
}
//#endregion
//#region src/cli/run-main.ts
function rewriteUpdateFlagArgv(argv) {
	const index = argv.indexOf("--update");
	if (index === -1) return argv;
	const next = [...argv];
	next.splice(index, 1, "update");
	return next;
}
function shouldSkipPluginCommandRegistration(params) {
	if (params.hasBuiltinPrimary) return true;
	if (!params.primary) return hasHelpOrVersion(params.argv);
	return false;
}
function shouldEnsureCliPath(argv) {
	if (hasHelpOrVersion(argv)) return false;
	const [primary, secondary] = getCommandPathWithRootOptions(argv, 2);
	if (!primary) return true;
	if (primary === "status" || primary === "health" || primary === "sessions") return false;
	if (primary === "config" && (secondary === "get" || secondary === "unset")) return false;
	if (primary === "models" && (secondary === "list" || secondary === "status")) return false;
	return true;
}
async function runCli(argv = process$1.argv) {
	let normalizedArgv = normalizeWindowsArgv(argv);
	const parsedProfile = parseCliProfileArgs(normalizedArgv);
	if (!parsedProfile.ok) throw new Error(parsedProfile.error);
	if (parsedProfile.profile) applyCliProfileEnv({ profile: parsedProfile.profile });
	normalizedArgv = parsedProfile.argv;
	loadDotEnv({ quiet: true });
	normalizeEnv();
	if (shouldEnsureCliPath(normalizedArgv)) ensureOpenClawCliOnPath();
	assertSupportedRuntime();
	if (await tryRouteCli(normalizedArgv)) return;
	enableConsoleCapture();
	const { buildProgram } = await import("./program-mbhvq0nl.js");
	const program = buildProgram();
	installUnhandledRejectionHandler();
	process$1.on("uncaughtException", (error) => {
		console.error("[openclaw] Uncaught exception:", formatUncaughtError(error));
		process$1.exit(1);
	});
	const parseArgv = rewriteUpdateFlagArgv(normalizedArgv);
	const primary = getPrimaryCommand(parseArgv);
	if (primary) {
		const { getProgramContext } = await import("./program-context-SGe7HGlK.js").then((n) => n.n);
		const ctx = getProgramContext(program);
		if (ctx) {
			const { registerCoreCliByName } = await import("./command-registry-BZC2YfLh.js").then((n) => n.t);
			await registerCoreCliByName(program, ctx, primary, parseArgv);
		}
		const { registerSubCliByName } = await import("./register.subclis-DTho8QNE.js").then((n) => n.a);
		await registerSubCliByName(program, primary);
	}
	if (!shouldSkipPluginCommandRegistration({
		argv: parseArgv,
		primary,
		hasBuiltinPrimary: primary !== null && program.commands.some((command) => command.name() === primary)
	})) {
		const { registerPluginCliCommands } = await import("./cli-9fGdJP5M.js");
		const { loadConfig } = await import("./auth-profiles-Ok_29lfs.js").then((n) => n.I);
		registerPluginCliCommands(program, loadConfig());
	}
	await program.parseAsync(parseArgv);
}
//#endregion
export { runCli };
