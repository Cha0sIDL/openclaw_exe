import { a as logVerbose, c as shouldLogVerbose } from "./globals-d3aR1MYC.js";
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
import "./frontmatter-I4t5UjzX.js";
import "./skills-DvBk_SBL.js";
import "./path-alias-guards-5rac999j.js";
import "./message-channel-BH8TVME5.js";
import "./sessions-0JfTMYG-.js";
import "./plugins-hyZRvFwO.js";
import "./accounts-5eLsrtsT.js";
import "./accounts-qTCkeVoU.js";
import "./logging-BvdokaVt.js";
import "./accounts-C9pjEZ6g.js";
import "./paths-cmEiiwMK.js";
import "./chat-envelope-n7RmUTHV.js";
import "./net-0Fapzizl.js";
import "./tailnet-cWmPZlFU.js";
import "./image-ops--7j2A6VZ.js";
import "./pi-embedded-helpers-BZ9Btdtj.js";
import "./sandbox-B1Nlj37O.js";
import "./tool-catalog-B4gxY3Jd.js";
import "./chrome-DQhBG1da.js";
import "./tailscale-Bx7OP_Ql.js";
import "./auth-BothAgrh.js";
import "./server-context-BeIaDzE3.js";
import "./paths-DkGd1YEC.js";
import "./redact-LmGH4yE3.js";
import "./errors-s25Xfb--.js";
import "./fs-safe-z-Hw12Xy.js";
import "./proxy-env-DxO4ZKbR.js";
import "./store-CtS8gb_5.js";
import "./ports-GoOZaxy6.js";
import "./trash-uRrkiV94.js";
import "./server-middleware-CJxtwXCE.js";
import "./tool-images-BRNSPwBR.js";
import "./thinking-C0gzzPsv.js";
import "./models-config-C701-Zdv.js";
import "./model-catalog-Dk_yJRXt.js";
import "./fetch-D7b6wfSg.js";
import { _ as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-BxtTIEX5.js";
import "./fetch-guard-De5_S5uz.js";
import "./image-DtEfXBAZ.js";
import "./tool-display-CSQ-o0DM.js";
import "./api-key-rotation-DP8qZP_w.js";
import "./proxy-fetch-BF9itsSS.js";

//#region src/media-understanding/audio-preflight.ts
/**
* Transcribes the first audio attachment BEFORE mention checking.
* This allows voice notes to be processed in group chats with requireMention: true.
* Returns the transcript or undefined if transcription fails or no audio is found.
*/
async function transcribeFirstAudio(params) {
	const { ctx, cfg } = params;
	const audioConfig = cfg.tools?.media?.audio;
	if (!audioConfig || audioConfig.enabled === false) return;
	const attachments = normalizeMediaAttachments(ctx);
	if (!attachments || attachments.length === 0) return;
	const firstAudio = attachments.find((att) => att && isAudioAttachment(att) && !att.alreadyTranscribed);
	if (!firstAudio) return;
	if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribing attachment ${firstAudio.index} for mention check`);
	try {
		const { transcript } = await runAudioTranscription({
			ctx,
			cfg,
			attachments,
			agentDir: params.agentDir,
			providers: params.providers,
			activeModel: params.activeModel,
			localPathRoots: resolveMediaAttachmentLocalRoots({
				cfg,
				ctx
			})
		});
		if (!transcript) return;
		firstAudio.alreadyTranscribed = true;
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribed ${transcript.length} chars from attachment ${firstAudio.index}`);
		return transcript;
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcription failed: ${String(err)}`);
		return;
	}
}

//#endregion
export { transcribeFirstAudio };