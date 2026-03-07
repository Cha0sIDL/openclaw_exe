import "./run-with-concurrency-DjEhrhW1.js";
import "./paths-GBpjI3o0.js";
import { L as logVerbose, z as shouldLogVerbose } from "./logger-B-kSSdCe.js";
import "./model-selection-ySxEKig3.js";
import "./github-copilot-token-PBo8Vdmp.js";
import "./thinking-Co4i1hhU.js";
import "./accounts-yzM91UJB.js";
import "./plugins-BMTO3fp_.js";
import "./accounts-B2o2uqsG.js";
import "./image-ops-BtrI86Zi.js";
import "./pi-embedded-helpers-DBBomwfj.js";
import "./chrome-CXrwgEJw.js";
import "./skills-B56KHCXB.js";
import "./path-alias-guards-BtUiTTpq.js";
import "./redact-BL_rPJPU.js";
import "./errors-CBKJN4GE.js";
import "./fs-safe-Cj0vPNIL.js";
import "./proxy-env-B1D5ldEM.js";
import "./store-BQ-tu0xc.js";
import "./accounts-DFPYWJbT.js";
import "./paths-CQ-lXJTG.js";
import "./tool-images-CNNTRrT9.js";
import "./image-BPdQRfpE.js";
import { g as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-BEYVeK1x.js";
import "./fetch-DkLdlode.js";
import "./fetch-guard-ByefNIAL.js";
import "./api-key-rotation-C__GoxQV.js";
import "./proxy-fetch-2MWbdT2l.js";
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
