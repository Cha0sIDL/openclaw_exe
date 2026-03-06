import "./run-with-concurrency-CuSLxX3g.js";
import "./config-8kCW1cEV.js";
import "./logger-Bl138Nx7.js";
import "./paths-0d8fBoC4.js";
import { i as resolveWhatsAppAccount } from "./accounts-mY-NSdu1.js";
import "./plugins-B626cdGA.js";
import { f as readStringParam, l as readReactionParams, o as jsonResult, r as createActionGate, t as ToolAuthorizationError } from "./common-DM04d1Kv.js";
import { t as resolveWhatsAppOutboundTarget } from "./resolve-outbound-target-DyUXzd8m.js";
import "./image-ops-CxEiCBP4.js";
import "./github-copilot-token-CKKBybuX.js";
import "./path-alias-guards-CoYTMiOE.js";
import "./fs-safe-D51tGdcB.js";
import "./proxy-env-qW9r6VxK.js";
import "./tool-images-B0pneKQI.js";
import "./fetch-guard-A1vDYaOO.js";
import "./local-roots-y2rntxFI.js";
import "./ir-BPQUoCtq.js";
import "./render-CF8xRF8z.js";
import "./tables-CtlFN_xB.js";
import { r as sendReactionWhatsApp } from "./outbound-BqjwMQJs.js";

//#region src/agents/tools/whatsapp-target-auth.ts
function resolveAuthorizedWhatsAppOutboundTarget(params) {
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const resolution = resolveWhatsAppOutboundTarget({
		to: params.chatJid,
		allowFrom: account.allowFrom ?? [],
		mode: "implicit"
	});
	if (!resolution.ok) throw new ToolAuthorizationError(`WhatsApp ${params.actionLabel} blocked: chatJid "${params.chatJid}" is not in the configured allowFrom list for account "${account.accountId}".`);
	return {
		to: resolution.to,
		accountId: account.accountId
	};
}

//#endregion
//#region src/agents/tools/whatsapp-actions.ts
async function handleWhatsAppAction(params, cfg) {
	const action = readStringParam(params, "action", { required: true });
	const isActionEnabled = createActionGate(cfg.channels?.whatsapp?.actions);
	if (action === "react") {
		if (!isActionEnabled("reactions")) throw new Error("WhatsApp reactions are disabled.");
		const chatJid = readStringParam(params, "chatJid", { required: true });
		const messageId = readStringParam(params, "messageId", { required: true });
		const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove a WhatsApp reaction." });
		const participant = readStringParam(params, "participant");
		const accountId = readStringParam(params, "accountId");
		const fromMeRaw = params.fromMe;
		const fromMe = typeof fromMeRaw === "boolean" ? fromMeRaw : void 0;
		const resolved = resolveAuthorizedWhatsAppOutboundTarget({
			cfg,
			chatJid,
			accountId,
			actionLabel: "reaction"
		});
		const resolvedEmoji = remove ? "" : emoji;
		await sendReactionWhatsApp(resolved.to, messageId, resolvedEmoji, {
			verbose: false,
			fromMe,
			participant: participant ?? void 0,
			accountId: resolved.accountId
		});
		if (!remove && !isEmpty) return jsonResult({
			ok: true,
			added: emoji
		});
		return jsonResult({
			ok: true,
			removed: true
		});
	}
	throw new Error(`Unsupported WhatsApp action: ${action}`);
}

//#endregion
export { handleWhatsAppAction };