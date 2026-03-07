import { nt as DEFAULT_ACCOUNT_ID, rt as normalizeAccountId } from "./run-with-concurrency-BlQpCRCl.js";
import "./paths-B9fwHuf0.js";
import { C as sleep } from "./logger-BeJ9d38A.js";
import "./accounts-DXgtJCYj.js";
import { x as resolveToolsBySender } from "./thinking-DQ-RKqyc.js";
import { A as MSTeamsConfigSchema, Dr as hasConfiguredSecretInput, Or as normalizeResolvedSecretInputString, fn as withFileLock, kr as normalizeSecretInputString } from "./model-auth-BEfxZHMu.js";
import "./plugins-_B4xyyDE.js";
import "./accounts-xXd2Iz5K.js";
import "./accounts-DSdLPivi.js";
import "./send-c4T93w3q.js";
import { At as resolveChannelEntryMatchWithFallback, Ot as buildChannelKeyCandidates, jt as resolveNestedAllowlistDecision, kt as normalizeChannelSlug } from "./send-ClNu4Wxa.js";
import { $ as resolveMentionGating, B as resolveEffectiveAllowFromLists, H as DEFAULT_WEBHOOK_MAX_BODY_BYTES, I as formatDocsLink, J as createTypingCallbacks, L as readStoreAllowFromForDmPolicy, Q as buildMediaPayload, U as resolveAllowlistProviderRuntimeGroupPolicy, W as resolveDefaultGroupPolicy, Y as createReplyPrefixOptions, at as DEFAULT_GROUP_HISTORY_LIMIT, ct as clearHistoryEntriesIfEnabled, et as logInboundDrop, ft as formatAllowlistMatchMeta, it as summarizeMapping, lt as recordPendingHistoryEntryIfEnabled, n as dispatchReplyFromConfig, nt as resolveControlCommandGate, pt as resolveAllowlistMatchSimple, q as isDangerousNameMatchingEnabled, rt as mergeAllowlist, st as buildPendingHistoryContextFromMap, t as withReplyDispatcher, tt as logTypingFailure, v as resolveInboundSessionEnvelopeContext, z as resolveDmGroupAccessWithLists } from "./dispatch-BmG42I7I.js";
import { i as isSilentReplyText, n as SILENT_REPLY_TOKEN } from "./tokens-B1MvXdT5.js";
import { j as resolveChannelMediaMaxBytes } from "./deliver-Dx6LJGWV.js";
import "./github-copilot-token-B2m7CSyP.js";
import { a as isPrivateIpAddress } from "./ssrf-Cv2PRyfN.js";
import { t as fetchWithSsrFGuard } from "./fetch-guard-DktFqB-K.js";
import { S as getFileExtension, b as detectMime, x as extensionForMime } from "./message-channel-DPruDb-o.js";
import "./path-alias-guards-3SW7Ksc9.js";
import "./fs-safe-BpD25TdC.js";
import { r as extractOriginalFilename } from "./store-Dz5IlyDO.js";
import { $ as writeJsonFileAtomically, Q as readJsonFileWithFallback } from "./send-DsaQzFc9.js";
import "./local-roots-qCr5T3Ts.js";
import { _ as loadWebMedia } from "./ir-C0QUHVE2.js";
import "./pi-embedded-helpers-CCZOz14D.js";
import "./paths-BlRPJu2t.js";
import "./diagnostic-CU8X1X8C.js";
import "./pi-model-discovery-SCZfBw6K.js";
import "./audio-transcription-runner-CXqR8d92.js";
import "./image-B8SKUTsc.js";
import "./chrome-CnHBY1u4.js";
import "./skills-BTKA4QVh.js";
import "./redact-DqH9HZJJ.js";
import "./errors-CTLuOiLA.js";
import "./tool-images-C-HkPQ-p.js";
import "./api-key-rotation-Bi_eqkKy.js";
import "./proxy-fetch-CO6KBKen.js";
import "./commands-registry-BASBn1oV.js";
import "./skill-commands-BQJUftiD.js";
import "./render-hUn-4tdL.js";
import "./target-errors-XV0SLbiO.js";
import "./channel-activity-lPy9ZWIN.js";
import "./fetch-DIILzBoT.js";
import "./tables-KNukfeow.js";
import "./send-CQTozMlZ.js";
import "./proxy-CgXTW63Y.js";
import "./outbound-attachment-DWGepb72.js";
import "./send-ziSccGYV.js";
import "./manager-CTwpNnTA.js";
import "./query-expansion-LKgQ4tFK.js";
//#region src/channels/plugins/config-schema.ts
function buildChannelConfigSchema(schema) {
	const schemaWithJson = schema;
	if (typeof schemaWithJson.toJSONSchema === "function") return { schema: schemaWithJson.toJSONSchema({
		target: "draft-07",
		unrepresentable: "any"
	}) };
	return { schema: {
		type: "object",
		additionalProperties: true
	} };
}
//#endregion
//#region src/channels/plugins/onboarding/helpers.ts
function addWildcardAllowFrom(allowFrom) {
	const next = (allowFrom ?? []).map((v) => String(v).trim()).filter(Boolean);
	if (!next.includes("*")) next.push("*");
	return next;
}
function mergeAllowFromEntries(current, additions) {
	const merged = [...current ?? [], ...additions].map((v) => String(v).trim()).filter(Boolean);
	return [...new Set(merged)];
}
function splitOnboardingEntries(raw) {
	return raw.split(/[\n,;]+/g).map((entry) => entry.trim()).filter(Boolean);
}
//#endregion
//#region src/channels/plugins/onboarding/channel-access.ts
function parseAllowlistEntries(raw) {
	return splitOnboardingEntries(String(raw ?? ""));
}
function formatAllowlistEntries(entries) {
	return entries.map((entry) => entry.trim()).filter(Boolean).join(", ");
}
async function promptChannelAccessPolicy(params) {
	const options = [{
		value: "allowlist",
		label: "Allowlist (recommended)"
	}];
	if (params.allowOpen !== false) options.push({
		value: "open",
		label: "Open (allow all channels)"
	});
	if (params.allowDisabled !== false) options.push({
		value: "disabled",
		label: "Disabled (block all channels)"
	});
	const initialValue = params.currentPolicy ?? "allowlist";
	return await params.prompter.select({
		message: `${params.label} access`,
		options,
		initialValue
	});
}
async function promptChannelAllowlist(params) {
	const initialValue = params.currentEntries && params.currentEntries.length > 0 ? formatAllowlistEntries(params.currentEntries) : void 0;
	return parseAllowlistEntries(await params.prompter.text({
		message: `${params.label} allowlist (comma-separated)`,
		placeholder: params.placeholder,
		initialValue
	}));
}
async function promptChannelAccessConfig(params) {
	const hasEntries = (params.currentEntries ?? []).length > 0;
	const shouldPrompt = params.defaultPrompt ?? !hasEntries;
	if (!await params.prompter.confirm({
		message: params.updatePrompt ? `Update ${params.label} access?` : `Configure ${params.label} access?`,
		initialValue: shouldPrompt
	})) return null;
	const policy = await promptChannelAccessPolicy({
		prompter: params.prompter,
		label: params.label,
		currentPolicy: params.currentPolicy,
		allowOpen: params.allowOpen,
		allowDisabled: params.allowDisabled
	});
	if (policy !== "allowlist") return {
		policy,
		entries: []
	};
	return {
		policy,
		entries: await promptChannelAllowlist({
			prompter: params.prompter,
			label: params.label,
			currentEntries: params.currentEntries,
			placeholder: params.placeholder
		})
	};
}
//#endregion
//#region src/channels/plugins/pairing-message.ts
const PAIRING_APPROVED_MESSAGE = "✅ OpenClaw access approved. Send a message to start chatting.";
//#endregion
//#region src/plugins/config-schema.ts
function error(message) {
	return {
		success: false,
		error: { issues: [{
			path: [],
			message
		}] }
	};
}
function emptyPluginConfigSchema() {
	return {
		safeParse(value) {
			if (value === void 0) return {
				success: true,
				data: void 0
			};
			if (!value || typeof value !== "object" || Array.isArray(value)) return error("expected config object");
			if (Object.keys(value).length > 0) return error("config must be empty");
			return {
				success: true,
				data: value
			};
		},
		jsonSchema: {
			type: "object",
			additionalProperties: false,
			properties: {}
		}
	};
}
//#endregion
//#region src/plugin-sdk/channel-lifecycle.ts
/**
* Keep a channel/provider task pending until the HTTP server closes.
*
* When an abort signal is provided, `onAbort` is invoked once and should
* trigger server shutdown. The returned promise resolves only after `close`.
*/
async function keepHttpServerTaskAlive(params) {
	const { server, abortSignal, onAbort } = params;
	let abortTask = Promise.resolve();
	let abortTriggered = false;
	const triggerAbort = () => {
		if (abortTriggered) return;
		abortTriggered = true;
		abortTask = Promise.resolve(onAbort?.()).then(() => void 0);
	};
	const onAbortSignal = () => {
		triggerAbort();
	};
	if (abortSignal) if (abortSignal.aborted) triggerAbort();
	else abortSignal.addEventListener("abort", onAbortSignal, { once: true });
	await new Promise((resolve) => {
		server.once("close", () => resolve());
	});
	if (abortSignal) abortSignal.removeEventListener("abort", onAbortSignal);
	await abortTask;
}
//#endregion
//#region src/plugin-sdk/inbound-reply-dispatch.ts
async function dispatchReplyFromConfigWithSettledDispatcher(params) {
	return await withReplyDispatcher({
		dispatcher: params.dispatcher,
		onSettled: params.onSettled,
		run: () => dispatchReplyFromConfig({
			ctx: params.ctxPayload,
			cfg: params.cfg,
			dispatcher: params.dispatcher,
			replyOptions: params.replyOptions
		})
	});
}
//#endregion
//#region src/plugin-sdk/outbound-media.ts
async function loadOutboundMediaFromUrl(mediaUrl, options = {}) {
	return await loadWebMedia(mediaUrl, {
		maxBytes: options.maxBytes,
		localRoots: options.mediaLocalRoots
	});
}
//#endregion
//#region src/plugin-sdk/pairing-access.ts
function createScopedPairingAccess(params) {
	const resolvedAccountId = normalizeAccountId(params.accountId);
	return {
		accountId: resolvedAccountId,
		readAllowFromStore: () => params.core.channel.pairing.readAllowFromStore({
			channel: params.channel,
			accountId: resolvedAccountId
		}),
		readStoreForDmPolicy: (provider, accountId) => params.core.channel.pairing.readAllowFromStore({
			channel: provider,
			accountId: normalizeAccountId(accountId)
		}),
		upsertPairingRequest: (input) => params.core.channel.pairing.upsertPairingRequest({
			channel: params.channel,
			accountId: resolvedAccountId,
			...input
		})
	};
}
//#endregion
//#region src/plugin-sdk/ssrf-policy.ts
function normalizeHostnameSuffix(value) {
	const trimmed = value.trim().toLowerCase();
	if (!trimmed) return "";
	if (trimmed === "*" || trimmed === "*.") return "*";
	return trimmed.replace(/^\*\.?/, "").replace(/^\.+/, "").replace(/\.+$/, "");
}
function isHostnameAllowedBySuffixAllowlist(hostname, allowlist) {
	if (allowlist.includes("*")) return true;
	const normalized = hostname.toLowerCase();
	return allowlist.some((entry) => normalized === entry || normalized.endsWith(`.${entry}`));
}
function normalizeHostnameSuffixAllowlist(input, defaults) {
	const source = input && input.length > 0 ? input : defaults;
	if (!source || source.length === 0) return [];
	const normalized = source.map(normalizeHostnameSuffix).filter(Boolean);
	if (normalized.includes("*")) return ["*"];
	return Array.from(new Set(normalized));
}
function isHttpsUrlAllowedByHostnameSuffixAllowlist(url, allowlist) {
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "https:") return false;
		return isHostnameAllowedBySuffixAllowlist(parsed.hostname, allowlist);
	} catch {
		return false;
	}
}
/**
* Converts suffix-style host allowlists (for example "example.com") into SSRF
* hostname allowlist patterns used by the shared fetch guard.
*
* Suffix semantics:
* - "example.com" allows "example.com" and "*.example.com"
* - "*" disables hostname allowlist restrictions
*/
function buildHostnameAllowlistPolicyFromSuffixAllowlist(allowHosts) {
	const normalizedAllowHosts = normalizeHostnameSuffixAllowlist(allowHosts);
	if (normalizedAllowHosts.length === 0) return;
	const patterns = /* @__PURE__ */ new Set();
	for (const normalized of normalizedAllowHosts) {
		if (normalized === "*") return;
		patterns.add(normalized);
		patterns.add(`*.${normalized}`);
	}
	if (patterns.size === 0) return;
	return { hostnameAllowlist: Array.from(patterns) };
}
//#endregion
//#region src/plugin-sdk/status-helpers.ts
function createDefaultChannelRuntimeState(accountId, extra) {
	return {
		accountId,
		running: false,
		lastStartAt: null,
		lastStopAt: null,
		lastError: null,
		...extra ?? {}
	};
}
function buildBaseChannelStatusSummary(snapshot) {
	return {
		configured: snapshot.configured ?? false,
		running: snapshot.running ?? false,
		lastStartAt: snapshot.lastStartAt ?? null,
		lastStopAt: snapshot.lastStopAt ?? null,
		lastError: snapshot.lastError ?? null
	};
}
function buildProbeChannelStatusSummary(snapshot, extra) {
	return {
		...buildBaseChannelStatusSummary(snapshot),
		...extra ?? {},
		probe: snapshot.probe,
		lastProbeAt: snapshot.lastProbeAt ?? null
	};
}
function buildRuntimeAccountStatusSnapshot(params) {
	const { runtime, probe } = params;
	return {
		running: runtime?.running ?? false,
		lastStartAt: runtime?.lastStartAt ?? null,
		lastStopAt: runtime?.lastStopAt ?? null,
		lastError: runtime?.lastError ?? null,
		probe
	};
}
//#endregion
export { DEFAULT_ACCOUNT_ID, DEFAULT_GROUP_HISTORY_LIMIT, DEFAULT_WEBHOOK_MAX_BODY_BYTES, MSTeamsConfigSchema, PAIRING_APPROVED_MESSAGE, SILENT_REPLY_TOKEN, addWildcardAllowFrom, buildBaseChannelStatusSummary, buildChannelConfigSchema, buildChannelKeyCandidates, buildHostnameAllowlistPolicyFromSuffixAllowlist, buildMediaPayload, buildPendingHistoryContextFromMap, buildProbeChannelStatusSummary, buildRuntimeAccountStatusSnapshot, clearHistoryEntriesIfEnabled, createDefaultChannelRuntimeState, createReplyPrefixOptions, createScopedPairingAccess, createTypingCallbacks, detectMime, dispatchReplyFromConfigWithSettledDispatcher, emptyPluginConfigSchema, extensionForMime, extractOriginalFilename, fetchWithSsrFGuard, formatAllowlistMatchMeta, formatDocsLink, getFileExtension, hasConfiguredSecretInput, isDangerousNameMatchingEnabled, isHttpsUrlAllowedByHostnameSuffixAllowlist, isPrivateIpAddress, isSilentReplyText, keepHttpServerTaskAlive, loadOutboundMediaFromUrl, loadWebMedia, logInboundDrop, logTypingFailure, mergeAllowFromEntries, mergeAllowlist, normalizeChannelSlug, normalizeHostnameSuffixAllowlist, normalizeResolvedSecretInputString, normalizeSecretInputString, promptChannelAccessConfig, readJsonFileWithFallback, readStoreAllowFromForDmPolicy, recordPendingHistoryEntryIfEnabled, resolveAllowlistMatchSimple, resolveAllowlistProviderRuntimeGroupPolicy, resolveChannelEntryMatchWithFallback, resolveChannelMediaMaxBytes, resolveControlCommandGate, resolveDefaultGroupPolicy, resolveDmGroupAccessWithLists, resolveEffectiveAllowFromLists, resolveInboundSessionEnvelopeContext, resolveMentionGating, resolveNestedAllowlistDecision, resolveToolsBySender, sleep, summarizeMapping, withFileLock, writeJsonFileAtomically };
