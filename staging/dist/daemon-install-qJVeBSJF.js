import "./paths-BJV7vkaX.js";
import "./globals-BM8hKFm0.js";
import "./utils-DC4zYvW0.js";
import "./agent-scope-BjNYwuUO.js";
import "./subsystem-B-oDv-jG.js";
import "./openclaw-root-Bm1aZrog.js";
import "./logger-CS_BtBMJ.js";
import "./exec-M8Rb4KML.js";
import "./model-selection-Ct4JRMnm.js";
import "./github-copilot-token-D37fjdwy.js";
import "./boolean-CJxfhBkG.js";
import "./env-BCEGmRqf.js";
import "./host-env-security-3W3usp5X.js";
import "./registry-DTGNhZ2I.js";
import "./manifest-registry-BkD5G9c-.js";
import "./dock-BE996V7g.js";
import "./message-channel-SQk3PfR_.js";
import "./plugins-Dqx9Ki_e.js";
import "./sessions-CCYTHV0b.js";
import "./tailscale-DI4s2-Gr.js";
import "./tailnet-DDDvYK0o.js";
import "./ws-DTH7lPMz.js";
import "./auth-D-L89Yt0.js";
import "./accounts-BYXZoHmE.js";
import "./accounts-Cb-TYjNx.js";
import "./logging-CK-b_j6J.js";
import "./accounts-B7qIxnuY.js";
import "./paths-COpaT9Gf.js";
import "./chat-envelope-C16Rx042.js";
import "./client-SbKzE96g.js";
import "./call-anvtKqEC.js";
import "./pairing-token-JyHgxIPg.js";
import "./onboard-helpers--etFdTIT.js";
import "./prompt-style-CbhWkaLh.js";
import "./runtime-guard-i1RPKYZv.js";
import "./note-C1lJCZxe.js";
import { n as gatewayInstallErrorHint, t as buildGatewayInstallPlan } from "./daemon-install-helpers-DbzBCenM.js";
import { r as isGatewayDaemonRuntime } from "./daemon-runtime-BSALRrkG.js";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-CzmQv_kE.js";
import { r as isSystemdUserServiceAvailable } from "./systemd-DRSN7X1B.js";
import { t as resolveGatewayService } from "./service-XaiyDt9D.js";
import { n as ensureSystemdUserLingerNonInteractive } from "./systemd-linger-DHPBE-pC.js";
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
