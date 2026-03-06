import "./paths-BBP4yd-2.js";
import "./globals-DyWRcjQY.js";
import "./utils-xFiJOAuL.js";
import "./thinking-Fqckw03T.js";
import { Dt as loadOpenClawPlugins } from "./reply-D6-YfhOC.js";
import { d as resolveDefaultAgentId, u as resolveAgentWorkspaceDir } from "./agent-scope-Ckfy1eLE.js";
import { t as createSubsystemLogger } from "./subsystem-D5pRlZe-.js";
import "./openclaw-root-DeEQQJyX.js";
import "./logger-DHGbafYr.js";
import "./exec-XzljJcHM.js";
import { $t as loadConfig } from "./model-selection-D6yIS4i6.js";
import "./registry-D9k2JaF8.js";
import "./github-copilot-token-b6kJVrW-.js";
import "./boolean-BsqeuxE6.js";
import "./env-BCNBCy-T.js";
import "./manifest-registry-CfBuZDUD.js";
import "./dock-y4QSCOQM.js";
import "./message-channel-FOEqd4n-.js";
import "./send-xS9dEHrV.js";
import "./plugins-DmEd4pqG.js";
import "./sessions-Dt8vnmQq.js";
import "./audio-transcription-runner-pj-KYzxd.js";
import "./image-BpDu8vlv.js";
import "./models-config-DzMwP8CW.js";
import "./pi-embedded-helpers-D2PVJ-a1.js";
import "./sandbox-BL9DTDci.js";
import "./tool-catalog-CCHhmVaK.js";
import "./chrome-Z9yUcaDs.js";
import "./tailscale-BTtkvuxs.js";
import "./tailnet-XGVl9sUv.js";
import "./ws-hC2980ir.js";
import "./auth-BL2Aq1B9.js";
import "./server-context-D9RxmesE.js";
import "./frontmatter-CuoNUw--.js";
import "./skills-CvS3YvgT.js";
import "./path-alias-guards-DuR6tGjh.js";
import "./paths-Ma2-xAwW.js";
import "./redact-C5yfNdVB.js";
import "./errors-kKUPais3.js";
import "./fs-safe-BSN_n9L7.js";
import "./proxy-env-DMYrH3XX.js";
import "./image-ops-ufpabANQ.js";
import "./store-BWQisjX6.js";
import "./ports-NAURVXNF.js";
import "./trash-r73uOrwG.js";
import "./server-middleware-tDRRJpz8.js";
import "./accounts-Gk6U_wCL.js";
import "./accounts-DAImktI2.js";
import "./logging-B-Ool4n-.js";
import "./accounts-V_js5_KL.js";
import "./send-BXPOMwpV.js";
import "./paths-C_Kd9gsY.js";
import "./chat-envelope-BBn0ocB6.js";
import "./tool-images-CrdvPWWS.js";
import "./tool-display-CoHybMXf.js";
import "./fetch-guard-D9krVfTp.js";
import "./api-key-rotation-8pMvQEIe.js";
import "./local-roots-CvUkPVw-.js";
import "./model-catalog-DwtCLzEV.js";
import "./proxy-fetch-Dj1VTSlt.js";
import "./tokens-BvGnwH99.js";
import "./deliver-BD932Xwh.js";
import "./commands-BrchMLbc.js";
import "./commands-registry-DO-OKRKl.js";
import "./client-Ca8oW9ow.js";
import "./call-CXalT0Oq.js";
import "./pairing-token-DW-Qfpqh.js";
import "./with-timeout-h9jZZo3x.js";
import "./diagnostic-B6ZX_hI0.js";
import "./send-DxeQFv5j.js";
import "./pi-model-discovery-BELV3Nh9.js";
import "./exec-approvals-allowlist-ByL1G0o5.js";
import "./exec-safe-bin-runtime-policy-DBZ3wFej.js";
import "./ir-CpoflAvf.js";
import "./render-C9LkRUhd.js";
import "./target-errors-CKa4VIzH.js";
import "./channel-selection-k5CGYioY.js";
import "./plugin-auto-enable-DomcoDkl.js";
import "./send-CBmTDNx_.js";
import "./outbound-attachment-Bjfksb9B.js";
import "./fetch-Veivlzj8.js";
import "./delivery-queue-DlYs6dYf.js";
import "./send-DU1mZmze.js";
import "./pairing-store-Cty2495o.js";
import "./read-only-account-inspect-C_MxWrrb.js";
import "./channel-activity-CMX7-nuK.js";
import "./tables-C3ite5oY.js";
import "./proxy-CBsSwUh4.js";
import "./timeouts-ChUtKSpS.js";
import "./skill-commands-C7vr6cLT.js";
import "./workspace-dirs-0ans8gk6.js";
import "./runtime-config-collectors-9DfCwYpq.js";
import "./command-secret-targets-4tvPNNBM.js";
import "./session-cost-usage-CIwOfDOX.js";
import "./onboard-helpers-KqKFzq9h.js";
import "./prompt-style-DRL6JbLb.js";
import "./pairing-labels-nbCRpFYL.js";
import "./memory-cli-DHsLaREm.js";
import "./manager-PlCgI_Si.js";
import "./query-expansion-gxl4zgak.js";
import "./links-CYThhxFD.js";
import "./cli-utils-CwhfeUyk.js";
import "./help-format-DQVSSJgX.js";
import "./progress-DJwvk8T-.js";
import "./exec-approvals-B8DrvPQH.js";
import "./nodes-screen-DX59Rd-J.js";
import "./system-run-command-BqdW3Tdt.js";
import "./server-lifecycle-CVUeDmaL.js";
import "./stagger-CTa8_NQt.js";

//#region src/plugins/cli.ts
const log = createSubsystemLogger("plugins");
function registerPluginCliCommands(program, cfg) {
	const config = cfg ?? loadConfig();
	const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
	const logger = {
		info: (msg) => log.info(msg),
		warn: (msg) => log.warn(msg),
		error: (msg) => log.error(msg),
		debug: (msg) => log.debug(msg)
	};
	const registry = loadOpenClawPlugins({
		config,
		workspaceDir,
		logger
	});
	const existingCommands = new Set(program.commands.map((cmd) => cmd.name()));
	for (const entry of registry.cliRegistrars) {
		if (entry.commands.length > 0) {
			const overlaps = entry.commands.filter((command) => existingCommands.has(command));
			if (overlaps.length > 0) {
				log.debug(`plugin CLI register skipped (${entry.pluginId}): command already registered (${overlaps.join(", ")})`);
				continue;
			}
		}
		try {
			const result = entry.register({
				program,
				config,
				workspaceDir,
				logger
			});
			if (result && typeof result.then === "function") result.catch((err) => {
				log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
			});
			for (const command of entry.commands) existingCommands.add(command);
		} catch (err) {
			log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
		}
	}
}

//#endregion
export { registerPluginCliCommands };