import { a as logVerbose, c as shouldLogVerbose } from "./globals-Bv4ZcVWM.js";
import "./paths-BfR2LXbA.js";
import "./subsystem-B4CcvtwB.js";
import "./boolean-DTgd5CzD.js";
import "./auth-profiles-Ok_29lfs.js";
import "./agent-scope-Ct4K9XNr.js";
import "./utils-C5WN6czr.js";
import "./openclaw-root-BD5PlMF6.js";
import "./logger-DK5MgyI_.js";
import "./exec-Ma6oRU03.js";
import "./github-copilot-token-V8sGXzUU.js";
import "./host-env-security-BqjSpt13.js";
import "./version-CWAlVg1Z.js";
import "./registry-COiI4eXe.js";
import "./manifest-registry-CDX-Vxgs.js";
import "./dock-D5Ul7srh.js";
import "./accounts-Cs7lRJ22.js";
import "./plugins-DH0nf2wM.js";
import "./logging-DYOk_rR3.js";
import "./accounts-C5aOTkts.js";
import "./image-ops-CgkYbHWv.js";
import "./message-channel-DwOOiHnr.js";
import "./pi-embedded-helpers-CBRvxz6e.js";
import "./sandbox-B3ZfWqQX.js";
import "./tool-catalog-BipbxDxK.js";
import "./chrome-DtNznCNZ.js";
import "./tailscale-Ch9Mc7pc.js";
import "./tailnet-CxYaUoxP.js";
import "./ws-BzjlD7jY.js";
import "./auth-DPbW35vL.js";
import "./server-context-BGjLULS5.js";
import "./frontmatter-Hg10Mdyo.js";
import "./env-overrides-lQ9nfNgI.js";
import "./path-alias-guards-Dd9daA8Q.js";
import "./skills-UtzuOmV5.js";
import "./paths-BsQGrIJV.js";
import "./redact-BPv8nenp.js";
import "./errors-Bxy1kFT-.js";
import "./fs-safe-DGIa4SNP.js";
import "./proxy-env-BQ8shHGR.js";
import "./store-CRz4WjkH.js";
import "./ports-fgKk6ALw.js";
import "./trash-qzaIKOIU.js";
import "./server-middleware-B1Hn5Uxq.js";
import "./sessions-CkpVe03D.js";
import "./accounts-BER1yztz.js";
import "./paths-E64m60XY.js";
import "./chat-envelope-CH5bYP5u.js";
import "./tool-images-1mCfmpMJ.js";
import "./thinking-B_wxfji0.js";
import "./models-config-B3eI7jzL.js";
import "./model-catalog-H8j7NulN.js";
import "./fetch-sqY6FCRx.js";
import { _ as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-CQ9UFry3.js";
import "./fetch-guard-DrmhSLIg.js";
import "./image-DiopATC4.js";
import "./tool-display-IDeAbAnn.js";
import "./api-key-rotation-CYoJjZWj.js";
import "./proxy-fetch-B03VJLvi.js";
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
