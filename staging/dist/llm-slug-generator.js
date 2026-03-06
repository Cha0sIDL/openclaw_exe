import { a as resolveAgentDir, c as resolveAgentWorkspaceDir, l as resolveDefaultAgentId, o as resolveAgentEffectiveModelPrimary } from "./run-with-concurrency-CzUbPnkS.js";
import "./paths-C6TxBCvO.js";
import { t as createSubsystemLogger } from "./subsystem-D7UWJNhH.js";
import "./workspace-B1VBj0cY.js";
import "./logger-B-R_-5mh.js";
import { Cr as DEFAULT_PROVIDER, Sr as DEFAULT_MODEL, l as parseModelRef } from "./model-selection-CMGcSezC.js";
import "./github-copilot-token-D13V9YBz.js";
import "./legacy-names-BCm4ov65.js";
import "./thinking-CWTLku2g.js";
import "./tokens-Csbpu55k.js";
import { t as runEmbeddedPiAgent } from "./pi-embedded-COPIxB-N.js";
import "./accounts-CFmx3Ko8.js";
import "./plugins-xdrpMlbb.js";
import "./send-DK2Qq7Q8.js";
import "./send-B7YAq4iR.js";
import "./deliver-CJafxnVk.js";
import "./diagnostic-BHeUaYDb.js";
import "./accounts-BGFa9f-K.js";
import "./image-ops-CZyWVo3J.js";
import "./send-B33olMh0.js";
import "./pi-model-discovery-CybKBU2K.js";
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
import "./audio-transcription-runner-CptLNA_4.js";
import "./fetch-ChItq85A.js";
import "./fetch-guard-NC0zgpoh.js";
import "./api-key-rotation-zd1593PT.js";
import "./proxy-fetch-CF5kidRK.js";
import "./ir-BTWnurHH.js";
import "./render-DW7AcFdD.js";
import "./target-errors-CmfYcvda.js";
import "./commands-registry-D88O9lbl.js";
import "./skill-commands-Bh-m92m4.js";
import "./fetch-BfuG8uZ8.js";
import "./channel-activity-BWCDy7rb.js";
import "./tables-BjlPmYDz.js";
import "./send-YarWUTVS.js";
import "./outbound-attachment-CL_CnCT4.js";
import "./send-CvvoqlSY.js";
import "./proxy-CecQTx_Z.js";
import "./manager-_o21DoNC.js";
import "./query-expansion-D5Cn44Qx.js";
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
		const provider = parsed?.provider ?? DEFAULT_PROVIDER;
		const model = parsed?.model ?? DEFAULT_MODEL;
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