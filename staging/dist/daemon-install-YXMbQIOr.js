import "./globals-d3aR1MYC.js";
import "./paths-BMo6kTge.js";
import "./subsystem-Cfn2Pryx.js";
import "./boolean-DtWR5bt3.js";
import "./auth-profiles-tPxLL4Q6.js";
import "./agent-scope-BGsA4zEf.js";
import "./utils-cwpAMi-t.js";
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
import "./paths-cmEiiwMK.js";
import "./chat-envelope-n7RmUTHV.js";
import "./client-CzImpHGe.js";
import "./call-MMA9uqcd.js";
import "./pairing-token-h5vg0oaO.js";
import "./net-0Fapzizl.js";
import "./tailnet-cWmPZlFU.js";
import "./tailscale-Bx7OP_Ql.js";
import "./auth-BothAgrh.js";
import "./onboard-helpers-Cl_losjk.js";
import "./prompt-style-By2UMb-r.js";
import "./note-DrV9F1n8.js";
import { n as gatewayInstallErrorHint, t as buildGatewayInstallPlan } from "./daemon-install-helpers-gxR8f_p3.js";
import "./runtime-guard-BMUPc-7K.js";
import { r as isGatewayDaemonRuntime, t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-VfkpXuRu.js";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-CgR8Ikl3.js";
import { r as isSystemdUserServiceAvailable } from "./systemd-BajKVKoa.js";
import { t as resolveGatewayService } from "./service-Ce1okz8a.js";
import { n as ensureSystemdUserLingerNonInteractive } from "./systemd-linger-DqJcZOwF.js";

//#region src/commands/onboard-non-interactive/local/daemon-install.ts
async function installGatewayDaemonNonInteractive(params) {
	const { opts, runtime, port } = params;
	if (!opts.installDaemon) return;
	const daemonRuntimeRaw = opts.daemonRuntime ?? DEFAULT_GATEWAY_DAEMON_RUNTIME;
	const systemdAvailable = process.platform === "linux" ? await isSystemdUserServiceAvailable() : true;
	if (process.platform === "linux" && !systemdAvailable) {
		runtime.log("Systemd user services are unavailable; skipping service install.");
		return;
	}
	if (!isGatewayDaemonRuntime(daemonRuntimeRaw)) {
		runtime.error("Invalid --daemon-runtime (use node or bun)");
		runtime.exit(1);
		return;
	}
	const service = resolveGatewayService();
	const tokenResolution = await resolveGatewayInstallToken({
		config: params.nextConfig,
		env: process.env
	});
	for (const warning of tokenResolution.warnings) runtime.log(warning);
	if (tokenResolution.unavailableReason) {
		runtime.error([
			"Gateway install blocked:",
			tokenResolution.unavailableReason,
			"Fix gateway auth config/token input and rerun onboarding."
		].join(" "));
		runtime.exit(1);
		return;
	}
	const { programArguments, workingDirectory, environment } = await buildGatewayInstallPlan({
		env: process.env,
		port,
		token: tokenResolution.token,
		runtime: daemonRuntimeRaw,
		warn: (message) => runtime.log(message),
		config: params.nextConfig
	});
	try {
		await service.install({
			env: process.env,
			stdout: process.stdout,
			programArguments,
			workingDirectory,
			environment
		});
	} catch (err) {
		runtime.error(`Gateway service install failed: ${String(err)}`);
		runtime.log(gatewayInstallErrorHint());
		return;
	}
	await ensureSystemdUserLingerNonInteractive({ runtime });
}

//#endregion
export { installGatewayDaemonNonInteractive };