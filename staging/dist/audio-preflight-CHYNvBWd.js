import "./run-with-concurrency-C1raW7MB.js";
import "./paths-hfkBoC7i.js";
import { p as shouldLogVerbose, u as logVerbose } from "./subsystem-C4EPfZvP.js";
import "./workspace-C-WsJ6YD.js";
import "./logger-CrRR9XqM.js";
import "./model-selection-BebDf0Oe.js";
import "./github-copilot-token-CQmATy5E.js";
import "./legacy-names-PdEWCM6o.js";
import "./thinking-e8AYL_Pc.js";
import "./accounts-C-Va__6p.js";
import "./plugins-D8bZQOC6.js";
import "./accounts-t9UxPKg7.js";
import "./image-ops-bE_0rjXg.js";
import "./pi-embedded-helpers-Cf7LfIfV.js";
import "./chrome-BAySnG__.js";
import "./frontmatter-DDNsrGxl.js";
import "./skills-OJ4_aEbD.js";
import "./path-alias-guards-CehkTmf1.js";
import "./redact-dO0soxAw.js";
import "./errors-CiwC5WY-.js";
import "./fs-safe-r7wHNnYj.js";
import "./proxy-env-CKjRmVoX.js";
import "./store-Clf0bFAY.js";
import "./accounts-CpO6e3Di.js";
import "./paths-CikpXE25.js";
import "./tool-images-C0JUp3Ro.js";
import "./image-CHsF33rj.js";
import { g as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-ByJvhIA5.js";
import "./fetch-C6-X--uo.js";
import "./fetch-guard-DW6bn9qe.js";
import "./api-key-rotation-ChonxG9E.js";
import "./proxy-fetch-VohjYre9.js";
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
