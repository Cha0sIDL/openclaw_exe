import "./paths-BJV7vkaX.js";
import { a as logVerbose, c as shouldLogVerbose } from "./globals-BM8hKFm0.js";
import "./utils-DC4zYvW0.js";
import "./thinking-BYwvlJ3S.js";
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
import { d as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-OGCRKqaf.js";
import "./image-mFaUY6Mf.js";
import "./models-config-BYKeUs9Z.js";
import "./pi-embedded-helpers-D9w2HqW7.js";
import "./sandbox-Dp2LrT2r.js";
import "./tool-catalog-ITGbG7Rk.js";
import "./chrome-0JI-2W2a.js";
import "./tailscale-DI4s2-Gr.js";
import "./tailnet-DDDvYK0o.js";
import "./ws-DTH7lPMz.js";
import "./auth-D-L89Yt0.js";
import "./server-context-CcO1RPsQ.js";
import "./frontmatter-DDaV0iaR.js";
import "./env-overrides-DmjWQl3G.js";
import "./path-alias-guards-DLqJgAhJ.js";
import "./skills-a9F7gIZY.js";
import "./paths-CR0R5_8U.js";
import "./redact-CSAAUZeN.js";
import "./errors-CaD5MZdl.js";
import "./fs-safe-B3BtQwY1.js";
import "./proxy-env-gofikmGK.js";
import "./image-ops-Dj1UHz_P.js";
import "./store-BmISwJ7q.js";
import "./ports-BkdglpAO.js";
import "./trash-Z3mFp_O-.js";
import "./server-middleware-DGnu0Iyy.js";
import "./accounts-BYXZoHmE.js";
import "./accounts-Cb-TYjNx.js";
import "./logging-CK-b_j6J.js";
import "./accounts-B7qIxnuY.js";
import "./paths-COpaT9Gf.js";
import "./chat-envelope-C16Rx042.js";
import "./tool-images-CTExEruu.js";
import "./tool-display-DOC9dtsx.js";
import "./fetch-guard-CBeheDHz.js";
import "./api-key-rotation-C5uA6jZa.js";
import "./local-roots-DJKoI6aN.js";
import "./model-catalog-TNH-qs1d.js";
import "./proxy-fetch--QS0j3IB.js";
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
