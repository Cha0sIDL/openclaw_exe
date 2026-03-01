import { n as listAgentIds, s as resolveAgentWorkspaceDir } from "../../agent-scope-k12jKXhS.js";
import "../../paths-MYHBPf85.js";
import { pt as isGatewayStartupEvent, r as defaultRuntime, t as createSubsystemLogger } from "../../subsystem-BXiyX1bx.js";
import { l as resolveAgentIdFromSessionKey } from "../../session-key-CPPWn8gW.js";
import "../../workspace-DwThIdv7.js";
import "../../model-selection-C2zD9rZJ.js";
import "../../github-copilot-token-DyM1y5Pr.js";
import "../../env-3aLfHpTH.js";
import "../../boolean-Ce2-qkSB.js";
import "../../dock-vFezfkCT.js";
import { n as SILENT_REPLY_TOKEN } from "../../tokens-DyF4Dnn6.js";
import { a as createDefaultDeps, i as agentCommand } from "../../pi-embedded-CHuT0zL3.js";
import "../../plugins-BtRPsLDX.js";
import "../../accounts-DAIgQtGr.js";
import "../../bindings-CcUvlrvu.js";
import "../../send-Bd_9h8E9.js";
import "../../send-C19FMiHZ.js";
import "../../deliver-ZDT7Nwwx.js";
import "../../diagnostic-BrRbyVl7.js";
import "../../diagnostic-session-state-_tGY1a3B.js";
import "../../accounts-B_TpBJTR.js";
import "../../send-z7MRYnYh.js";
import "../../image-ops-DJziOGJI.js";
import "../../pi-model-discovery-CKZ51YTK.js";
import "../../message-channel-BWtwhs1r.js";
import "../../pi-embedded-helpers-gX6qUVIk.js";
import "../../chrome-0WRKRDI5.js";
import "../../ssrf-GR1wTjsC.js";
import "../../frontmatter-CthhXKqf.js";
import "../../skills-CTeQbz5-.js";
import "../../path-alias-guards-Vg4jKJqV.js";
import "../../redact-wETe5qIl.js";
import "../../errors-ep9Fblgx.js";
import "../../fs-safe-Ds7pa6r3.js";
import "../../store-TIxNA9I5.js";
import { U as resolveMainSessionKey, V as resolveAgentMainSessionKey, d as updateSessionStore, s as loadSessionStore } from "../../sessions-D9oxnTKX.js";
import "../../accounts-DldIIlOx.js";
import { l as resolveStorePath } from "../../paths-6XrpQmMB.js";
import "../../tool-images-8jEcsiPn.js";
import "../../thinking-CJoHneR6.js";
import "../../image-CGBthxON.js";
import "../../reply-prefix-BOctIOXu.js";
import "../../manager-BZNV0EUS.js";
import "../../gemini-auth-VFEYUvjK.js";
import "../../fetch-guard-DsJJm-9c.js";
import "../../query-expansion-Doc3pldv.js";
import "../../retry-DKGfbHpA.js";
import "../../target-errors-ZJ2oHKSY.js";
import "../../chunk-D_YMnoam.js";
import "../../markdown-tables-DiJ_nNzE.js";
import "../../local-roots-BrXfZKFY.js";
import "../../ir-aSOZ7e5O.js";
import "../../render-loap2gRq.js";
import "../../commands-registry-wiJOplOg.js";
import "../../skill-commands-CDWhAe7x.js";
import "../../runner-MF2w1NwB.js";
import "../../fetch-B1nZSYJF.js";
import "../../channel-activity-C57Zidf6.js";
import "../../tables-CXiEbgjc.js";
import "../../send-C_z4r8hG.js";
import "../../outbound-attachment-DiBtELUt.js";
import "../../send-QaiBPSG2.js";
import "../../resolve-route-qOffdv5M.js";
import "../../proxy-Bee2aKQk.js";
import "../../replies-rLJ3ModZ.js";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

