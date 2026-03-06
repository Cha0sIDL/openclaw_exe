import "./run-with-concurrency-CzKd3TyW.js";
import "./paths-CaA28K0s.js";
import { L as logVerbose, z as shouldLogVerbose } from "./logger-03l-fZAz.js";
import "./model-selection-NLEJyLYI.js";
import "./github-copilot-token-BWXANsA6.js";
import "./thinking-DYBB1GXM.js";
import "./accounts-CwxM-bX9.js";
import "./plugins-CMDjf6O_.js";
import "./accounts-CV0cumZi.js";
import "./image-ops-D4yY9Ve0.js";
import "./pi-embedded-helpers-DpbPeRn0.js";
import "./chrome-BDNotpVE.js";
import "./skills-DMYnf_zJ.js";
import "./path-alias-guards-CJ-rXOZR.js";
import "./redact-BYyl-Ec1.js";
import "./errors-LUTSBF6A.js";
import "./fs-safe-BmvYOXgE.js";
import "./proxy-env-BvNWoKWS.js";
import "./store-DXgPa4HT.js";
import "./accounts-CYRx2eFM.js";
import "./paths-BtoBqtXI.js";
import "./tool-images-ZoY265HY.js";
import "./image-CV6Y4XGM.js";
import { g as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-CIqthbUa.js";
import "./fetch-CdUTVAtZ.js";
import "./fetch-guard-ChPP8NOx.js";
import "./api-key-rotation-C6l4yuvp.js";
import "./proxy-fetch-ukJ5M9an.js";

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