import "./run-with-concurrency-BpXrqdJV.js";
import "./config-Dc4hNJ5p.js";
import "./logger-CBsv5zKE.js";
import "./paths-D6tDENa_.js";
import { i as resolveWhatsAppAccount } from "./accounts-BhkxclG3.js";
import "./plugins-S2KRPNet.js";
import { f as readStringParam, l as readReactionParams, o as jsonResult, r as createActionGate, t as ToolAuthorizationError } from "./common-DBQCrL-D.js";
import { t as resolveWhatsAppOutboundTarget } from "./resolve-outbound-target-BLo2dk5o.js";
import "./image-ops-Bj5PUw2M.js";
import "./github-copilot-token-xlpfBCoP.js";
import "./path-alias-guards--xHMjbYa.js";
import "./fs-safe-B60CMaMF.js";
import "./proxy-env-BEGcORH2.js";
import "./tool-images-B2EJtwbr.js";
import "./fetch-guard-BZ8YnXzS.js";
import "./local-roots-hpA5sUnd.js";
import "./ir-BDKQqY2O.js";
import "./render-B80HZuem.js";
import "./tables-B4WQMS2d.js";
import { r as sendReactionWhatsApp } from "./outbound-DHhUxc1x.js";
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
