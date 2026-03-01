import { s as createSubsystemLogger } from "./entry.js";
import { j as loadConfig } from "./auth-profiles-CKfLk8eI.js";
import { d as resolveDefaultAgentId, u as resolveAgentWorkspaceDir } from "./agent-scope-C2k6BQnt.js";
import "./openclaw-root-C9tYgTzw.js";
import "./exec-BhaMholX.js";
import "./github-copilot-token-DKRiM6oj.js";
import "./host-env-security-BM8ktVlo.js";
import "./env-vars-DPtuUD7z.js";
import "./manifest-registry-HLdbjiS7.js";
import "./dock-B6idJaIX.js";
import "./model-ezP0J990.js";
import "./pi-model-discovery-CiFZpX_x.js";
import "./frontmatter-DzgKaILZ.js";
import "./skills-DOryi61N.js";
import "./path-alias-guards-BpvAiXds.js";
import "./message-channel-CJUwnCYd.js";
import "./sessions-qyDwM9U1.js";
import "./plugins-BOmV0yTv.js";
import "./accounts-jTTYYc3C.js";
import "./accounts-CnxuiQaw.js";
import "./accounts-DKgW2m_s.js";
import "./bindings-DcFNU_QL.js";
import "./logging-Cr3Gsq0-.js";
import "./send-CII7Kwg-.js";
import "./send-BQ9gTFWF.js";
import { _ as loadOpenClawPlugins } from "./subagent-registry-DH1GfDvx.js";
import "./paths-DWsXK0S0.js";
import "./chat-envelope-CrHAOMhr.js";
import "./client-C2kv9X_7.js";
import "./call-Dm4EXVBs.js";
import "./pairing-token-DzfCmsrM.js";
import "./net-DBrsyv8q.js";
import "./ip-BDxIP8rd.js";
import "./tailnet-Ca1WnFBq.js";
import "./tokens-DytUXmpb.js";
import "./with-timeout-IkkV3wKu.js";
import "./deliver-Cuxsl1JC.js";
import "./diagnostic-ilkPeYFb.js";
import "./diagnostic-session-state-Cw3EMvZy.js";
import "./send-Bvk9H8OY.js";
import "./image-ops-Z3_QkQPj.js";
import "./pi-embedded-helpers-C84l2dzW.js";
import "./sandbox-BD312APH.js";
import "./tool-catalog-DABanDxl.js";
import "./chrome-Dvc7mq05.js";
import "./tailscale-Cz0j5H8x.js";
import "./auth-ML-4Xoce.js";
import "./server-context-BmBGdVF_.js";
import "./paths-BE9S7VOj.js";
import "./redact-Dcypez3H.js";
import "./errors-Cu3BYw29.js";
import "./fs-safe-BVCJaIU_.js";
import "./ssrf-Bte-xH9B.js";
import "./store-BnsBHp0V.js";
import "./ports-B9YOEPbT.js";
import "./trash-C8oZT55U.js";
import "./server-middleware-CksvUSHW.js";
import "./tool-images-0PIXjd8w.js";
import "./thinking-DW6CKWyf.js";
import "./models-config-W8lviWiq.js";
import "./exec-approvals-allowlist-DTFNpDck.js";
import "./exec-safe-bin-runtime-policy-DUE0vtLp.js";
import "./reply-prefix-CJW3v-NP.js";
import "./memory-cli-CH6KGKfv.js";
import "./manager-BWJEsXOv.js";
import "./gemini-auth-BoeIwX7K.js";
import "./fetch-guard-DVFm6--m.js";
import "./query-expansion-6M4HIXKJ.js";
import "./retry-DRMxSLyf.js";
import "./target-errors-D4aLwsCU.js";
import "./chunk-BzS5RYkf.js";
import "./markdown-tables-BbZ9SxYi.js";
import "./local-roots-DGlEdY2D.js";
import "./ir-DiiIdg88.js";
import "./render-C1H8wE-4.js";
import "./commands-CQRE0cc7.js";
import "./commands-registry-BiS-Pd9f.js";
import "./image-DIpp4vKi.js";
import "./tool-display-FacPPVzc.js";
import "./runner-BG5hNrDZ.js";
import "./model-catalog-S0hBJwbP.js";
import "./fetch-CgA7FwwB.js";
import "./pairing-store-ChXnjrK0.js";
import "./exec-approvals-UjbIDJw1.js";
import "./nodes-screen-BNq9DmvM.js";
import "./session-utils-DcM50n37.js";
import "./session-cost-usage-CRAbQ_dT.js";
import "./skill-commands-v94xeHgi.js";
import "./workspace-dirs-fckC5OJF.js";
import "./channel-activity-wMIoQsvx.js";
import "./tables-DI6E9VBw.js";
import "./server-lifecycle-tRwwiurg.js";
import "./stagger-BJGKxryR.js";
import "./channel-selection-67xZBvtg.js";
import "./plugin-auto-enable-DkOtHjXS.js";
import "./send-B4Uq7Fkm.js";
import "./outbound-attachment-DximIUcc.js";
import "./delivery-queue-C7pBPro_.js";
import "./send-D_2lCIqg.js";
import "./resolve-route-DkJH7CNt.js";
import "./system-run-command-DfWeMDUu.js";
import "./pi-tools.policy-xE6BwpL1.js";
import "./proxy-C-FYeH9g.js";
import "./links-yQMT2QcX.js";
import "./cli-utils-CKDCmKAq.js";
import "./help-format-Du-bXlH0.js";
import "./progress-bvyZjsUc.js";
import "./replies-7P-IOwQU.js";
import "./onboard-helpers-2LMW-m_L.js";
import "./prompt-style-wsroINzm.js";
import "./pairing-labels-BEMzmCR5.js";

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