import { a as resolveAgentEffectiveModelPrimary, c as resolveDefaultAgentId, i as resolveAgentDir, s as resolveAgentWorkspaceDir } from "./agent-scope-k12jKXhS.js";
import "./paths-MYHBPf85.js";
import { t as createSubsystemLogger } from "./subsystem-BXiyX1bx.js";
import "./workspace-DwThIdv7.js";
import { bn as DEFAULT_PROVIDER, l as parseModelRef, yn as DEFAULT_MODEL } from "./model-selection-C2zD9rZJ.js";
import "./github-copilot-token-DyM1y5Pr.js";
import "./env-3aLfHpTH.js";
import "./boolean-Ce2-qkSB.js";
import "./dock-vFezfkCT.js";
import "./tokens-DyF4Dnn6.js";
import { t as runEmbeddedPiAgent } from "./pi-embedded-CHuT0zL3.js";
import "./plugins-BtRPsLDX.js";
import "./accounts-DAIgQtGr.js";
import "./bindings-CcUvlrvu.js";
import "./send-Bd_9h8E9.js";
import "./send-C19FMiHZ.js";
import "./deliver-ZDT7Nwwx.js";
import "./diagnostic-BrRbyVl7.js";
import "./diagnostic-session-state-_tGY1a3B.js";
import "./accounts-B_TpBJTR.js";
import "./send-z7MRYnYh.js";
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
import "./reply-prefix-BOctIOXu.js";
import "./manager-BZNV0EUS.js";
import "./gemini-auth-VFEYUvjK.js";
import "./fetch-guard-DsJJm-9c.js";
import "./query-expansion-Doc3pldv.js";
import "./retry-DKGfbHpA.js";
import "./target-errors-ZJ2oHKSY.js";
import "./chunk-D_YMnoam.js";
import "./markdown-tables-DiJ_nNzE.js";
import "./local-roots-BrXfZKFY.js";
import "./ir-aSOZ7e5O.js";
import "./render-loap2gRq.js";
import "./commands-registry-wiJOplOg.js";
import "./skill-commands-CDWhAe7x.js";
import "./runner-MF2w1NwB.js";
import "./fetch-B1nZSYJF.js";
import "./channel-activity-C57Zidf6.js";
import "./tables-CXiEbgjc.js";
import "./send-C_z4r8hG.js";
import "./outbound-attachment-DiBtELUt.js";
import "./send-QaiBPSG2.js";
import "./resolve-route-qOffdv5M.js";
import "./proxy-Bee2aKQk.js";
import "./replies-rLJ3ModZ.js";
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