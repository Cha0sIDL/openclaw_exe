import "./run-with-concurrency-C7qlYTKU.js";
import "./model-auth-ritcJmNz.js";
import { L as logVerbose, z as shouldLogVerbose } from "./logger-COSQR8wc.js";
import "./paths-akVZbnot.js";
import "./github-copilot-token-CjEwwa4e.js";
import "./thinking-CTPZ5-0z.js";
import "./ssrf-yn-YK3IC.js";
import "./fetch-guard-B-tnCoYM.js";
import "./accounts-D1dlCdXN.js";
import "./plugins-DoPATSbd.js";
import "./image-ops-BoVjuw9G.js";
import "./pi-embedded-helpers-BMo2sUJm.js";
import "./accounts-Cdj4giXR.js";
import "./accounts-Dyf3ev_o.js";
import "./paths-Dtz4vuOX.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, p as isAudioAttachment, t as runAudioTranscription } from "./audio-transcription-runner-7BKR1tKk.js";
import "./image-rL4u7pz0.js";
import "./chrome-C1x_JFVG.js";
import "./skills-Ca8kJAWa.js";
import "./path-alias-guards-DYNNyUJn.js";
import "./redact-DVH6H0sp.js";
import "./errors-DiYVhP-n.js";
import "./fs-safe-U2ClzRXV.js";
import "./store-CzHldbcD.js";
import "./tool-images-5QSf-T6u.js";
import "./api-key-rotation-aP-GGDL0.js";
import "./local-roots-CCsC-Hbu.js";
import "./proxy-fetch-BlvHuG8G.js";
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
