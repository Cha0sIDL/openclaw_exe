import { a as resolveAgentDir, c as resolveAgentWorkspaceDir, l as resolveDefaultAgentId, o as resolveAgentEffectiveModelPrimary } from "./run-with-concurrency-C1raW7MB.js";
import "./paths-hfkBoC7i.js";
import { t as createSubsystemLogger } from "./subsystem-C4EPfZvP.js";
import "./workspace-C-WsJ6YD.js";
import "./logger-CrRR9XqM.js";
import { Tr as DEFAULT_PROVIDER, l as parseModelRef } from "./model-selection-BebDf0Oe.js";
import "./github-copilot-token-CQmATy5E.js";
import "./legacy-names-PdEWCM6o.js";
import "./thinking-e8AYL_Pc.js";
import "./tokens-AfovIVys.js";
import { t as runEmbeddedPiAgent } from "./pi-embedded-Duj9ZRlt.js";
import "./accounts-C-Va__6p.js";
import "./plugins-D8bZQOC6.js";
import "./send-Cp5ni0er.js";
import "./send-D4kNoSE1.js";
import "./deliver-CoNTqNDS.js";
import "./diagnostic-CuUUOc87.js";
import "./accounts-t9UxPKg7.js";
import "./image-ops-bE_0rjXg.js";
import "./send-Cv2kzl1q.js";
import "./pi-model-discovery-DXRJZf5l.js";
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
import "./audio-transcription-runner-ByJvhIA5.js";
import "./fetch-C6-X--uo.js";
import "./fetch-guard-DW6bn9qe.js";
import "./api-key-rotation-ChonxG9E.js";
import "./proxy-fetch-VohjYre9.js";
import "./ir-DBLhVAfx.js";
import "./render-7C7EDC8_.js";
import "./target-errors-Bgv2rq5i.js";
import "./commands-registry-DzSjD7US.js";
import "./skill-commands-BYlQU8Gv.js";
import "./fetch-CONQGbzL.js";
import "./channel-activity-B9PalD2W.js";
import "./tables-CVg0mSpU.js";
import "./send-HCtJQSld.js";
import "./outbound-attachment-Dtib2Ff9.js";
import "./send-DyeZqCvf.js";
import "./proxy-BzwL4n0W.js";
import "./manager-D6SGLc61.js";
import "./query-expansion-Bwu67gdy.js";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/hooks/llm-slug-generator.ts
/**
* LLM-based slug generator for session memory filenames
*/
const log = createSubsystemLogger("llm-slug-generator");
/**
* Generate a short 1-2 word filename slug from session content using LLM
*/
async function generateSlugViaLLM(params) {
	let tempSessionFile = null;
	try {
		const agentId = resolveDefaultAgentId(params.cfg);
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
		const agentDir = resolveAgentDir(params.cfg, agentId);
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-slug-"));
		tempSessionFile = path.join(tempDir, "session.jsonl");
		const prompt = `Based on this conversation, generate a short 1-2 word filename slug (lowercase, hyphen-separated, no file extension).

Conversation summary:
${params.sessionContent.slice(0, 2e3)}

Reply with ONLY the slug, nothing else. Examples: "vendor-pitch", "api-design", "bug-fix"`;
		const modelRef = resolveAgentEffectiveModelPrimary(params.cfg, agentId);
		const parsed = modelRef ? parseModelRef(modelRef, DEFAULT_PROVIDER) : null;
		const provider = parsed?.provider ?? "anthropic";
		const model = parsed?.model ?? "claude-opus-4-6";
		const result = await runEmbeddedPiAgent({
			sessionId: `slug-generator-${Date.now()}`,
			sessionKey: "temp:slug-generator",
			agentId,
			sessionFile: tempSessionFile,
			workspaceDir,
			agentDir,
			config: params.cfg,
			prompt,
			provider,
			model,
			timeoutMs: 15e3,
			runId: `slug-gen-${Date.now()}`
		});
		if (result.payloads && result.payloads.length > 0) {
			const text = result.payloads[0]?.text;
			if (text) return text.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || null;
		}
		return null;
	} catch (err) {
		const message = err instanceof Error ? err.stack ?? err.message : String(err);
		log.error(`Failed to generate slug: ${message}`);
		return null;
	} finally {
		if (tempSessionFile) try {
			await fs.rm(path.dirname(tempSessionFile), {
				recursive: true,
				force: true
			});
		} catch {}
	}
}
//#endregion
export { generateSlugViaLLM };
