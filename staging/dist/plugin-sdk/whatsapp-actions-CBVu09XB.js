import { i as resolveWhatsAppAccount } from "./accounts-yrtVsn_Y.js";
import "./paths-DVWx7USN.js";
import "./github-copilot-token-Cg0YPPSu.js";
import "./config-CIl48WCb.js";
import "./subsystem-C2adF5U4.js";
import "./command-format-DgW0zcnY.js";
import "./agent-scope-C3RYg0D_.js";
import "./message-channel-ChlcDAOp.js";
import "./plugins-BHd2rsCe.js";
import "./bindings-DbarLVcw.js";
import "./path-alias-guards-CAudg7_g.js";
import "./fs-safe-DT_VpYHA.js";
import "./image-ops-DKwIuQVy.js";
import "./ssrf-D07_rJxG.js";
import "./fetch-guard-CYsbL_HO.js";
import "./local-roots-rFR2J_2C.js";
import "./ir-DPi-FHLB.js";
import "./chunk-D8C5VsxR.js";
import "./markdown-tables-BtcNK4JI.js";
import "./render-Dk3zVolZ.js";
import "./tables-C97rHaIX.js";
import "./tool-images-BWcRj5-a.js";
import { a as createActionGate, c as jsonResult, d as readReactionParams, i as ToolAuthorizationError, m as readStringParam } from "./target-errors-RXs1OCTQ.js";
import { t as resolveWhatsAppOutboundTarget } from "./resolve-outbound-target-DK2_OcNa.js";
import { r as sendReactionWhatsApp } from "./outbound-BDJZF67_.js";

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