import "./accounts-yrtVsn_Y.js";
import "./paths-DVWx7USN.js";
import "./github-copilot-token-Cg0YPPSu.js";
import "./config-CIl48WCb.js";
import { $ as logVerbose, nt as shouldLogVerbose } from "./subsystem-C2adF5U4.js";
import "./command-format-DgW0zcnY.js";
import "./agent-scope-C3RYg0D_.js";
import "./dock-D7MBY_Iu.js";
import "./message-channel-ChlcDAOp.js";
import "./sessions-CTjFZbrn.js";
import "./plugins-BHd2rsCe.js";
import "./accounts-BipXbLZs.js";
import "./accounts-Du0IO0oz.js";
import "./bindings-DbarLVcw.js";
import "./paths-DErPP5Pi.js";
import "./redact-CWxcbEXj.js";
import "./errors-D0xt6lgD.js";
import "./path-alias-guards-CAudg7_g.js";
import "./fs-safe-DT_VpYHA.js";
import "./image-ops-DKwIuQVy.js";
import "./ssrf-D07_rJxG.js";
import "./fetch-guard-CYsbL_HO.js";
import "./local-roots-rFR2J_2C.js";
import "./tool-images-BWcRj5-a.js";
import { a as resolveMediaAttachmentLocalRoots, n as createMediaAttachmentCache, o as runCapability, r as normalizeMediaAttachments, t as buildProviderRegistry, u as isAudioAttachment } from "./runner-MlGUt-kF.js";
import "./skills-CZIr9PbN.js";
import "./chrome-BXM3gaJN.js";
import "./store-DpuSew7B.js";
import "./pi-embedded-helpers-B05EekcW.js";
import "./thinking-BpFZfHN9.js";
import "./image-C2UHSBnV.js";
import "./pi-model-discovery-DO8u-Qoh.js";
import "./api-key-rotation-B4B9kIvx.js";

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
	const providerRegistry = buildProviderRegistry(params.providers);
	const cache = createMediaAttachmentCache(attachments, { localPathRoots: resolveMediaAttachmentLocalRoots({
		cfg,
		ctx
	}) });
	try {
		const result = await runCapability({
			capability: "audio",
			cfg,
			ctx,
			attachments: cache,
			media: attachments,
			agentDir: params.agentDir,
			providerRegistry,
			config: audioConfig,
			activeModel: params.activeModel
		});
		if (!result || result.outputs.length === 0) return;
		const audioOutput = result.outputs.find((output) => output.kind === "audio.transcription");
		if (!audioOutput || !audioOutput.text) return;
		firstAudio.alreadyTranscribed = true;
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribed ${audioOutput.text.length} chars from attachment ${firstAudio.index}`);
		return audioOutput.text;
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcription failed: ${String(err)}`);
		return;
	} finally {
		await cache.cleanup();
	}
}

//#endregion
export { transcribeFirstAudio };