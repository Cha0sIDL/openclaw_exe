import { c as resolveAgentWorkspaceDir, r as listAgentIds } from "../../run-with-concurrency-CzUbPnkS.js";
import "../../paths-C6TxBCvO.js";
import { i as defaultRuntime, t as createSubsystemLogger } from "../../subsystem-D7UWJNhH.js";
import { B as resolveAgentIdFromSessionKey } from "../../workspace-B1VBj0cY.js";
import "../../logger-B-R_-5mh.js";
import "../../model-selection-CMGcSezC.js";
import "../../github-copilot-token-D13V9YBz.js";
import { a as isGatewayStartupEvent } from "../../legacy-names-BCm4ov65.js";
import "../../thinking-CWTLku2g.js";
import { n as SILENT_REPLY_TOKEN } from "../../tokens-Csbpu55k.js";
import { a as agentCommand, o as createDefaultDeps } from "../../pi-embedded-COPIxB-N.js";
import "../../accounts-CFmx3Ko8.js";
import "../../plugins-xdrpMlbb.js";
import "../../send-DK2Qq7Q8.js";
import "../../send-B7YAq4iR.js";
import "../../deliver-CJafxnVk.js";
import "../../diagnostic-BHeUaYDb.js";
import "../../accounts-BGFa9f-K.js";
import "../../image-ops-CZyWVo3J.js";
import "../../send-B33olMh0.js";
import "../../pi-model-discovery-CybKBU2K.js";
import { Dt as resolveMainSessionKey, J as updateSessionStore, Tt as resolveAgentMainSessionKey, W as loadSessionStore } from "../../pi-embedded-helpers-ra_Qj9lm.js";
import "../../chrome-Bp1X9DNi.js";
import "../../frontmatter-DH91cf0z.js";
import "../../skills-D8UkPedh.js";
import "../../path-alias-guards-BL8yV-Ja.js";
import "../../redact-Ce4hro-U.js";
import "../../errors-D2ORDJPK.js";
import "../../fs-safe-DiYRXeBI.js";
import "../../proxy-env-xv4vJgUz.js";
import "../../store-9xYjVnEt.js";
import "../../accounts-Myzf9IRA.js";
import { s as resolveStorePath } from "../../paths-BRjL6K6G.js";
import "../../tool-images-DlUOK7tr.js";
import "../../image-CgO6GuwE.js";
import "../../audio-transcription-runner-CptLNA_4.js";
import "../../fetch-ChItq85A.js";
import "../../fetch-guard-NC0zgpoh.js";
import "../../api-key-rotation-zd1593PT.js";
import "../../proxy-fetch-CF5kidRK.js";
import "../../ir-BTWnurHH.js";
import "../../render-DW7AcFdD.js";
import "../../target-errors-CmfYcvda.js";
import "../../commands-registry-D88O9lbl.js";
import "../../skill-commands-Bh-m92m4.js";
import "../../fetch-BfuG8uZ8.js";
import "../../channel-activity-BWCDy7rb.js";
import "../../tables-BjlPmYDz.js";
import "../../send-YarWUTVS.js";
import "../../outbound-attachment-CL_CnCT4.js";
import "../../send-CvvoqlSY.js";
import "../../proxy-CecQTx_Z.js";
import "../../manager-_o21DoNC.js";
import "../../query-expansion-D5Cn44Qx.js";
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
			deliver: false,
			senderIsOwner: true
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