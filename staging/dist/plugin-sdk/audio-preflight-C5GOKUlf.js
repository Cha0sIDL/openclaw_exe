import "./run-with-concurrency-qFOkp49n.js";
import "./accounts-BevXHlgt.js";
import "./paths-MKyEVmEb.js";
import "./github-copilot-token-D5fdS6xD.js";
import "./config-DcmTo9nX.js";
import { L as logVerbose, z as shouldLogVerbose } from "./logger-z1vqlUc1.js";
import "./thinking-UWPe_QkL.js";
import "./image-ops-DQecz92g.js";
import "./pi-embedded-helpers-CAUCyW-C.js";
import "./plugins-BDbhbWhL.js";
import "./accounts-UcDby2iw.js";
import "./accounts-BH2cDwDs.js";
import "./paths-NcyWgkDa.js";
import "./redact-DIGZ7dEc.js";
import "./errors-C-TFeu_U.js";
import "./path-alias-guards-CMpHLrQn.js";
import "./fs-safe-B8jm0acc.js";
import "./ssrf-DLMRQ-23.js";
import "./fetch-guard-BYuGI2fv.js";
import "./local-roots-DkkJU3dK.js";
import "./tool-images-DlLcyfNA.js";
import { f as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-7CHxE2BQ.js";
import "./skills-B9E5z-5N.js";
import "./chrome-7WG4RD96.js";
import "./store-D3PzFwov.js";
import "./image-BD0PKdPB.js";
import "./api-key-rotation-CHOb7Xyf.js";
import "./proxy-fetch-DxlXp4Yi.js";

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