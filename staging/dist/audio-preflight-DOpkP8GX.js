import "./agent-scope-k12jKXhS.js";
import "./paths-MYHBPf85.js";
import { $ as shouldLogVerbose, X as logVerbose } from "./subsystem-BXiyX1bx.js";
import "./workspace-DwThIdv7.js";
import "./model-selection-C2zD9rZJ.js";
import "./github-copilot-token-DyM1y5Pr.js";
import "./env-3aLfHpTH.js";
import "./boolean-Ce2-qkSB.js";
import "./dock-vFezfkCT.js";
import "./plugins-BtRPsLDX.js";
import "./accounts-DAIgQtGr.js";
import "./bindings-CcUvlrvu.js";
import "./accounts-B_TpBJTR.js";
import "./image-ops-DJziOGJI.js";
import "./pi-model-discovery-CKZ51YTK.js";
import "./message-channel-BWtwhs1r.js";
import "./pi-embedded-helpers-gX6qUVIk.js";
import "./chrome-0WRKRDI5.js";
import "./ssrf-GR1wTjsC.js";
import "./frontmatter-CthhXKqf.js";
import "./skills-CTeQbz5-.js";
import "./path-alias-guards-Vg4jKJqV.js";
import "./redact-wETe5qIl.js";
import "./errors-ep9Fblgx.js";
import "./fs-safe-Ds7pa6r3.js";
import "./store-TIxNA9I5.js";
import "./sessions-D9oxnTKX.js";
import "./accounts-DldIIlOx.js";
import "./paths-6XrpQmMB.js";
import "./tool-images-8jEcsiPn.js";
import "./thinking-CJoHneR6.js";
import "./image-CGBthxON.js";
import "./gemini-auth-VFEYUvjK.js";
import "./fetch-guard-DsJJm-9c.js";
import "./local-roots-BrXfZKFY.js";
import { a as resolveMediaAttachmentLocalRoots, n as createMediaAttachmentCache, o as runCapability, r as normalizeMediaAttachments, t as buildProviderRegistry, u as isAudioAttachment } from "./runner-MF2w1NwB.js";

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