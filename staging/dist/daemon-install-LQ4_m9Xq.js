import "./globals-Bv4ZcVWM.js";
import "./paths-BfR2LXbA.js";
import "./subsystem-B4CcvtwB.js";
import "./boolean-DTgd5CzD.js";
import "./auth-profiles-Ok_29lfs.js";
import "./agent-scope-Ct4K9XNr.js";
import "./utils-C5WN6czr.js";
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
import "./tailscale-Ch9Mc7pc.js";
import "./tailnet-CxYaUoxP.js";
import "./ws-BzjlD7jY.js";
import "./auth-DPbW35vL.js";
import "./sessions-CkpVe03D.js";
import "./accounts-BER1yztz.js";
import "./paths-E64m60XY.js";
import "./chat-envelope-CH5bYP5u.js";
import "./client-BFxmeDqQ.js";
import "./call-DVkWjKJC.js";
import "./pairing-token-B_ihwlFf.js";
import "./onboard-helpers-0WTf7rCZ.js";
import "./prompt-style-DMpJWKki.js";
import "./note-C3x48sve.js";
import { n as gatewayInstallErrorHint, t as buildGatewayInstallPlan } from "./daemon-install-helpers-BrKXBKqG.js";
import "./runtime-guard-CfwwbQAP.js";
import { r as isGatewayDaemonRuntime } from "./daemon-runtime-d8cwMM7i.js";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-546JuvBJ.js";
import { r as isSystemdUserServiceAvailable } from "./systemd-BHAQEYyJ.js";
import { t as resolveGatewayService } from "./service-CPBVrfN5.js";
import { n as ensureSystemdUserLingerNonInteractive } from "./systemd-linger-B6EU-1W4.js";
//#region src/commands/onboard-non-interactive/local/daemon-install.ts
async function installGatewayDaemonNonInteractive(params) {
	const { opts, runtime, port } = params;
	if (!opts.installDaemon) return;
	const daemonRuntimeRaw = opts.daemonRuntime ?? "node";
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
