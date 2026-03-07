import "./message-channel-DKhmLKbn.js";
import { L as logVerbose, z as shouldLogVerbose } from "./utils-CRWW6TlT.js";
import "./paths-Dmn791zP.js";
import "./tool-images-YfaTOvUj.js";
import "./run-with-concurrency-D7pi7JWf.js";
import "./model-auth-CeqyUT3y.js";
import "./github-copilot-token-Dd61hN7H.js";
import "./thinking-DaGh6pJs.js";
import "./ssrf-BxOowUJg.js";
import "./fetch-guard-CQPlORUu.js";
import "./accounts-B8D01RUu.js";
import "./plugins-PWME-iPc.js";
import "./pi-embedded-helpers-flrQUKFF.js";
import "./accounts-DiseXDW3.js";
import "./accounts-DA3m7wfI.js";
import "./paths-CBpVWw1O.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, p as isAudioAttachment, t as runAudioTranscription } from "./audio-transcription-runner-DUzJ9p5H.js";
import "./image-D0g3r_0E.js";
import "./chrome-mIZnjOxc.js";
import "./skills-AvcMUIbd.js";
import "./path-alias-guards-CTafI77c.js";
import "./redact-DC5QZh88.js";
import "./errors-Y5v4UB27.js";
import "./fs-safe-BQyLyMpm.js";
import "./store-Bt4ar0TV.js";
import "./api-key-rotation-BuvWhY3o.js";
import "./local-roots-CQmtV-Dx.js";
import "./proxy-fetch-CH_RVIlN.js";
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
