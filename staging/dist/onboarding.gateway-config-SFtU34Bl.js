import "./paths-BJV7vkaX.js";
import "./globals-BM8hKFm0.js";
import "./utils-DC4zYvW0.js";
import "./agent-scope-BjNYwuUO.js";
import "./subsystem-B-oDv-jG.js";
import "./openclaw-root-Bm1aZrog.js";
import "./logger-CS_BtBMJ.js";
import "./exec-M8Rb4KML.js";
import { Wr as ensureControlUiAllowedOriginsForNonLoopbackBind } from "./model-selection-Ct4JRMnm.js";
import { d as resolveSecretInputRef, l as normalizeSecretInputString } from "./types.secrets-ZqKzSyNC.js";
import "./github-copilot-token-D37fjdwy.js";
import "./boolean-CJxfhBkG.js";
import "./env-BCEGmRqf.js";
import "./host-env-security-3W3usp5X.js";
import "./registry-DTGNhZ2I.js";
import "./manifest-registry-BkD5G9c-.js";
import "./dock-BE996V7g.js";
import "./message-channel-SQk3PfR_.js";
import "./plugins-Dqx9Ki_e.js";
import "./sessions-CCYTHV0b.js";
import { a as findTailscaleBinary } from "./tailscale-DI4s2-Gr.js";
import "./tailnet-DDDvYK0o.js";
import "./ws-DTH7lPMz.js";
import "./accounts-BYXZoHmE.js";
import "./accounts-Cb-TYjNx.js";
import "./logging-CK-b_j6J.js";
import "./accounts-B7qIxnuY.js";
import "./paths-COpaT9Gf.js";
import "./chat-envelope-C16Rx042.js";
import "./client-SbKzE96g.js";
import "./call-anvtKqEC.js";
import "./pairing-token-JyHgxIPg.js";
import { h as randomToken, u as normalizeGatewayTokenInput, y as validateGatewayPasswordInput } from "./onboard-helpers--etFdTIT.js";
import "./prompt-style-CbhWkaLh.js";
import { c as resolveSecretInputModeForEnvSelection, s as promptSecretRefForOnboarding } from "./auth-choice.apply-helpers-BTb7vwm5.js";
import { t as resolveOnboardingSecretInputString } from "./onboarding.secret-input-B_Y0ecBJ.js";
import { t as DEFAULT_DANGEROUS_NODE_COMMANDS } from "./node-command-policy-B2f3eSK4.js";
import { a as maybeAddTailnetOriginToControlUiAllowedOrigins, i as TAILSCALE_MISSING_BIN_NOTE_LINES, n as TAILSCALE_DOCS_LINES, r as TAILSCALE_EXPOSURE_OPTIONS, t as validateIPv4AddressInput } from "./ipv4-DP8uq4is.js";
//#region src/wizard/onboarding.gateway-config.ts
async function configureGatewayForOnboarding(opts) {
	const { flow, localPort, quickstartGateway, prompter } = opts;
	let { nextConfig } = opts;
	const port = flow === "quickstart" ? quickstartGateway.port : Number.parseInt(String(await prompter.text({
		message: "Gateway port",
		initialValue: String(localPort),
		validate: (value) => Number.isFinite(Number(value)) ? void 0 : "Invalid port"
	})), 10);
	let bind = flow === "quickstart" ? quickstartGateway.bind : await prompter.select({
		message: "Gateway bind",
		options: [
			{
				value: "loopback",
				label: "Loopback (127.0.0.1)"
			},
			{
				value: "lan",
				label: "LAN (0.0.0.0)"
			},
			{
				value: "tailnet",
				label: "Tailnet (Tailscale IP)"
			},
			{
				value: "auto",
				label: "Auto (Loopback → LAN)"
			},
			{
				value: "custom",
				label: "Custom IP"
			}
		]
	});
	let customBindHost = quickstartGateway.customBindHost;
	if (bind === "custom") {
		if (flow !== "quickstart" || !customBindHost) {
			const input = await prompter.text({
				message: "Custom IP address",
				placeholder: "192.168.1.100",
				initialValue: customBindHost ?? "",
				validate: validateIPv4AddressInput
			});
			customBindHost = typeof input === "string" ? input.trim() : void 0;
		}
	}
	let authMode = flow === "quickstart" ? quickstartGateway.authMode : await prompter.select({
		message: "Gateway auth",
		options: [{
			value: "token",
			label: "Token",
			hint: "Recommended default (local + remote)"
		}, {
			value: "password",
			label: "Password"
		}],
		initialValue: "token"
	});
	const tailscaleMode = flow === "quickstart" ? quickstartGateway.tailscaleMode : await prompter.select({
		message: "Tailscale exposure",
		options: [...TAILSCALE_EXPOSURE_OPTIONS]
	});
	let tailscaleBin = null;
	if (tailscaleMode !== "off") {
		tailscaleBin = await findTailscaleBinary();
		if (!tailscaleBin) await prompter.note(TAILSCALE_MISSING_BIN_NOTE_LINES.join("\n"), "Tailscale Warning");
	}
	let tailscaleResetOnExit = flow === "quickstart" ? quickstartGateway.tailscaleResetOnExit : false;
	if (tailscaleMode !== "off" && flow !== "quickstart") {
		await prompter.note(TAILSCALE_DOCS_LINES.join("\n"), "Tailscale");
		tailscaleResetOnExit = Boolean(await prompter.confirm({
			message: "Reset Tailscale serve/funnel on exit?",
			initialValue: false
		}));
	}
	if (tailscaleMode !== "off" && bind !== "loopback") {
		await prompter.note("Tailscale requires bind=loopback. Adjusting bind to loopback.", "Note");
		bind = "loopback";
		customBindHost = void 0;
	}
	if (tailscaleMode === "funnel" && authMode !== "password") {
		await prompter.note("Tailscale funnel requires password auth.", "Note");
		authMode = "password";
	}
	let gatewayToken;
	let gatewayTokenInput;
	if (authMode === "token") {
		const quickstartTokenString = normalizeSecretInputString(quickstartGateway.token);
		const quickstartTokenRef = resolveSecretInputRef({
			value: quickstartGateway.token,
			defaults: nextConfig.secrets?.defaults
		}).ref;
		if ((flow === "quickstart" && opts.secretInputMode !== "ref" ? quickstartTokenRef ? "ref" : "plaintext" : await resolveSecretInputModeForEnvSelection({
			prompter,
			explicitMode: opts.secretInputMode,
			copy: {
				modeMessage: "How do you want to provide the gateway token?",
				plaintextLabel: "Generate/store plaintext token",
				plaintextHint: "Default",
				refLabel: "Use SecretRef",
				refHint: "Store a reference instead of plaintext"
			}
		})) === "ref") if (flow === "quickstart" && quickstartTokenRef) {
			gatewayTokenInput = quickstartTokenRef;
			gatewayToken = await resolveOnboardingSecretInputString({
				config: nextConfig,
				value: quickstartTokenRef,
				path: "gateway.auth.token",
				env: process.env
			});
		} else {
			const resolved = await promptSecretRefForOnboarding({
				provider: "gateway-auth-token",
				config: nextConfig,
				prompter,
				preferredEnvVar: "OPENCLAW_GATEWAY_TOKEN",
				copy: {
					sourceMessage: "Where is this gateway token stored?",
					envVarPlaceholder: "OPENCLAW_GATEWAY_TOKEN"
				}
			});
			gatewayTokenInput = resolved.ref;
			gatewayToken = resolved.resolvedValue;
		}
		else if (flow === "quickstart") {
			gatewayToken = (quickstartTokenString ?? normalizeGatewayTokenInput(process.env.OPENCLAW_GATEWAY_TOKEN)) || randomToken();
			gatewayTokenInput = gatewayToken;
		} else {
			gatewayToken = normalizeGatewayTokenInput(await prompter.text({
				message: "Gateway token (blank to generate)",
				placeholder: "Needed for multi-machine or non-loopback access",
				initialValue: quickstartTokenString ?? normalizeGatewayTokenInput(process.env.OPENCLAW_GATEWAY_TOKEN) ?? ""
			})) || randomToken();
			gatewayTokenInput = gatewayToken;
		}
	}
	if (authMode === "password") {
		let password = flow === "quickstart" && quickstartGateway.password ? quickstartGateway.password : void 0;
		if (!password) if (await resolveSecretInputModeForEnvSelection({
			prompter,
			explicitMode: opts.secretInputMode,
			copy: {
				modeMessage: "How do you want to provide the gateway password?",
				plaintextLabel: "Enter password now",
				plaintextHint: "Stores the password directly in OpenClaw config"
			}
		}) === "ref") password = (await promptSecretRefForOnboarding({
			provider: "gateway-auth-password",
			config: nextConfig,
			prompter,
			preferredEnvVar: "OPENCLAW_GATEWAY_PASSWORD",
			copy: {
				sourceMessage: "Where is this gateway password stored?",
				envVarPlaceholder: "OPENCLAW_GATEWAY_PASSWORD"
			}
		})).ref;
		else password = String(await prompter.text({
			message: "Gateway password",
			validate: validateGatewayPasswordInput
		}) ?? "").trim();
		nextConfig = {
			...nextConfig,
			gateway: {
				...nextConfig.gateway,
				auth: {
					...nextConfig.gateway?.auth,
					mode: "password",
					password
				}
			}
		};
	} else if (authMode === "token") nextConfig = {
		...nextConfig,
		gateway: {
			...nextConfig.gateway,
			auth: {
				...nextConfig.gateway?.auth,
				mode: "token",
				token: gatewayTokenInput
			}
		}
	};
	nextConfig = {
		...nextConfig,
		gateway: {
			...nextConfig.gateway,
			port,
			bind,
			...bind === "custom" && customBindHost ? { customBindHost } : {},
			tailscale: {
				...nextConfig.gateway?.tailscale,
				mode: tailscaleMode,
				resetOnExit: tailscaleResetOnExit
			}
		}
	};
	nextConfig = ensureControlUiAllowedOriginsForNonLoopbackBind(nextConfig, { requireControlUiEnabled: true }).config;
	nextConfig = await maybeAddTailnetOriginToControlUiAllowedOrigins({
		config: nextConfig,
		tailscaleMode,
		tailscaleBin
	});
	if (!quickstartGateway.hasExisting && nextConfig.gateway?.nodes?.denyCommands === void 0 && nextConfig.gateway?.nodes?.allowCommands === void 0 && nextConfig.gateway?.nodes?.browser === void 0) nextConfig = {
		...nextConfig,
		gateway: {
			...nextConfig.gateway,
			nodes: {
				...nextConfig.gateway?.nodes,
				denyCommands: [...DEFAULT_DANGEROUS_NODE_COMMANDS]
			}
		}
	};
	return {
		nextConfig,
		settings: {
			port,
			bind,
			customBindHost: bind === "custom" ? customBindHost : void 0,
			authMode,
			gatewayToken,
			tailscaleMode,
			tailscaleResetOnExit
		}
	};
}
//#endregion
export { configureGatewayForOnboarding };
