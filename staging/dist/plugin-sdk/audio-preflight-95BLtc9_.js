import "./run-with-concurrency-BmqlpGOz.js";
import "./accounts-pP2x3ZhF.js";
import "./paths-eFexkPEh.js";
import "./github-copilot-token-Cxf8QYZb.js";
import "./config-DHj52j9A.js";
import { L as logVerbose, z as shouldLogVerbose } from "./logger-qBtAINSh.js";
import "./thinking-2GlTi4JB.js";
import "./image-ops-sbFRyNCD.js";
import "./pi-embedded-helpers-cW6rlHVs.js";
import "./plugins-Dpt4e0m6.js";
import "./accounts-C_15m-UR.js";
import "./accounts-CD68PDP0.js";
import "./paths-BT9JjwAc.js";
import "./redact-Cp8eaEBy.js";
import "./errors-CpUQY-jc.js";
import "./path-alias-guards-DX9xADBA.js";
import "./fs-safe-CPJX3Pcd.js";
import "./ssrf-D4R7wohG.js";
import "./fetch-guard-B1-FCmEi.js";
import "./local-roots-DDvhDgVm.js";
import "./tool-images-CC2MdxgK.js";
import { i as normalizeMediaAttachments, m as isAudioAttachment, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-BaElN0j2.js";
import "./image-wPyfG0Yr.js";
import "./chrome-CfHLlzSc.js";
import "./skills-CJD32DuT.js";
import "./store-DPPxADm7.js";
import "./api-key-rotation-aQ4DTZ2H.js";
import "./proxy-fetch-CCmPR5IR.js";
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
