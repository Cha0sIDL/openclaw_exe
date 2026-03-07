import "./run-with-concurrency-DelsVdbv.js";
import "./model-auth-B0BF67rM.js";
import { L as logVerbose, z as shouldLogVerbose } from "./logger-sESZPq_e.js";
import "./paths-CtOdJffQ.js";
import "./github-copilot-token-BLx9ZUBJ.js";
import "./thinking-BzO_Om-G.js";
import "./accounts-BbLNLA0B.js";
import "./plugins-BeuoP6Cr.js";
import "./image-ops-Bq48V3Em.js";
import "./pi-embedded-helpers-C_agzhOE.js";
import "./accounts-CSL_F3kb.js";
import "./accounts-Cr0cryJd.js";
import "./paths-D2cK_vav.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, p as isAudioAttachment, t as runAudioTranscription } from "./audio-transcription-runner-B0rPlIsA.js";
import "./image-DNK4bFhI.js";
import "./chrome-DmMVQQmb.js";
import "./skills-BGL_A7xA.js";
import "./path-alias-guards-PjG_aFQa.js";
import "./redact-PAtWLLID.js";
import "./errors-DbVn_y4L.js";
import "./fs-safe-Cj0GbM-e.js";
import "./proxy-env-cH-BXrrY.js";
import "./store-CjooHtM1.js";
import "./tool-images-CbTGSHz3.js";
import "./fetch-guard-DOP5benM.js";
import "./api-key-rotation-DgjEbcZx.js";
import "./local-roots-DucBCnCA.js";
import "./proxy-fetch-D0rPXe4M.js";
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
