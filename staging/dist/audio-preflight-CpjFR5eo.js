import "./paths-BBP4yd-2.js";
import { a as logVerbose, c as shouldLogVerbose } from "./globals-DyWRcjQY.js";
import "./utils-xFiJOAuL.js";
import "./thinking-Fqckw03T.js";
import "./agent-scope-Ckfy1eLE.js";
import "./subsystem-D5pRlZe-.js";
import "./openclaw-root-DeEQQJyX.js";
import "./logger-DHGbafYr.js";
import "./exec-XzljJcHM.js";
import "./model-selection-D6yIS4i6.js";
import "./registry-D9k2JaF8.js";
import "./github-copilot-token-b6kJVrW-.js";
import "./boolean-BsqeuxE6.js";
import "./env-BCNBCy-T.js";
import "./manifest-registry-CfBuZDUD.js";
import "./dock-y4QSCOQM.js";
import "./message-channel-FOEqd4n-.js";
import "./plugins-DmEd4pqG.js";
import "./sessions-Dt8vnmQq.js";
import { d as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-pj-KYzxd.js";
import "./image-BpDu8vlv.js";
import "./models-config-DzMwP8CW.js";
import "./pi-embedded-helpers-D2PVJ-a1.js";
import "./sandbox-BL9DTDci.js";
import "./tool-catalog-CCHhmVaK.js";
import "./chrome-Z9yUcaDs.js";
import "./tailscale-BTtkvuxs.js";
import "./tailnet-XGVl9sUv.js";
import "./ws-hC2980ir.js";
import "./auth-BL2Aq1B9.js";
import "./server-context-D9RxmesE.js";
import "./frontmatter-CuoNUw--.js";
import "./skills-CvS3YvgT.js";
import "./path-alias-guards-DuR6tGjh.js";
import "./paths-Ma2-xAwW.js";
import "./redact-C5yfNdVB.js";
import "./errors-kKUPais3.js";
import "./fs-safe-BSN_n9L7.js";
import "./proxy-env-DMYrH3XX.js";
import "./image-ops-ufpabANQ.js";
import "./store-BWQisjX6.js";
import "./ports-NAURVXNF.js";
import "./trash-r73uOrwG.js";
import "./server-middleware-tDRRJpz8.js";
import "./accounts-Gk6U_wCL.js";
import "./accounts-DAImktI2.js";
import "./logging-B-Ool4n-.js";
import "./accounts-V_js5_KL.js";
import "./paths-C_Kd9gsY.js";
import "./chat-envelope-BBn0ocB6.js";
import "./tool-images-CrdvPWWS.js";
import "./tool-display-CoHybMXf.js";
import "./fetch-guard-D9krVfTp.js";
import "./api-key-rotation-8pMvQEIe.js";
import "./local-roots-CvUkPVw-.js";
import "./model-catalog-DwtCLzEV.js";
import "./proxy-fetch-Dj1VTSlt.js";

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