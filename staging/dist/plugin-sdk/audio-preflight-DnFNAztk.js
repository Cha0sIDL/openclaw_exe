import "./run-with-concurrency-BlQpCRCl.js";
import "./paths-B9fwHuf0.js";
import { L as logVerbose, z as shouldLogVerbose } from "./logger-BeJ9d38A.js";
import "./accounts-DXgtJCYj.js";
import "./thinking-DQ-RKqyc.js";
import "./model-auth-BEfxZHMu.js";
import "./plugins-_B4xyyDE.js";
import "./accounts-xXd2Iz5K.js";
import "./accounts-DSdLPivi.js";
import "./github-copilot-token-B2m7CSyP.js";
import "./ssrf-Cv2PRyfN.js";
import "./fetch-guard-DktFqB-K.js";
import "./message-channel-DPruDb-o.js";
import "./path-alias-guards-3SW7Ksc9.js";
import "./fs-safe-BpD25TdC.js";
import "./store-Dz5IlyDO.js";
import "./local-roots-qCr5T3Ts.js";
import "./pi-embedded-helpers-CCZOz14D.js";
import "./paths-BlRPJu2t.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, p as isAudioAttachment, t as runAudioTranscription } from "./audio-transcription-runner-CXqR8d92.js";
import "./image-B8SKUTsc.js";
import "./chrome-CnHBY1u4.js";
import "./skills-BTKA4QVh.js";
import "./redact-DqH9HZJJ.js";
import "./errors-CTLuOiLA.js";
import "./tool-images-C-HkPQ-p.js";
import "./api-key-rotation-Bi_eqkKy.js";
import "./proxy-fetch-CO6KBKen.js";
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