//#region src/gateway/boot.ts
function generateBootSessionId() {
	return `boot-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").replace("T", "_").replace("Z", "")}-${crypto.randomUUID().slice(0, 8)}`;
}
const log$1 = createSubsystemLogger("gateway/boot");
const BOOT_FILENAME = "BOOT.md";
function buildBootPrompt(content) {
	return [
		"You are running a boot check. Follow BOOT.md instructions exactly.",
		"",
		"BOOT.md:",
		content,
		"",
		"If BOOT.md asks you to send a message, use the message tool (action=send with channel + target).",
		"Use the `target` field (not `to`) for message tool destinations.",
		`After sending with the message tool, reply with ONLY: ${SILENT_REPLY_TOKEN}.`,
		`If nothing needs attention, reply with ONLY: ${SILENT_REPLY_TOKEN}.`
	].join("\n");
}
async function loadBootFile(workspaceDir) {
	const bootPath = path.join(workspaceDir, BOOT_FILENAME);
	try {
		const trimmed = (await fs.readFile(bootPath, "utf-8")).trim();
		if (!trimmed) return { status: "empty" };
		return {
			status: "ok",
			content: trimmed
		};
	} catch (err) {
		if (err.code === "ENOENT") return { status: "missing" };
		throw err;
	}
}
function snapshotMainSessionMapping(params) {
	const agentId = resolveAgentIdFromSessionKey(params.sessionKey);
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId });
	try {
		const entry = loadSessionStore(storePath, { skipCache: true })[params.sessionKey];
		if (!entry) return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: true,
			hadEntry: false
		};
		return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: true,
			hadEntry: true,
			entry: structuredClone(entry)
		};
	} catch (err) {
		log$1.debug("boot: could not snapshot main session mapping", {
			sessionKey: params.sessionKey,
			error: String(err)
		});
		return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: false,
			hadEntry: false
		};
	}
}
async function restoreMainSessionMapping(snapshot) {
	if (!snapshot.canRestore) return;
	try {
		await updateSessionStore(snapshot.storePath, (store) => {
			if (snapshot.hadEntry && snapshot.entry) {
				store[snapshot.sessionKey] = snapshot.entry;
				return;
			}
			delete store[snapshot.sessionKey];
		}, { activeSessionKey: snapshot.sessionKey });
		return;
	} catch (err) {
		return err instanceof Error ? err.message : String(err);
	}
}
async function runBootOnce(params) {
	const bootRuntime = {
		log: () => {},
		error: (message) => log$1.error(String(message)),
		exit: defaultRuntime.exit
	};
	let result;
	try {
		result = await loadBootFile(params.workspaceDir);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		log$1.error(`boot: failed to read ${BOOT_FILENAME}: ${message}`);
		return {
			status: "failed",
			reason: message
		};
	}
	if (result.status === "missing" || result.status === "empty") return {
		status: "skipped",
		reason: result.status
	};
	const sessionKey = params.agentId ? resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	}) : resolveMainSessionKey(params.cfg);
	const message = buildBootPrompt(result.content ?? "");
	const sessionId = generateBootSessionId();
	const mappingSnapshot = snapshotMainSessionMapping({
		cfg: params.cfg,
		sessionKey
	});
	let agentFailure;
	try {
		await agentCommand({
			message,
			sessionKey,
			sessionId,
			deliver: false
		}, bootRuntime, params.deps);
	} catch (err) {
		agentFailure = err instanceof Error ? err.message : String(err);
		log$1.error(`boot: agent run failed: ${agentFailure}`);
	}
	const mappingRestoreFailure = await restoreMainSessionMapping(mappingSnapshot);
	if (mappingRestoreFailure) log$1.error(`boot: failed to restore main session mapping: ${mappingRestoreFailure}`);
	if (!agentFailure && !mappingRestoreFailure) return { status: "ran" };
	return {
		status: "failed",
		reason: [agentFailure ? `agent run failed: ${agentFailure}` : void 0, mappingRestoreFailure ? `mapping restore failed: ${mappingRestoreFailure}` : void 0].filter((part) => Boolean(part)).join("; ")
	};
}

//#endregion
//#region src/hooks/bundled/boot-md/handler.ts
const log = createSubsystemLogger("hooks/boot-md");
const runBootChecklist = async (event) => {
	if (!isGatewayStartupEvent(event)) return;
	if (!event.context.cfg) return;
	const cfg = event.context.cfg;
	const deps = event.context.deps ?? createDefaultDeps();
	const agentIds = listAgentIds(cfg);
	for (const agentId of agentIds) {
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
		const result = await runBootOnce({
			cfg,
			deps,
			workspaceDir,
			agentId
		});
		if (result.status === "failed") {
			log.warn("boot-md failed for agent startup run", {
				agentId,
				workspaceDir,
				reason: result.reason
			});
			continue;
		}
		if (result.status === "skipped") log.debug("boot-md skipped for agent startup run", {
			agentId,
			workspaceDir,
			reason: result.reason
		});
	}
};

//#endregion
export { runBootChecklist as default };