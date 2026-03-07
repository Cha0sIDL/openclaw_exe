import "./run-with-concurrency-BpXrqdJV.js";
import "./config-Dc4hNJ5p.js";
import { L as logVerbose, z as shouldLogVerbose } from "./logger-CBsv5zKE.js";
import "./paths-D6tDENa_.js";
import "./accounts-BhkxclG3.js";
import "./plugins-S2KRPNet.js";
import "./thinking-CaMPrJR8.js";
import "./accounts-OVMzmsds.js";
import "./image-ops-Bj5PUw2M.js";
import "./pi-embedded-helpers-v6W_2uW3.js";
import "./accounts-D_26mZG2.js";
import "./github-copilot-token-xlpfBCoP.js";
import "./paths-fpq6UuZD.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, p as isAudioAttachment, t as runAudioTranscription } from "./audio-transcription-runner-B8cSMb2A.js";
import "./image-Kc9_s-JZ.js";
import "./chrome--zYH3Zmd.js";
import "./skills-Ca1XcwHh.js";
import "./path-alias-guards--xHMjbYa.js";
import "./redact-Dn9qg8-i.js";
import "./errors-DszbzIZr.js";
import "./fs-safe-B60CMaMF.js";
import "./proxy-env-BEGcORH2.js";
import "./store-HQMCPUEK.js";
import "./tool-images-B2EJtwbr.js";
import "./fetch-guard-BZ8YnXzS.js";
import "./api-key-rotation-C-qkso7T.js";
import "./local-roots-hpA5sUnd.js";
import "./proxy-fetch-CeZ9XkCS.js";
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
