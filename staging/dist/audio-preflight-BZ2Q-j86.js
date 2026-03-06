import "./run-with-concurrency-CzUbPnkS.js";
import "./paths-C6TxBCvO.js";
import { p as shouldLogVerbose, u as logVerbose } from "./subsystem-D7UWJNhH.js";
import "./workspace-B1VBj0cY.js";
import "./logger-B-R_-5mh.js";
import "./model-selection-CMGcSezC.js";
import "./github-copilot-token-D13V9YBz.js";
import "./legacy-names-BCm4ov65.js";
import "./thinking-CWTLku2g.js";
import "./accounts-CFmx3Ko8.js";
import "./plugins-xdrpMlbb.js";
import "./accounts-BGFa9f-K.js";
import "./image-ops-CZyWVo3J.js";
import "./pi-embedded-helpers-ra_Qj9lm.js";
import "./chrome-Bp1X9DNi.js";
import "./frontmatter-DH91cf0z.js";
import "./skills-D8UkPedh.js";
import "./path-alias-guards-BL8yV-Ja.js";
import "./redact-Ce4hro-U.js";
import "./errors-D2ORDJPK.js";
import "./fs-safe-DiYRXeBI.js";
import "./proxy-env-xv4vJgUz.js";
import "./store-9xYjVnEt.js";
import "./accounts-Myzf9IRA.js";
import "./paths-BRjL6K6G.js";
import "./tool-images-DlUOK7tr.js";
import "./image-CgO6GuwE.js";
import { g as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-CptLNA_4.js";
import "./fetch-ChItq85A.js";
import "./fetch-guard-NC0zgpoh.js";
import "./api-key-rotation-zd1593PT.js";
import "./proxy-fetch-CF5kidRK.js";

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