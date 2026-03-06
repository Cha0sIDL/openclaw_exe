import "./run-with-concurrency-CuSLxX3g.js";
import "./config-8kCW1cEV.js";
import { L as logVerbose, z as shouldLogVerbose } from "./logger-Bl138Nx7.js";
import "./paths-0d8fBoC4.js";
import "./accounts-mY-NSdu1.js";
import "./plugins-B626cdGA.js";
import "./thinking-hwikc-vp.js";
import "./accounts-BjlrojAy.js";
import "./image-ops-CxEiCBP4.js";
import "./pi-embedded-helpers-CipYZzOq.js";
import "./accounts-BJ1gLJ-a.js";
import "./github-copilot-token-CKKBybuX.js";
import "./paths-D764z9IH.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, p as isAudioAttachment, t as runAudioTranscription } from "./audio-transcription-runner-CjIzGRnb.js";
import "./image-NopZ-l09.js";
import "./chrome-BnI8r9QE.js";
import "./skills-DYgCYtaD.js";
import "./path-alias-guards-CoYTMiOE.js";
import "./redact-C3rEm8A0.js";
import "./errors-B2jpHiod.js";
import "./fs-safe-D51tGdcB.js";
import "./proxy-env-qW9r6VxK.js";
import "./store-BO55tnzp.js";
import "./tool-images-B0pneKQI.js";
import "./fetch-guard-A1vDYaOO.js";
import "./api-key-rotation-Dzs2m1VP.js";
import "./local-roots-y2rntxFI.js";
import "./proxy-fetch-C-fXKPD2.js";

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